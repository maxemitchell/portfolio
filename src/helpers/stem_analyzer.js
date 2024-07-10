import stemData from '../pages/code_art/little_man_remix/stem_data.json'

class StemAnalyzer {
  constructor() {
    this.lastBeatIndices = {}
  }

  /**
   * Checks if a new beat has occurred in the specified stem since the last beat index provided.
   * @param {number} timestamp - The current timestamp in the audio track.
   * @param {string} stemName - The name of the stem to check for a beat (e.g., 'kick', 'drum_breakdown').
   * @returns {boolean} - True if a new beat has occurred since the last beat index, false otherwise.
   */
  isNewBeat(timestamp, stemName) {
    timestamp = timestamp + 0.05 // Add a small buffer to the timestamp to account for slight timing differences
    // Ensure the stem exists in the data
    if (!stemData[stemName]) {
      console.error(`Stem '${stemName}' not found.`)
      return false
    }

    // Initialize last beat index for the stem if it doesn't exist
    if (this.lastBeatIndices[stemName] === undefined) {
      this.lastBeatIndices[stemName] = -1
    }

    // Get the beat timestamps for the stem
    const beatTimestamps = stemData[stemName].beat_timestamps

    // Find if there's a new beat between the last beat index and the current timestamp
    const newBeatIndex = beatTimestamps.findIndex((beatTimestamp, index) => {
      return (
        index > this.lastBeatIndices[stemName] && beatTimestamp <= timestamp
      )
    })

    // Update the last beat index for the stem
    if (newBeatIndex !== -1) {
      this.lastBeatIndices[stemName] = newBeatIndex
      return true
    }

    return false
  }

  /**
   * Retrieves the beat note for the specified stem based on the last detected beat.
   * @param {string} stemName - The name of the stem to retrieve the beat note for.
   * @returns {string|null} - The beat note if available, otherwise null.
   */
  getBeatNote(stemName) {
    if (!stemData[stemName]) {
      console.error(`Stem '${stemName}' not found.`)
      return null
    }

    const beat_notes = stemData[stemName].beat_notes
    const lastBeatIndex = this.lastBeatIndices[stemName]

    if (lastBeatIndex !== undefined && lastBeatIndex !== -1) {
      return beat_notes[lastBeatIndex] || null
    }

    return null
  }
}

export default StemAnalyzer
