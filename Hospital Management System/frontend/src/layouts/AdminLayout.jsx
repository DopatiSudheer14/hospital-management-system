import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function AdminLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="flex-grow-1 d-flex flex-column main-content-wrapper"
        style={{
          width: '100%',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Navbar />
        <main
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: 'var(--background-main, #faf9f7)',
            minHeight: 'calc(100vh - 72px)',
            animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
      <style>{`
        .main-content-wrapper {
          width: 100%;
        }
        @media (min-width: 768px) {
          .main-content-wrapper {
            margin-left: 260px;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
