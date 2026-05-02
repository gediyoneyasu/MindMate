import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    year: '',
    department: 'Computer Science'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`http://localhost:5000/api${endpoint}`, formData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(isLogin ? 'Welcome back to WCU!' : 'Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">WCU CS Portal</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back to Wolkite University' : 'Join the WCU Computer Science Community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="WCU/CS/XXXX/XX"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@wcu.edu.et"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Year of Study</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              isLogin ? 'Login to Dashboard' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-switch-btn"
            >
              {isLogin ? 'Register Now' : 'Login Here'}
            </button>
          </p>
        </div>

        <div className="auth-info">
          <p>🎓 WCU Computer Science Department</p>
          <p>📍 Wolkite, Ethiopia</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
