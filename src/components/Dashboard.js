import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Dashboard.css';
import imagex from "../components/image/imagex.jpg"

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/elections');
      setElections(res.data.elections);
    } catch (error) {
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    const statusClass = `status-badge status-${normalized}`;
    const label =
      normalized === 'active'
        ? 'Active'
        : normalized === 'upcoming'
        ? 'Upcoming'
        : normalized === 'closed'
        ? 'Closed'
        : status;

    return <span className={statusClass}>{label}</span>;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading elections…</p>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    
    <div className="dashboard-page" style={{backgroundImage:`url(${imagex})`}}>
      {/* Hero / welcome area */}
      <header className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">Online Voting System</p>
          <h1 className="dashboard-title">Welcome back, {firstName} 👋</h1>
          <p className="dashboard-subtitle">
            {user?.hasVoted
              ? 'You have already cast your vote. You can still explore ongoing elections and view their results.'
              : 'Browse the active elections below and cast your vote securely in just a few clicks.'}
          </p>
        </div>

        <div className="dashboard-meta">
          <span
            className={
              user?.hasVoted
                ? 'vote-status-chip vote-status-chip--voted'
                : 'vote-status-chip vote-status-chip--not-voted'
            }
          >
            {user?.hasVoted ? 'Already voted' : 'You have not voted yet'}
          </span>
        </div>
      </header>

      {/* Elections section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="dashboard-title">Available Elections</h2>
            <p className="section-subtitle">
              Select an election to vote or quickly check the latest results.
            </p>
          </div>

          <div className="election-count-pill">
            {elections.length === 0 ? 'No elections' : `${elections.length} open election(s)`}
          </div>
        </div>

        {elections.length === 0 ? (
          <div className="empty-state">
            <h3>No elections available</h3>
            <p>
              There are currently no active elections. Please check back later or contact the
              administrator.
            </p>
          </div>
        ) : (
          <div className="election-grid">
            {elections.map((election) => (
              <article key={election._id} className="election-card">
                <div className="election-card-header">
                  <h3 className="election-title">{election.title}</h3>
                  {getStatusBadge(election.status)}
                </div>

                {election.description && (
                  <p className="election-description">{election.description}</p>
                )}

                <div className="election-dates">
                  <div className="date-item">
                    <span className="date-label">Start</span>
                    <span className="date-value">
                      {new Date(election.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">End</span>
                    <span className="date-value">
                      {new Date(election.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="election-actions">
                  {election.status === 'active' && !user?.hasVoted && (
                    <Link
                      to={`/elections/${election._id}/vote`}
                      className="btn btn-primary-modern"
                    >
                      Vote now
                    </Link>
                  )}
                  <Link
                    to={`/elections/${election._id}/results`}
                    className="btn btn-ghost-modern"
                  >
                    View results
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
