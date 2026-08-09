import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import RequestForm from './components/RequestForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import RequestList from './components/RequestList.jsx';
import { initialRequests } from './data/initialRequests.js';

function App() {
  // LAB4-R04: กำหนด requests และ statusFilter ให้เป็น State
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState('all');

  // LAB4-R04: คำนวณ summary เป็น Derived Data จาก requests State
  const summary = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter(
      (r) => r.status === 'in_progress' || r.status === 'inProgress'
    ).length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  // LAB4-R08: คำนวณ filteredRequests จาก requests และ statusFilter
  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  // ฟังก์ชันเพิ่มคำร้องใหม่
  function handleAddRequest(requestData) {
    const newRequest = {
      id: Date.now(), // หรือใช้ crypto.randomUUID()
      status: 'pending', // กำหนดสถานะเริ่มต้น
      createdAt: new Date().toISOString().split('T')[0],
      ...requestData,
    };

    setRequests((prevRequests) => [newRequest, ...prevRequests]);
  }

  // ฟังก์ชันลบคำร้องตาม ID
  function handleDeleteRequest(requestId) {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  }

  return (
    <>
      <AppHeader
        title="Campus Service Request"
        subtitle="LAB 4 Starter — เปลี่ยน DOM-driven UI เป็น State-driven React UI"
      />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <RequestForm onAddRequest={handleAddRequest} />
          <section className="panel" aria-labelledby="request-list-title">
            <div className="section-heading">
              <h2 id="request-list-title">รายการคำร้อง</h2>
              <FilterBar
                value={statusFilter}
                onFilterChange={setStatusFilter}
              />
            </div>
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;