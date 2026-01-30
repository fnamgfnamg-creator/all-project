import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/layout.css';

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const admin = authService.getAdmin();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/');
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">EL FER3OON DASH</h1>
          <div className="header-right">
            <span className="admin-name">👤 {admin?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>&copy; 2026 FER3OON. All rights reserved.</p>
      </footer>
    </div>
  );
};
