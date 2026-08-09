## LAB 03 — Responsive Web UI & Form Interaction

  นาย กิตตินันท์ ผิวคำ 68543210020-2  

  คำอธิบาย - สร้างหน้าเว็บ responsive สำหรับระบบจัดการงานขนาดย่อม ฝึก semantic HTML, CSS layout, mobile-first design, event และ form validation.  



## ลิ้ง github page

https://kittinun12.github.io/engse203-lab03-68543210020-2/  

## ภาพประกอบ   

  <img width="1409" height="986" alt="Screenshot 2026-07-20 003357" src="https://github.com/user-attachments/assets/ba7b3701-ad38-4ffc-9eba-26f02c4297c4" />

  <img width="1204" height="725" alt="Screenshot 2026-07-20 004420" src="https://github.com/user-attachments/assets/9f99261d-0add-4177-83cd-f36db6bf4b3d" />



## วิธีติ้งตั้ง 

-npm run build

-npm run dev


## source code

  <img width="235" height="351" alt="Screenshot 2026-07-20 003656" src="https://github.com/user-attachments/assets/d3ae2599-46c1-4d9d-81d1-868ce42784dd" />


```markdown
### 📄 app.js
```javascript
const form = document.querySelector('#profile-form');
const status = document.querySelector('#form-status');
const goalCount = document.querySelector('#goal-count');

const preview = {
  displayName: document.querySelector('#preview-name'),
  learningRole: document.querySelector('#preview-role'),
  learningGoal: document.querySelector('#preview-goal'),
};

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPreview(data) {
  // TODO 6: อัปเดต preview ทั้ง 3 ค่าโดยใช้ textContent
  preview.displayName.textContent = data.displayName.trim() || 'ยังไม่ระบุชื่อ';
  preview.learningRole.textContent = data.learningRole || 'ยังไม่เลือกประเภท';
  preview.learningGoal.textContent = data.learningGoal.trim() || 'ยังไม่มีรายละเอียด';
  goalCount.textContent = `${data.learningGoal.length} ตัวอักษร`;
}

function validate(data) {
  // TODO 7: ตรวจชื่อ >= 2, role ต้องเลือก, goal >= 10
  const errors = {};

  if (data.displayName.trim().length < 2) {
    errors.displayName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }

  if (!data.learningRole) {
    errors.learningRole = 'กรุณาเลือกบทบาทที่สนใจ';
  }

  if (data.learningGoal.trim().length < 10) {
    errors.learningGoal = 'กรุณาเขียนเป้าหมายอย่างน้อย 10 ตัวอักษร';
  }

  return errors;
}

function renderErrors(errors) {
  // TODO 8: แสดง error ใกล้ field และกำหนด aria-invalid
  for (const name of ['displayName', 'learningRole', 'learningGoal']) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? '';

    output.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
}

// TODO 9: Read → Render
form.addEventListener('input', () => {
  const data = readForm();
  renderPreview(data);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO 10: Read → Validate → Render errors/status

  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus('invalid', 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล');
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  renderStatus('success', `พร้อมแล้ว ${data.displayName}! ข้อมูลผ่านการตรวจสอบ`);
});

function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

form.addEventListener('reset', () => {
  queueMicrotask(() => {
    // TODO 11: reset preview, errors และ status
    renderErrors({});
    renderPreview(readForm());
    renderStatus('idle', 'เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview');
  });
});

```markdown
### 📄 index.html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campus Service Request</title>
  <!-- ดึงไฟล์ CSS ของคุณมาใช้งาน -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ส่วนหัวข้อด้านบน (Hero Banner) -->
  <header class="hero">
    <div class="container hero__content">
      <p class="eyebrow">Responsive Web UI, Event and Form</p>
      <h1>Campus Service Request</h1>
      <p class="hero__lead">ระบบส่งคำร้องขอของมหาวิทยาลัย เพิ่มประสิทธิภาพและการตอบกลับที่รวดเร็ว</p>
    </div>
  </header>

  <!-- ส่วนเนื้อหาหลักที่แบ่งเป็น Grid ซ้าย-ขวา -->
  <main class="container page-grid">
    
    <!-- ฝั่งซ้าย: ฟอร์มกรอกข้อมูล (Panel) -->
    <section class="panel">
      <div class="section-heading">
        <h2>Create Service Request</h2>
        <p>กรุณากรอกข้อมูลคำร้องของคุณให้ครบถ้วน</p>
      </div>

      <form id="profile-form">
        <!-- Field 1: ชื่อที่ต้องการแสดง -->
        <div class="field">
          <label for="display-name">ชื่อที่ต้องการแสดง</label>
          <input
            id="display-name"
            name="displayName"
            type="text"
            placeholder="เช่น สมชาย ใจดี"
            aria-describedby="displayName-hint displayName-error"
            required />
          <div class="field-meta">
            <small id="displayName-hint" class="hint">อย่างน้อย 2 ตัวอักษร</small>
            <small id="displayName-error" class="error"></small>
          </div>
        </div>

        <!-- Field 2: ประเภทคำขอ -->
        <div class="field">
          <label for="learning-role">ประเภทคำขอ</label>
          <select id="learning-role" name="learningRole" aria-describedby="learningRole-error" required>
            <option value="">-- กรุณาเลือก --</option>
            <option value="General">คำขอทั่วไป</option>
            <option value="Academic">คำขอด้านวิชาการ</option>
            <option value="Facility">คำขอด้านสถานที่ / อุปกรณ์</option>
          </select>
          <small id="learningRole-error" class="error"></small>
        </div>

        <!-- Field 3: รายละเอียดคำขอ -->
        <div class="field">
          <label for="learning-goal">รายละเอียด</label>
          <textarea
            id="learning-goal"
            name="learningGoal"
            placeholder="กรุณากรอกรายละเอียดของคำขอ..."
            aria-describedby="learningGoal-hint learningGoal-error"
            required></textarea>
          <div class="field-meta">
            <small id="learningGoal-hint" class="hint">กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร</small>
            <small id="goal-count" class="counter" aria-live="polite">0 ตัวอักษร</small>
          </div>
          <small id="learningGoal-error" class="error"></small>
        </div>

        <!-- ปุ่มกดต่างๆ -->
        <div class="actions">
          <button type="submit">Submit Request</button>
          <button type="reset" class="button-secondary">Clear</button>
        </div>

        <!-- สถานะฟอร์มหลังกด Submit -->
        <div id="form-status" class="status" data-state="idle">เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview</div>
      </form>
    </section>

    <!-- ฝั่งขวา: กล่อง Live Preview -->
    <aside class="panel preview-panel">
      <div class="section-heading">
        <h2>Live Preview</h2>
        <p>ข้อมูลตัวอย่างที่จะถูกส่งระบบ</p>
      </div>

      <!-- การ์ดพรีวิวไล่เฉดสีสวยงามตาม CSS ของคุณ -->
      <div class="profile-card">
        <div>
          <p class="profile-card__label">NAME</p>
          <h2 id="preview-name">ยังไม่ระบุชื่อ</h2>
        </div>
        <div>
          <p class="profile-card__label">TYPE</p>
          <p id="preview-role" class="role">ยังไม่เลือกประเภท</p>
        </div>
        <div>
          <p class="profile-card__label">DETAILS</p>
          <p id="preview-goal" class="goal">ยังไม่มีรายละเอียด</p>
        </div>
      </div>

      <!-- กล่อง Submitted Requests ด้านล่างการ์ด -->
      <div class="concept-box">
        <p class="step-label">Submitted Requests</p>
        <div id="submitted-list">ยังไม่มีคำร้องขอ</div>
      </div>
    </aside>

  </main>

  <footer>
    <p>&copy; 2026 Campus Service Request System. All rights reserved.</p>
  </footer>

  <!-- ดึงไฟล์ JavaScript ของคุณมาใช้งาน -->
  <script src="app.js"></script>
</body>
</html>

```markdown
### 📄 style.css
*, *::before, *::after { box-sizing: border-box; }

:root {
  --navy: #0b4f3b;      
  --blue: #1abc9c;      
  --cyan: #2ecc71;      
  --yellow: #f1c40f;
  --text: #2c3e50;
  --muted: #7f8c8d;
  --surface: #ffffff;
  --surface-alt: #f0fcf6;
  --background: #f4f9f6;
  --danger: #e74c3c;
  --success: #27ae60;
}

html { color-scheme: light; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 15% 0%, rgb(22 184 212 / .12), transparent 28rem),
    var(--background);
}

button, input, select, textarea { font: inherit; }
.container { width: min(100% - 2rem, 72rem); margin-inline: auto; }
.hero {
  color: white;
  background:
    linear-gradient(110deg, rgba(7, 88, 84, 0.96), rgba(9, 58, 54, 0.9)),
    linear-gradient(45deg, var(--navy), var(--blue));
  padding: 2.25rem 0 2.5rem;
  border-bottom: 6px solid var(--cyan);
}
.hero__content { max-width: 54rem; }
.eyebrow, .step-label {
  margin: 0 0 .45rem;
  font-size: .8rem;
  font-weight: 850;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.hero h1 { margin: 0; font-size: clamp(2.15rem, 7vw, 4rem); line-height: 1.05; }
.hero__lead { margin: .85rem 0 0; max-width: 50rem; font-size: clamp(1rem, 2.4vw, 1.25rem); color: #e9f4ff; }

.page-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; padding-block: 1.25rem 2.5rem; }
.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.2rem; box-shadow: var(--shadow); }
.section-heading h2 { margin: 0; font-size: clamp(1.4rem, 4vw, 1.9rem); }
.section-heading > p:last-child { margin: .4rem 0 1.15rem; color: var(--muted); }
.step-label { color: var(--blue); }

.field { display: grid; gap: .45rem; margin-bottom: 1rem; }
.field label { font-weight: 750; }
input, select, textarea {
  width: 100%;
  border: 1px solid #9eb2d2;
  border-radius: .75rem;
  background: white;
  color: var(--text);
  padding: .8rem .9rem;
}
textarea { resize: vertical; min-height: 8rem; }
input:hover, select:hover, textarea:hover { border-color: var(--blue); }
input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible {
  outline: 3px solid var(--yellow);
  outline-offset: 2px;
}
input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: var(--danger); background: #fff8f7; }
.hint, .counter { color: var(--muted); }
.error { min-height: 1.2rem; color: var(--danger); font-weight: 650; }
.field-meta { display: flex; justify-content: space-between; gap: 1rem; }

.actions { display: flex; flex-wrap: wrap; gap: .75rem; }
button {
  border: 0;
  border-radius: .75rem;
  padding: .78rem 1.05rem;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, var(--blue), #164aa4);
  cursor: pointer;
  box-shadow: 0 8px 18px rgb(29 99 213 / .2);
}
button:hover { transform: translateY(-1px); }
.button-secondary { color: var(--navy); background: #e8eff9; box-shadow: none; }
.status { min-height: 1.5rem; margin: .9rem 0 0; font-weight: 750; }
.status[data-state="invalid"] { color: var(--danger); }
.status[data-state="success"] { color: var(--success); }
.status[data-state="idle"] { color: var(--muted); }

.preview-panel { background: linear-gradient(180deg, #f5fbff, #edf5ff); }
.profile-card {
  display: grid;
  gap: .55rem;
  min-height: 18rem;
  padding: 1.25rem;
  border-radius: 1rem;
  color: white;
  background:
    radial-gradient(circle at 85% 15%, rgb(22 184 212 / .75), transparent 8rem),
    linear-gradient(145deg, var(--navy), var(--blue));
  box-shadow: 0 16px 35px rgb(9 38 93 / .25);
}
.avatar { display: grid; place-items: center; width: 4rem; aspect-ratio: 1; border-radius: 1rem; font-size: 1.4rem; font-weight: 900; color: var(--navy); background: linear-gradient(135deg, white, #cceeff); }
.profile-card__label { margin: .15rem 0 0; font-size: .75rem; font-weight: 850; letter-spacing: .12em; color: #cdefff; }
.profile-card h3 { margin: 0; font-size: clamp(1.55rem, 5vw, 2.2rem); }
.profile-card .role { margin: 0; font-weight: 800; color: #bdefff; }
.profile-card .goal { margin: .25rem 0 0; line-height: 1.65; overflow-wrap: anywhere; }
.concept-box { margin-top: 1rem; padding: 1rem; border: 1px dashed #78a9e8; border-radius: .9rem; background: white; }
.concept-box ol { margin: .6rem 0 0; padding-left: 1.35rem; }
.concept-box code, .section-heading code { padding: .1rem .35rem; border-radius: .35rem; background: #e5efff; color: var(--navy); }
footer { padding: 1.2rem 0 2rem; color: var(--muted); text-align: center; }

@media (min-width: 48rem) {
  .page-grid { grid-template-columns: minmax(0, 1.5fr) minmax(20rem, 1fr); align-items: start; gap: 1.25rem; padding-top: 1.6rem; }
  .panel { padding: 1.5rem; }
  .preview-panel { position: sticky; top: 1rem; }
}

```markdown
### 📄 vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/engse203-lab03-68543210020-2/',
})
