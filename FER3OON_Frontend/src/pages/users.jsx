import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { apiService } from '../services/apiService';
import '../styles/users.css';

export const Users = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(location.state?.filter || null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers(filter);
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (uid, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    setActionLoading(uid);
    try {
      await apiService.updateUserStatus(uid, newStatus);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(uid);
    try {
      await apiService.deleteUser(uid);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'PENDING':
        return 'status-pending';
      case 'BLOCKED':
        return 'status-blocked';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading users...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="users-page">
        <div className="users-header">
          <div>
            <h2>Users Management</h2>
            <p className="users-count">
              {users.length} {filter ? `${filter.toLowerCase()} ` : ''}user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="back-btn">
              ← Back to Dashboard
            </button>
            <button onClick={fetchUsers} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === null ? 'active' : ''}
            onClick={() => setFilter(null)}
          >
            All Users
          </button>
          <button
            className={filter === 'PENDING' ? 'active' : ''}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={filter === 'APPROVED' ? 'active' : ''}
            onClick={() => setFilter('APPROVED')}
          >
            Approved
          </button>
          <button
            className={filter === 'BLOCKED' ? 'active' : ''}
            onClick={() => setFilter('BLOCKED')}
          >
            Blocked
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>UID</th>
                <th>Device ID</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="uid-cell">{user.uid}</td>
                    <td className="device-cell">{user.deviceId}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td className="actions-cell">
                      {actionLoading === user.uid ? (
                        <span className="loading-text">Loading...</span>
                      ) : (
                        <>
                          {user.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleStatusChange(user.uid, 'APPROVED')}
                              className="action-btn approve-btn"
                              title="Approve"
                            >
                              ✅
                            </button>
                          )}
                          {user.status !== 'BLOCKED' && (
                            <button
                              onClick={() => handleStatusChange(user.uid, 'BLOCKED')}
                              className="action-btn block-btn"
                              title="Block"
                            >
                              🚫
                            </button>
                          )}
                          {user.status !== 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(user.uid, 'PENDING')}
                              className="action-btn pending-btn"
                              title="Set Pending"
                            >
                              ⏳
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.uid)}
                            className="action-btn delete-btn"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
