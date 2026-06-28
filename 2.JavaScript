/**
 * Physics Engine สากลประจำตัวเกมสำหรับคำนวณพฤติกรรมทางจลนศาสตร์
 */
export class PhysicsSystem {
  /**
   * คำนวณความเร็วและแรงเฉื่อยแบบนุ่มนวล (Friction & Velocity Update)
   * @param {Object} entity - วัตถุที่ต้องการคำนวณ (ต้องมีพิกัด vx, vy, friction, accel)
   * @param {number} dt - Fixed Delta Time
   */
  static applyKinematics(entity, dt) {
    const dtFactor = dt / 16.67; // นำมา Normalize เทียบกับฐานคติ 60 FPS

    // นำแรงเสียดทาน (Friction) มาหักล้างความเร็วเมื่อไม่มีอินพุตส่งเข้ามา
    entity.vx *= Math.pow(entity.friction, dtFactor);
    entity.vy *= Math.pow(entity.friction, dtFactor);

    // ป้องกันค่าตัวเลขทางคณิตศาสตร์สลายตัวเป็นเศษทศนิยมไม่รู้จบ (Underflow Cleanup)
    if (Math.abs(entity.vx) < 0.01) entity.vx = 0;
    if (Math.abs(entity.vy) < 0.01) entity.vy = 0;

    // อัปเดตตำแหน่งพิกเซลจริงในโลก (World Position)
    entity.x += entity.vx * dtFactor;
    entity.y += entity.vy * dtFactor;
  }

  /**
   * คำนวณและอัปเดตสเตทคูลดาวน์รวมถึงเฟรมอมตะ (i-Frames)
   * @param {Object} entity - ตัวละครหรือมอนสเตอร์
   * @param {number} dt - Delta Time
   */
  static updateTimers(entity, dt) {
    const dtSec = dt / 1000;

    if (entity.invincible > 0) {
      entity.invincible = Math.max(0, entity.invincible - dtSec);
    }
    if (entity.dashCooldown > 0) {
      entity.dashCooldown = Math.max(0, entity.dashCooldown - dtSec);
    }
    if (entity.attackCooldown > 0) {
      entity.attackCooldown = Math.max(0, entity.attackCooldown - dtSec);
    }
  }
}
