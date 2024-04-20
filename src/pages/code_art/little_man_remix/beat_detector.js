import * as THREE from 'three';

/**
 * @typedef BeatDetectionResult
 * @property {boolean} subBassBeat
 * @property {boolean} bassBeat
 * @property {boolean} lowMidrangeBeat
 * @property {boolean} midrangeBeat
 * @property {boolean} upperMidrangeBeat
 * @property {boolean} presenceBeat
 * @property {boolean} brillianceBeat
 */

class BeatDetector {
  constructor(analyser, sound) {
    this.analyser = analyser;
    this.sound = sound;
    this.maxAmplitudes = [10, 10, 10, 10, 10, 10, 10]; // Initial max amplitudes for decay
    this.beatDetected = [false, false, false, false, false, false, false];
  }

  detectBeats() {
    const frequencyData = this.analyser.getFrequencyData();

    const frequencyRanges = [
      { start: 80, end: 140 }, // Sub Bass
      { start: 140, end: 300 }, // Bass
      { start: 300, end: 500 }, // Low Midrange
      { start: 500, end: 2000 }, // Midrange
      { start: 2000, end: 4000 }, // Upper Midrange
      { start: 4000, end: 6000 }, // Presence
      { start: 6000, end: 20000 }, // Brilliance
    ];

    const maxFreq = this.sound.context.sampleRate / 2;

    const results = frequencyRanges.map((range, index) => {
      const { start, end } = range;

      const startIdx = Math.round((start / maxFreq) * frequencyData.length);
      const endIdx = Math.round((end / maxFreq) * frequencyData.length);


      const currentMaxAmplitude = Math.max(...frequencyData.slice(startIdx, endIdx));

      this.maxAmplitudes[index] = Math.max(this.maxAmplitudes[index], currentMaxAmplitude);

      if ((currentMaxAmplitude >= (this.maxAmplitudes[index] * 0.98)) && !this.beatDetected[index]) {
        this.beatDetected[index] = true;
        return true
      } else if (currentMaxAmplitude <= this.maxAmplitudes[index] * 0.75) {
        this.beatDetected[index] = false;
      }

      // Implementing decay to the max amplitude over time to make detection more dynamic
      this.maxAmplitudes[index] *= 0.99;

        return false;
    });

    return {
      subBassBeat: results[0],
      bassBeat: results[1],
      lowMidrangeBeat: results[2],
      midrangeBeat: results[3],
      upperMidrangeBeat: results[4],
      presenceBeat: results[5],
      brillianceBeat: results[6],
    };
  }
}

export default BeatDetector;
