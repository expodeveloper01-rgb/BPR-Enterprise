// Timezone utility for Manila time (Asia/Manila = UTC+8)
// Stores current Manila time as ISO string for database consistency

/**
 * Get current time in Manila timezone as ISO string
 * Converts the local time to Manila time and returns as ISO string
 * @returns {string} ISO string of current Manila time
 */
const getManilaTimeISO = () => {
  const now = new Date();

  // Manila is UTC+8
  // Get the time in Manila by formatting to parts and reconstructing
  const manilaFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  });

  const parts = manilaFormatter.formatToParts(now);
  const partsObj = {};
  parts.forEach(({ type, value }) => {
    partsObj[type] = value;
  });

  // Reconstruct as ISO string
  const manilaTime = new Date(
    `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}Z`,
  );

  return manilaTime.toISOString();
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
