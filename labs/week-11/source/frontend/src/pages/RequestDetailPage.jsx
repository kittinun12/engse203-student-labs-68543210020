import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequestById } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [loadState, setLoadState] = useState('loading');
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getRequestById(requestId).then((result) => {
      if (ignore) return;
      setRequest(result);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [requestId, reloadKey]);

  // ฟังก์ชันสำหรับเปลี่ยนสถานะคำร้อง (แก้ไขให้ปรับปรุงการส่งข้อมูล)
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);

      // 1. ลองส่งแบบ PATCH ก่อน
      let response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      // 2. ถ้า PATCH ไม่สำเร็จ ให้ลองส่งแบบ PUT โดยแนบข้อมูลเดิมไปด้วย
      if (!response.ok) {
        response = await fetch(`/api/requests/${requestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...request, status: newStatus }),
        });
      }

      // 3. ตรวจสอบผลลัพธ์
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `อัปเดตไม่สำเร็จ (HTTP ${response.status})`);
      }

      reload(); // รีโหลดข้อมูลเพื่อแสดงสถานะใหม่
    } catch (error) {
      alert(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">DYNAMIC ROUTE</p>
          <h1>รายละเอียดคำร้อง</h1>
          <p>Request ID: <code>{requestId}</code></p>
        </div>
      </div>
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายละเอียด…" />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && !request && (
        <section className="state-card">
          <h2>ไม่พบคำร้อง</h2>
          <p>ไม่พบข้อมูลสำหรับ ID <code>{requestId}</code></p>
          <Link to="/">กลับ Dashboard</Link>
        </section>
      )}
      {loadState === 'success' && request && (
        <article className="panel detail-card">
          <h2>{request.requestType}</h2>
          <dl>
            <div><dt>ID</dt><dd>{request.id}</dd></div>
            <div><dt>ผู้แจ้ง</dt><dd>{request.requesterName}</dd></div>
            <div><dt>สถานที่</dt><dd>{request.location}</dd></div>
            <div><dt>รายละเอียด</dt><dd>{request.details}</dd></div>
            <div><dt>ความเร่งด่วน</dt><dd>{request.priority}</dd></div>
            <div>
              <dt>สถานะ</dt>
              <dd>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong>{request.status}</strong>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={updating || request.status === 'pending'}
                      onClick={() => handleStatusChange('pending')}
                    >
                      รอดำเนินการ
                    </button>
                    <button
                      type="button"
                      disabled={updating || request.status === 'in-progress'}
                      onClick={() => handleStatusChange('in-progress')}
                    >
                      กำลังดำเนินการ
                    </button>
                    <button
                      type="button"
                      disabled={updating || request.status === 'completed'}
                      onClick={() => handleStatusChange('completed')}
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
          <br />
          <Link to="/">กลับ Dashboard</Link>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;