# jmoney — Handoff 6 Steps

โฟลเดอร์นี้เป็นชุด Handoff สำหรับส่งต่องาน jmoney ข้ามเครื่อง โดยแบ่งแผนพัฒนาเป็น 6 ขั้นตามลำดับ dependency

ให้เปิดเอกสารตามลำดับ และใช้ส่วน `Prompt สำหรับ Chat` เพื่อวิเคราะห์ก่อนแก้ไข ส่วน `/goal` ใช้เมื่อพร้อมลงมือทำตาม acceptance criteria แล้ว

1. [Step 01 — jmoney 2.0.1 Hardening](./STEP-01-HANDOFF-2.0.1-HARDENING.md)
2. [Step 02 — jmoney 2.1 Large Catalog UX](./STEP-02-HANDOFF-2.1-LARGE-CATALOG-UX.md)
3. [Step 03 — jmoney 2.2 Template Packages](./STEP-03-HANDOFF-2.2-TEMPLATE-PACKAGES.md)
4. [Step 04 — jmoney 2.3 Professional Release](./STEP-04-HANDOFF-2.3-PROFESSIONAL-RELEASE.md)
5. [Step 05 — jmoney 3.0 Modular Architecture](./STEP-05-HANDOFF-3.0-MODULAR-ARCHITECTURE.md)
6. [Step 06 — Optional Organization Discovery](./STEP-06-HANDOFF-OPTIONAL-ORGANIZATION.md)

## กติกาการส่งต่องาน

- ทำเฉพาะภายใน repository `jmoney`
- อ่าน baseline และไฟล์ที่ระบุใน Handoff ก่อนลงมือ
- รักษา offline/local-first, ข้อมูลผู้ใช้, output, User Template, DOCX layout, font, spacing, Header/Footer และ upgrade safety
- เพิ่ม tests และตรวจ acceptance criteria ของ Step นั้นให้ครบ
- `/goal` ไม่มีสิทธิ์ commit, push, release หรือ deploy โดยอัตโนมัติ
- การ commit/push/release ต้องได้รับคำสั่งจากเจ้าของแยกต่างหาก

Step 06 เป็น discovery เท่านั้น ห้ามเริ่ม implementation จนกว่าจะมี requirement, threat model, ADR และการอนุมัติจากเจ้าของระบบ
