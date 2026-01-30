import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { apiService } from '../services/apiService';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStats();
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (status) => {
    navigate('/users', { state: { filter: status } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading statistics...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard Overview</h2>
          <button onClick={fetchStats} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>

        <div className="stats-grid">
          <div
            className="stat-card total"
            onClick={() => handleCardClick(null)}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.total || 0}</p>
            </div>
          </div>

          <div
            className="stat-card pending"
            onClick={() => handleCardClick('PENDING')}
          >
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-number">{stats?.pending || 0}</p>
            </div>
          </div>

          <div
            className="stat-card approved"
            onClick={() => handleCardClick('APPROVED')}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Approved</h3>
              <p className="stat-number">{stats?.approved || 0}</p>
            </div>
          </div>

          <div
            className="stat-card blocked"
            onClick={() => handleCardClick('BLOCKED')}
          >
            <div className="stat-icon">🚫</div>
            <div className="stat-info">
              <h3>Blocked</h3>
              <p className="stat-number">{stats?.blocked || 0}</p>
            </div>
          </div>
        </div>

        <div className="additional-stats">
          <div className="info-card">
            <h4>📈 Recent Signups (7 days)</h4>
            <p>{stats?.recentSignups || 0} new users</p>
          </div>
          <div className="info-card">
            <h4>🟢 Active Today</h4>
            <p>{stats?.activeToday || 0} active users</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
