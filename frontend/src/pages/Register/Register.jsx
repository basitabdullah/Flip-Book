import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();
  const { signup, loading } = useUserStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone
      });
      navigate('/admin/admin-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <button onClick={handleBack} className="back-button">
        <IoArrowBack /> Back
      </button>
      <div className="register-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              minLength="6"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              minLength="6"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <button onClick={handleLogin} className="login-link-button">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default Register;