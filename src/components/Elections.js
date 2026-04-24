import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css'; // reuse the same design system (cards, grid, spinner, etc.)

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get('https://online-voting-system-backend-ofbg.onrender.com/api/elections');
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

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="dashboard-eyebrow">Elections</p>
          <h1 className="dashboard-title">All Elections</h1>
          <p className="dashboard-subtitle">
            View every election in the system along with their status and total votes.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Election list</h2>
            <p className="section-subtitle">
              Showing {elections.length} election{elections.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        {elections.length === 0 ? (
          <div className="empty-state">
            <h3>No elections available</h3>
            <p>
              There are currently no elections configured. Once an admin creates an election,
              it will appear here.
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

                <div className="election-meta-row">
                  <div className="election-stat">
                    <span className="election-stat-label">Total votes</span>
                    <span className="election-stat-value">
                      {election.totalVotes ?? 0}
                    </span>
                  </div>
                </div>

                <div className="election-actions">
                  <Link
                    to={`/elections/${election._id}/results`}
                    className="btn btn-primary-modern"
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

export default Elections;
