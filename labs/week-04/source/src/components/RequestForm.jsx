import { useState } from "react";

function RequestForm({ onAddRequest }) {
  const initialFormState = {
    requesterName: "",
    requestType: "",
    location: "",
    details: "",
    priority: "normal",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  // จัดการการเปลี่ยนแปลงค่าใน Input ทุกตัว
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ล้างข้อความแจ้งเตือนความผิดพลาดของช่องที่กำลังพิมพ์
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  // ฟังก์ชัน ตรวจสอบความถูกต้องของข้อมูล
  function validate() {
    const newErrors = {};

    if (!formData.requesterName.trim()) {
      newErrors.requesterName = "กรุณากรอกชื่อผู้แจ้ง";
    }
    if (!formData.requestType) {
      newErrors.requestType = "กรุณาเลือกประเภทคำร้อง";
    }
    if (!formData.location.trim()) {
      newErrors.location = "กรุณากรอกสถานที่";
    }
    if (!formData.details.trim()) {
      newErrors.details = "กรุณากรอกรายละเอียด";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    // หากมี Error ให้แสดง Error message และหยุดการทำงาน
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ผ่านการตรวจสอบ: เรียกใช้ onAddRequest ส่งข้อมูลไปทำงานต่อ
    onAddRequest(formData);

    // รีเซ็ตฟอร์มและแสดงสถานะสำเร็จ
    setFormData(initialFormState);
    setErrors({});
    setStatus("เพิ่มคำร้องเรียบร้อยแล้ว");
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
          />
          <small className="error" id="requesterName-error">
            {errors.requesterName}
          </small>
        </div>

        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>
          <small className="error" id="requestType-error">
            {errors.requestType}
          </small>
        </div>

        <div className="field">
          <label htmlFor="location">สถานที่</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <small className="error" id="location-error">
            {errors.location}
          </small>
        </div>

        <div className="field">
          <label htmlFor="details">รายละเอียด</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
          ></textarea>
          <small className="error" id="details-error">
            {errors.details}
          </small>
        </div>

        <fieldset className="field">
          <legend>ความเร่งด่วน</legend>
          <label>
            <input
              type="radio"
              name="priority"
              value="normal"
              checked={formData.priority === "normal"}
              onChange={handleChange}
            />{" "}
            ปกติ
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={formData.priority === "urgent"}
              onChange={handleChange}
            />{" "}
            เร่งด่วน
          </label>
          <small className="error" id="priority-error">
            {errors.priority}
          </small>
        </fieldset>

        <button type="submit">เพิ่มคำร้อง</button>
        <p className="status" role="status">
          {status}
        </p>
      </form>
    </section>
  );
}

export default RequestForm;