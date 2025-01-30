import React, { useEffect, useCallback } from 'react';
import useFlipbookStore from '../../stores/useFlipbookStore';
import './ScheduledFlipbooks.scss';

const ScheduledFlipbooks = () => {
  const scheduledFlipbooks = useFlipbookStore(state => state.scheduledFlipbooks);
  const getScheduledFlipbooks = useFlipbookStore(state => state.getScheduledFlipbooks);
  const loading = useFlipbookStore(state => state.loading);
  const error = useFlipbookStore(state => state.error);
  const cancelScheduledPublish = useFlipbookStore(state => state.cancelScheduledPublish);

  useEffect(() => {
    getScheduledFlipbooks();
  }, [getScheduledFlipbooks]);

  const handleCancelSchedule = async (flipbookId) => {
    try {
      await cancelScheduledPublish(flipbookId);
      getScheduledFlipbooks(); // Refresh the list
    } catch (error) {
      console.error('Failed to cancel scheduled publish:', error);
    }
  };

  if (loading) return <div className="scheduled-flipbooks-loading">Loading...</div>;
  if (error) return <div className="scheduled-flipbooks-error">Error: {error}</div>;

  return (
    <div className="scheduled-flipbooks">
      <h2>Scheduled Publications</h2>
      {scheduledFlipbooks && scheduledFlipbooks.length > 0 ? (
        <div className="scheduled-flipbooks-list">
          {scheduledFlipbooks
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .map((flipbook) => (
              <div key={flipbook._id} className="scheduled-flipbook-item">
                <div className="scheduled-flipbook-info">
                  <span className="scheduled-flipbook-title">{flipbook.name}</span>
                  <span className="scheduled-flipbook-issue">{flipbook.issue}</span>
                  <span className="scheduled-flipbook-date">
                    Scheduled for:{' '}
                    {new Date(flipbook.scheduledDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="scheduled-flipbook-actions">
                  <button
                    className="cancel-schedule-btn"
                    onClick={() => handleCancelSchedule(flipbook._id)}
                  >
                    Cancel Schedule
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="no-scheduled-flipbooks">
          No scheduled publications available
        </div>
      )}
    </div>
  );
};

export default ScheduledFlipbooks;
