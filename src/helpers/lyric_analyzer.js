import lyricsData from '../pages/code_art/little_man_kir_edit/lyrics.json'

class LyricAnalyzer {
  constructor() {
    this.lastWordIndex = -1
  }

  /**
   * Checks if a new word should be displayed based on the current timestamp.
   * @param {number} timestamp - The current timestamp in the audio track.
   * @returns {string|null} - The new word if a change is detected, null otherwise.
   */
  getNewWord(timestamp) {
    timestamp = timestamp - 0.1 // Add a small buffer to the timestamp to account for slight timing differences
    const nextWordIndex = this.lastWordIndex + 1
    const nextWord = lyricsData[nextWordIndex]

    // Check if we've reached the end of the lyrics
    if (!nextWord) {
      return null
    }

    // Check if the current timestamp is within the start and end of the next word
    if (timestamp >= nextWord.start && timestamp <= nextWord.end) {
      this.lastWordIndex = nextWordIndex
      return nextWord.word
    }

    return null
  }
}

export default LyricAnalyzer
