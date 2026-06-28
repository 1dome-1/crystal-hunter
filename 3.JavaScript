import { globalEvents } from './eventbus.js';

/**
 * Save System ควบคุมการจัดเก็บ อ่านค่า และกู้คืนข้อมูลเกมสากล
 */
export class SaveSystem {
  constructor(storageKey = "crystal_hunter_save_v1") {
    this.storageKey = storageKey;
  }

  /**
   * บันทึก Game State ลงสู่เครื่องผู้เล่น
   * @param {Object} stateData - ข้อมูลดิบที่ถูกสกัดมาจากตัวแปรสเตทกลาง
   */
  save(stateData) {
    try {
      const saveData = {
        version: "1.0",
        timestamp: Date.now(),
        data: stateData
      };
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
      globalEvents.emit('save_success');
      return true;
    } catch (error) {
      console.error("💥 Critical: Save game failed", error);
      globalEvents.emit('save_error', error);
      return false;
    }
  }

  /**
   * ดึงข้อมูลเซฟเกมกลับคืนมาสู่หน่วยความจำหลัก
   * @returns {Object|null} ข้อมูล Game State ดิบ หรือ null ถ้าไม่พบไฟล์เซฟเดิม
   */
  load() {
    try {
      const rawData = localStorage.getItem(this.storageKey);
      if (!rawData) return null;

      const parsedSave = JSON.parse(rawData);
      globalEvents.emit('load_success');
      return parsedSave.data;
    } catch (error) {
      console.error("💥 Critical: Load game failed", error);
      globalEvents.emit('load_error', error);
      return null;
    }
  }

  /**
   * ล้างประวัติลบไฟล์เซฟเกมออกจากเบราว์เซอร์
   */
  clear() {
    localStorage.removeItem(this.storageKey);
    globalEvents.emit('save_cleared');
  }
}
