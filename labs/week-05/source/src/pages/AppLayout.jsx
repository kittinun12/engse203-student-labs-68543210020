import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" data-testid="app-layout">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        LAB environment · ไม่ใช้ข้อมูลส่วนบุคคลจริง
      </footer>
    </div>
  );
}