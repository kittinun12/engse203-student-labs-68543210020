import { NavLink } from 'react-router-dom';
function AppHeader() {
  const links = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/requests/new', label: 'New Request' },
    { to: '/about', label: 'About' },
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 05</p>
          <p className="brand">Campus Service Request</p>
        </div>
        {/* TODO 5A-CP02: เพิ่ม <nav> ที่มี NavLink 3 ปุ่ม — Dashboard, New Request, About
            ปุ่ม Dashboard ที่ to="/" ต้องใส่ prop end ด้วย ไม่งั้นจะ active ทุกหน้า */}
        <nav aria-label="เมนูหลัก">
          {links.map(({ to, label, end }) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
}

export default AppHeader;