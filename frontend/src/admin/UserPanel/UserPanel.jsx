import React, { useState, useEffect } from 'react';
import './UserPanel.scss';
import { FaUser, FaEnvelope, FaPhone, FaUserCog } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";
import {useUserStore} from '../../stores/useUserStore';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-hot-toast';

const UserPanel = () => {
  const { getAllUsers, users, loading, error, updateUserRole, deleteUser, user: currentUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = users?.filter(user => {
    const matchesSearch = (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setShowRoleModal(null);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="user-panel">
      <div className="panel-header">
        <h1>User Management</h1>
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
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
                <th>Actions</th>
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
                  <td>
                    {currentUser?._id !== user._id && (
                      <div className="action-buttons">
                        <button 
                          className="action-button role-button"
                          onClick={() => setShowRoleModal(user)}
                          title="Change Role"
                        >
                          <FaUserCog />
                        </button>
                        <button 
                          className="action-button delete-button"
                          onClick={() => setShowDeleteConfirm(user)}
                          title="Delete User"
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!filteredUsers || filteredUsers.length === 0) && (
            <div className="no-results">
              <p>No users found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Change User Role</h2>
            <p>Change role for {showRoleModal.name}</p>
            
            <div className="role-options">
              <button 
                className={`role-option ${showRoleModal.role === 'user' ? 'active' : ''}`}
                onClick={() => handleRoleChange(showRoleModal._id, 'user')}
              >
                User
              </button>
              <button 
                className={`role-option ${showRoleModal.role === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange(showRoleModal._id, 'admin')}
              >
                Admin
              </button>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowRoleModal(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete User</h2>
            <p>Are you sure you want to delete {showDeleteConfirm.name}?</p>
            <p className="warning">This action cannot be undone.</p>

            <div className="modal-actions">
              <button 
                onClick={() => handleDeleteUser(showDeleteConfirm._id)}
                className="delete-btn"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel; 