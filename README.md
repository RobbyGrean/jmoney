# jmoney Redesign

Repo นี้เป็น static landing page / download page สำหรับ `jmoney` ไม่ใช่ source code ของตัวโปรแกรมหลัก

หน้าที่ของ repo นี้:

- แจก installer ของโปรแกรม Windows แบบ offline
- แจกคู่มือภาษาไทยสำหรับผู้ใช้ทั่วไป
- แยกโซนสำหรับคนที่อยากศึกษา source code, handoff, และแนวคิดการพัฒนาด้วย AI

## โครงสร้างหลัก

- `index.html` หน้า landing page
- `styles.css` custom styles
- `script.js` interaction / reveal / placeholder warning
- `assets/icon/app-icon.png` icon ของโปรแกรม
- `assets/downloads/ReimbursementDocApp-Installer.zip` ไฟล์ติดตั้งล่าสุด
- `assets/downloads/ReimbursementDocApp-Source.zip` source zip สำหรับคนที่อยากศึกษาโค้ด
- `assets/downloads/README-การลงโปรแกรมและการใช้งาน.txt` คู่มือภาษาไทย
- `docs/HANDOFF_APP.md` สำเนา handoff หลักจาก source app
- `REDESIGN_HANDOFF.md` handoff ของ repo นี้

## User-facing Install Warning

หน้า landing page ควรอธิบายเรื่อง Windows SmartScreen ให้ชัด เพราะผู้ใช้ทั่วไปอาจเจอหน้าฟ้า `Windows protected your PC` ตอนเปิดไฟล์ติดตั้ง

สิ่งที่ต้องสื่อ:

- นี่คือคำเตือนจาก Windows ตามปกติสำหรับแอปที่ยังไม่เป็นที่รู้จักกว้าง ๆ
- ให้ผู้ใช้กด `More info` ก่อน
- แล้วจึงกด `Run anyway` ถ้าไฟล์มาจากหน้าแจกนี้จริง
- ต้องย้ำชื่อไฟล์ที่ควรเปิดคือ `ReimbursementDocApp-Setup.exe`

## Local Preview

เปิด `index.html` ตรง ๆ ใน browser ได้เลย

ถ้าต้องการเสิร์ฟแบบ local server:

```powershell
cd "C:\Users\MSI\Documents\Redesign"
python -m http.server 8080
```

แล้วเปิด `http://localhost:8080`

## Related Project Context

- source app หลัก: `C:\Users\MSI\Documents\App creation`
- draft เดิมที่ใช้เป็นฐาน: `C:\Users\MSI\Documents\App creation\jmoney-site`
- handoff หลักของแอป: `C:\Users\MSI\Documents\App creation\HANDOFF.md`

## หมายเหตุสำคัญ

- narrative ของเว็บนี้ตั้งใจย้ำว่า `jmoney` เป็น `offline Windows app`
- ห้ามเปลี่ยนข้อความจนทำให้เข้าใจว่าเป็น web app หรือ cloud app
- ตอนนี้ repo นี้ bundle ทั้ง installer, คู่มือ, และ source zip แล้ว
- ถ้าจะ deploy แบบ public ควรตัดสินใจอีกครั้งว่าจะเก็บไฟล์ zip ขนาดใหญ่ไว้ใน repo นี้ หรือย้ายไป GitHub Releases / source repo ภายนอก
