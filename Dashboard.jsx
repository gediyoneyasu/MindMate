import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    projects: 0,
    pdfs: 0,
    views: 0,
    downloads: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const projectsRes = await axios.get('http://localhost:5000/api/projects');
      const pdfsRes = await axios.get('http://localhost:5000/api/pdfs');
      
      setRecentProjects(projectsRes.data.slice(0, 3));
      setStats({
        projects: projectsRes.data.length,
        pdfs: pdfsRes.data.length,
        views: projectsRes.data.reduce((sum, p) => sum + (p.views || 0), 0),
        downloads: pdfsRes.data.reduce((sum, p) => sum + (p.downloads || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '📁', title: 'View Projects', link: '/projects', color: '#1a472a' },
    { icon: '📚', title: 'PDF Resources', link: '/pdfs', color: '#c5a028' },
    { icon: '✉️', title: 'Contact Support', link: '/contact', color: '#2d6a4f' },
    { icon: '👤', title: 'My Profile', link: '/profile', color: '#6b7280' }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">🎓</div>
          <div>
            <h1 className="welcome-title">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="welcome-subtitle">
              WCU Computer Science Department - Student Dashboard
            </p>
          </div>
        </div>
        <div className="welcome-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-projects">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.projects}</h3>
            <p className="stat-label">Total Projects</p>
          </div>
          <div className="stat-trend">+12% this month</div>
        </div>

        <div className="stat-card stat-card-pdfs">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.pdfs}</h3>
            <p className="stat-label">PDF Resources</p>
          </div>
          <div className="stat-trend">+5 new this week</div>
        </div>

        <div className="stat-card stat-card-views">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.views}</h3>
            <p className="stat-label">Total Views</p>
          </div>
          <div className="stat-trend">Popular content</div>
        </div>

        <div className="stat-card stat-card-downloads">
          <div className="stat-icon">⬇️</div>
          <div className="stat-info">
            <h3 className="stat-number">{stats.downloads}</h3>
            <p className="stat-label">Downloads</p>
          </div>
          <div className="stat-trend">Engaged community</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index} className="quick-action-card">
              <div className="action-icon" style={{ backgroundColor: action.color }}>
                {action.icon}
              </div>
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">
                {action.title === 'View Projects' && 'Explore student projects'}
                {action.title === 'PDF Resources' && 'Access learning materials'}
                {action.title === 'Contact Support' && 'Get help and support'}
                {action.title === 'My Profile' && 'Update your information'}
              </p>
              <span className="action-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="recent-projects-section">
        <div className="section-header">
          <h2 className="section-title">Recent Projects</h2>
          <Link to="/projects" className="view-all-link">View All →</Link>
        </div>
        <div className="recent-projects-grid">
          {recentProjects.map((project) => (
            <div key={project._id} className="recent-project-card">
              <div className="project-icon">💻</div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">
                  {project.description?.substring(0, 80)}...
                </p>
                <div className="project-tech">
                  {project.technologies?.slice(0, 3).map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <Link to={`/projects/${project._id}`} className="project-link">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WCU Info Cards */}
      <div className="info-cards-section">
        <div className="info-card">
          <div className="info-card-icon">🎯</div>
          <h3>Mission</h3>
          <p>To produce competent computer scientists equipped with practical skills and ethical values.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🏆</div>
          <h3>Achievements</h3>
          <p>50+ graduates placed in top tech companies, 30+ research publications.</p>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🤝</div>
          <h3>Partnerships</h3>
          <p>Collaborations with industry leaders and international universities.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
