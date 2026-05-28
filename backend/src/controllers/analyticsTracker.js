const pool = require("../config/db");

/**
 * Persists a lightweight event log to the database.
 * @param {number|null} userId - The ID of the user triggering the event (null if unauthenticated/register)
 * @param {string} eventType - The action name (e.g. 'login', 'register', 'project_create')
 * @param {object} [metadata] - Optional additional context
 */
const trackEvent = async (userId, eventType, metadata = {}) => {
  try {
    await pool.query(
      `
      INSERT INTO analytics_events (user_id, event_type, metadata)
      VALUES ($1, $2, $3)
      `,
      [userId, eventType, JSON.stringify(metadata)]
    );
  } catch (error) {
    console.error(`Failed to track event '${eventType}':`, error);
  }
};

module.exports = {
  trackEvent,
};
