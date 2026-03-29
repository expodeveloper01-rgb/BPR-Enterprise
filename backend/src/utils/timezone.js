// Timezone utility for Manila time (Asia/Manila = UTC+8)
// Stores current Manila time as ISO string for database consistency

/**
 * Get current UTC time as ISO string
 * Simply returns the current UTC time (no conversion needed)
 * The client will convert to Manila time for display using timeZone option
 * @returns {string} ISO string of current UTC time
 */
const getManilaTimeISO = () => {
  // Store actual UTC time, not Manila time disguised as UTC
  return new Date().toISOString();
};

/**
 * Get current time in Manila timezone
 * @returns {Date} Date object representing current Manila time
 */
const getManilaTime = () => {
  const now = new Date();
  const manilaOffset = 8 * 60;
  const systemOffset = -now.getTimezoneOffset();
  const diff = (manilaOffset - systemOffset) * 60 * 1000;
  return new Date(now.getTime() + diff);
};

/**
 * Format a Date object to Manila timezone ISO string for database storage
 * @param {Date} date - Date object to format
 * @returns {string} ISO string in Manila timezone
 */
const formatManilaTime = (date) => {
  const manilaOffset = 8 * 60;
  const systemOffset = -date.getTimezoneOffset();
  const diff = (manilaOffset - systemOffset) * 60 * 1000;
  const manilaTime = new Date(date.getTime() + diff);
  return manilaTime.toISOString();
};

module.exports = {
  getManilaTimeISO,
  getManilaTime,
  formatManilaTime,
};
