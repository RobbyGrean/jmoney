# Phase Handoff — Optional Organization Mode

สถานะเริ่มต้น: `Discovery Only`  
รุ่นฐาน: แนะนำหลัง `3.0.0`  
รุ่นเป้าหมาย: ยังไม่กำหนด อาจเป็น `3.1+` หรือผลิตภัณฑ์แยก  
Dependency: Modular architecture และ evidence จากผู้ใช้หลายเครื่อง  
วิธีสั่งงานที่แนะนำ: Chat discovery ก่อน; ห้ามเริ่ม `/goal` implementation จน owner อนุมัติ requirement

---

## 1. เหตุผลที่เป็น Optional

โหมดองค์กรเพิ่มความเสี่ยง:

- ข้อมูลส่วนบุคคลข้ามเครื่อง
- conflict ของ catalog/template
- permission/identity
- network availability
- audit requirements
- backup ownership
- support burden

จึงทำเมื่อมี demand จริง ไม่ทำเพียงเพื่อให้ feature list ดูใหญ่

---

## 2. Discovery Questions ที่ต้องตอบ

### ผู้ใช้และเครื่อง

- จำนวนผู้ใช้จริง
- จำนวนเครื่อง
- ใช้ Windows domain หรือไม่
- คนเดียวใช้หลายเครื่อง หรือหลายคนใช้ชุดเดียว
- ต้องทำงาน offline นานเท่าใด

### ข้อมูล

- อะไรต้องแชร์: Template, Tag, catalog, saved data หรือ output
- ข้อมูลใดห้ามออกจากเครื่อง
- retention และ backup policy
- เอกสารมี classification หรือไม่

### สิทธิ์

- ใครเป็น User
- ใครเป็น Template Admin
- ใครอนุมัติ Activate
- ต้องใช้ PIN, Windows identity หรือ account กลาง
- ต้องมี separation of duties หรือไม่

### Synchronization

- shared network folder เพียงพอหรือไม่
- ต้อง sync แบบ offline-first หรือไม่
- conflict resolution ต้องระดับไฟล์หรือ field
- ใครเป็น source of truth

### Audit

- ต้องรู้ว่าใครแก้อะไรเมื่อใด
- log ต้องลงนาม/กันแก้หรือไม่
- audit เก็บกี่ปี

### Deployment

- มี IT admin หรือไม่
- อนุญาต code-signing/MSI/GPO หรือไม่
- update ต้อง centrally managed หรือไม่

---

## 3. Options ที่ต้องประเมิน

| Option | เหมาะเมื่อ | ความเสี่ยง |
|---|---|---|
| Export/Import profile/package | แชร์ไม่บ่อยและต้องการ offline | manual version/conflict |
| Signed package repository บน network folder | หน่วยงาน LAN เดียว | file locking/network outage |
| Git-backed template repository สำหรับ admin | admin มีทักษะ Git | ไม่เหมาะผู้ใช้ทั่วไป |
| Local app + central metadata service | ต้องมี identity/audit | server/privacy/operations |
| Full web/cloud platform | ต้องทำงานร่วมกันแบบ real-time | เปลี่ยน product/architecture สูง |

ค่าเริ่มต้นที่แนะนำ:

```text
Signed Template Package + Explicit Import
```

ก่อนพิจารณา sync อัตโนมัติ

---

## 4. Potential Scope หลัง Discovery

- organization profile export/import
- admin PIN หรือ Windows identity gate
- role-based actions
- approve-before-activate
- signed Template Packages
- audit event log
- compare package/template versions
- shared repository แบบ read-only สำหรับผู้ใช้
- conflict preview
- central deployment documentation

ไม่ควรรวม saved data/output ใน shared template channel โดย default

---

## 5. Architecture Gate

ก่อนอนุมัติ implementation ต้องมี ADR ที่ตอบ:

- local-only boundary เปลี่ยนหรือไม่
- threat model
- data classification
- identity source
- synchronization source of truth
- conflict semantics
- offline behavior
- backup/restore owner
- deployment/update owner
- exit/rollback strategy

---

## 6. Discovery Acceptance Criteria

Discovery เสร็จเมื่อ:

- มี stakeholder/use-case จริง
- user/device/data matrix ครบ
- security/privacy constraints ยืนยัน
- option comparison มี cost/operations
- เลือก architecture หรือเลือก “ยังไม่ทำ”
- MVP scope/non-goal ชัด
- threat model และ acceptance tests พร้อม
- owner อนุมัติ version และ Goal

---

## 7. Prompt สำหรับ Chat Discovery

ใช้ Prompt นี้ก่อนเสมอ:

```text
อ่าน README.md, ROADMAP_HANDOFF_TH.md และ
docs/roadmap/PHASE-OPTIONAL-ORGANIZATION.md ให้ครบ

ทำ discovery สำหรับ Organization Mode โดยห้ามแก้ source:
1. ถามคำถามทีละชุดเรื่องผู้ใช้/เครื่อง/ข้อมูล/สิทธิ์/sync/audit/deployment
2. แยก confirmed facts, assumptions และ unknowns
3. สร้าง user-device-data-role matrix
4. เปรียบเทียบ explicit package import, network repository,
   Git-backed admin workflow, central metadata service และ web/cloud
5. ให้ local-first/privacy/operational burden เป็น decision criteria
6. ทำ threat model และ failure/offline/conflict scenarios
7. เสนอ MVP, non-goals, version และ acceptance criteria

ห้ามสร้าง implementation Goal จนเจ้าของตอบข้อมูลสำคัญและอนุมัติ ADR
ห้าม commit/push
```

---

## 8. /goal Template หลัง Owner อนุมัติเท่านั้น

ยังไม่ควรใช้แบบเติมอัตโนมัติ ต้องแทน `[ค่าที่อนุมัติ]`:

```text
/goal พัฒนา jmoney [VERSION] Organization Mode ตาม ADR [ADR_PATH] และ docs/roadmap/PHASE-OPTIONAL-ORGANIZATION.md โดยใช้ architecture [APPROVED_ARCHITECTURE] สำหรับผู้ใช้ [USER_COUNT] เครื่อง [DEVICE_COUNT] แชร์เฉพาะ [APPROVED_SHARED_DATA] ใช้ identity/role [APPROVED_IDENTITY_AND_ROLES] และ conflict/offline policy [APPROVED_POLICY] ทำเฉพาะ MVP [APPROVED_MVP_SCOPE] รักษาข้อมูลที่ห้ามแชร์ [RESTRICTED_DATA], offline document generation, DOCX lifecycle, package signatures/audit/backup/rollback ตาม ADR ห้ามรวม [NON_GOALS] เพิ่ม security/privacy/offline/conflict/migration/deployment tests อัปเดต docs/version/release/checkpoint เสร็จเมื่อ acceptance และ threat-model controls ผ่านบน pilot environment และ rollback กลับ local-only ได้ ห้าม commit/push/deploy จนเจ้าของสั่งแต่ละ action
```

ห้ามใช้ Goal นี้หาก placeholder ยังไม่ถูกแทน

---

## 9. Checkpoint ล่าสุด

- วันที่: 2026-07-29
- Base release: แนะนำ 3.0+
- สถานะ: Discovery Only
- งานที่เสร็จ: Discovery framework/options
- งานที่เหลือ: stakeholder answers และ ADR
- Blocker: ยังไม่มี requirement หลายเครื่องที่ยืนยัน
- คำสั่งเริ่มต่อ: ใช้ Chat Discovery Prompt

