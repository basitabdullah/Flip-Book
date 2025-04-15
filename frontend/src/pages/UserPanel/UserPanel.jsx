import React, { useEffect } from 'react';
import './UserPanel.scss';
import { FaUser, FaEnvelope, FaPhone,FaArrowLeft  } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const UserPanel = () => {
  const { getAllUsers, users, loading, error } = useUserStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = users?.filter(user =>
    user.role === 'user' || user.role === 'sub-admin'
  );
  const navigate = useNavigate()



  return (
    <div className="user-panel">
         <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </button>
      <div className="panel-header">
        <h1>User Data</h1>
      </div>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map(user => (
                <tr key={user._id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <div className="avatar">
                        <FaUser />
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="info-cell">
                      <FaEnvelope className="cell-icon" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="info-cell">
                      <FaPhone className="cell-icon" />
                      <span>{user.phone || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`role-badge ${user.role}`}>
                      {user.role}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!filteredUsers || filteredUsers.length === 0) && (
            <div className="no-results">
              <p>No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPanel;
