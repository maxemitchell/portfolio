import stemData from './stem_data.json';

class StemAnalyzer {
  constructor() {
    this.lastTimestamps = {};
  }

  /**
   * Checks if a new beat has occurred in the specified stem since the last timestamp provided.
   * @param {number} timestamp - The current timestamp in the audio track.
   * @param {string} stemName - The name of the stem to check for a beat (e.g., 'kick', 'drum_breakdown').
   * @returns {boolean} - True if a new beat has occurred since the last timestamp, false otherwise.
   */
  isNewBeat(timestamp, stemName) {
    // Ensure the stem exists in the data
    if (!stemData[stemName]) {
      console.error(`Stem '${stemName}' not found.`);
      return false;
    }

    // Initialize last timestamp for the stem if it doesn't exist
    if (this.lastTimestamps[stemName] === undefined) {
      this.lastTimestamps[stemName] = 0;
    }

    // Get the beat timestamps for the stem
    const beatTimestamps = stemData[stemName].beat_timestamps;

    // Find if there's a new beat between the last timestamp and the current timestamp
    const newBeatExists = beatTimestamps.some(beatTimestamp => {
      return beatTimestamp > this.lastTimestamps[stemName] && beatTimestamp <= timestamp;
    });

    // Update the last timestamp for the stem
    if (newBeatExists) {
      this.lastTimestamps[stemName] = timestamp;
    }

    return newBeatExists;
  }
}

export default StemAnalyzer;
