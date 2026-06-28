import { globalEvents } from './eventbus.js';

/**
 * Asset Loader System (สถาปัตยกรรมจัดการทรัพยากรเกมแบบ Async)
 */
export class AssetLoader {
  constructor() {
    this.images = {};
    this.audio = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  /**
   * ลงทะเบียนรายการไฟล์ที่ต้องการจะพรีโหลด
   * @param {Object} manifests - รายชื่อไฟล์ภาพและเสียง { images: {...}, audio: {...} }
   */
  queueManifest(manifests) {
    this.imageManifest = manifests.images || {};
    this.audioManifest = manifests.audio || {};
    this.totalAssets = Object.keys(this.imageManifest).length + Object.keys(this.audioManifest).length;
  }

  /**
   * สั่งเริ่มดาวน์โหลดไฟล์ทั้งหมดในคิวแบบคู่ขนาน (Asynchronous Parallel Loading)
   */
  async loadAll() {
    if (this.totalAssets === 0) {
      globalEvents.emit('loader_complete');
      return;
    }

    const imagePromises = Object.entries(this.imageManifest).map(([key, src]) => {
      return this.loadImage(key, src);
    });

    const audioPromises = Object.entries(this.audioManifest).map(([key, src]) => {
      return this.loadAudio(key, src);
    });

    // รอคอยให้ Assets ทุกชิ้นโหลดเสร็จสมบูรณ์
    await Promise.all([...imagePromises, ...audioPromises]);
    globalEvents.emit('loader_complete', { images: this.images, audio: this.audio });
  }

  loadImage(key, src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.images[key] = img;
        this.assetLoaded();
        resolve(img);
      };
      img.onerror = () => {
        console.error(`💥 Failed to load image: ${src}`);
        this.assetLoaded(); // ข้ามไปเพื่อไม่ให้เกมค้าง
        resolve(null);
      };
    });
  }

  loadAudio(key, src) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = src;
      audio.oncanplaythrough = () => {
        this.audio[key] = audio;
        this.assetLoaded();
        resolve(audio);
      };
      audio.onerror = () => {
        console.error(`💥 Failed to load audio: ${src}`);
        this.assetLoaded();
        resolve(null);
      };
    });
  }

  assetLoaded() {
    this.loadedAssets++;
    const progress = this.loadedAssets / this.totalAssets;
    // ส่งเหตุการณ์ความคืบหน้าออกไปเพื่อให้ UI หน้าจอดาวน์โหลด (Loading UI) นำไปแสดงผล
    globalEvents.emit('loader_progress', { progress, loaded: this.loadedAssets, total: this.totalAssets });
  }
}
