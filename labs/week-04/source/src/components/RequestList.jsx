import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest }) {
  // เพิ่ม Empty State เมื่อไม่มีรายการคำร้อง
  if (!requests || requests.length === 0) {
    return (
      <div className="request-list empty">
        <p className="empty-state">ยังไม่มีรายการคำร้องในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default RequestList;