import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import toast from 'react-hot-toast';

const Login = () => {
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
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
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    <div className="login-container">
      <a href="/" className="back-button">
        <IoArrowBack /> Back
      </a>
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
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
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {/* <p className="forgot-password">
          <a href="#">Forgot Password?</a>
        </p> */}
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
