import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import ghostCoastShader from './ghostCoast.frag'
import vertShader from './base.vert'
import ghostCoast from './Space Ghost Coast To Coast.mp3'

class GhostCoast extends React.Component {
  constructor() {
    super()
    this.myRef = React.createRef()
  }

  Sketch(p) {
    let bands = 1024
    let amp, fft, shader, song, canvas
    let time
    let beatThreshold = 0.55
    let beatHoldFrames = 20
    let beatCutoff = 0
    let beatDecayRate = 0.97
    let framesSinceLastBeat = 0
    let beatState

    p.preload = () => {
      p.soundFormats('mp3')
      song = p.loadSound(ghostCoast)
    }

    p.setup = () => {
      let dimension = p.min(p.windowWidth / 2, p.windowHeight / 2)
      canvas = p.createCanvas(dimension, dimension, p.WEBGL)
      canvas.mouseClicked(p.handleClick)
      p.noStroke()
      p.frameRate(60)
      p.pixelDensity(2.0)

      shader = p.createShader(vertShader, ghostCoastShader)

      amp = new p5.Amplitude(0.8)
      fft = new p5.FFT(0.6, bands)

      time = 0
      beatState = 0
    }

    p.draw = () => {
      shader.setUniform('u_resolution', [p.width * 2, p.height * 2])
      shader.setUniform('u_mouse', [p.mouseX, p.mouseY])

      // Change the rate of time change depending on song amplitude
      let amplitude = amp.getLevel()
      time = time + p.constrain(0.015 * amplitude, 0.0005, 0.015)
      shader.setUniform('u_amp', amplitude)
      shader.setUniform('u_time', time)

      fft.analyze()
      let spectrum = fft.linAverages(128)
      for (let i = 0; i < spectrum.length; i++) {
        spectrum[i] = p.map(spectrum[i], 0, 255, 0, 1.0)
      }
      shader.setUniform('u_fft', spectrum)

      // Detect higMid (clap) beats
      let beatLevel = p.map(fft.getEnergy('highMid'), 0, 255, 0, 1.0)
      p.checkBeat(beatLevel)

      shader.setUniform('u_beat', beatState)
      p.rect(0, 0, p.width, p.height)

      p.shader(shader)
    }

    p.windowResized = () => {
      let dimension = p.min(p.windowWidth / 2, p.windowHeight / 2)
      p.resizeCanvas(dimension, dimension)
    }

    p.checkBeat = (beatLevel) => {
      if (beatLevel > beatCutoff && beatLevel > beatThreshold) {
        p.onBeat()
        beatCutoff = 1.0
        framesSinceLastBeat = 0
      } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
          framesSinceLastBeat++
        } else {
          beatCutoff *= beatDecayRate
          beatCutoff = Math.max(beatCutoff, beatThreshold)
        }
      }
    }

    p.onBeat = () => {
      beatState = (beatState + 1) % 2
    }

    p.handleClick = () => {
      if (song.isPlaying()) {
        if (song) {
          song.pause()
        }
      } else {
        song.play()
      }
    }
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  componentDidUpdate() {
    this.myP5.remove()
    this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  componentWillUnmount() {
    this.myP5.remove()
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Space Ghost Coast To Coast"
          desc="A music visualizer for the song Space Ghost Coast to Coast by Glass Animals."
        />
        <div className="flex flex-wrap lg:flex-nowrap mt-12 w-full justify-center items-center">
          <div
            className="picture-border-sm-1 flex justify-center"
            ref={this.myRef}
          />
          <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:ml-12 lg:justify-start">
            <Header variant="1">Space Ghost Coast To Coast</Header>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                Inspired by{' '}
                <a
                  href="https://opensource.glassanimals.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeBlue hover:text-themeRed duration-500"
                >
                  Glass Animal's
                </a>{' '}
                latest album{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Dreamland_(Glass_Animals_album)"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeRed hover:text-themeBlue duration-500"
                >
                  Dreamland
                </a>
                , I decided to create a music visualizer for the song{' '}
                <a
                  href="https://www.youtube.com/watch?v=ejirGSd3Hws"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeBlue hover:text-themeRed duration-500"
                >
                  Space Ghost Coast to Coast{' '}
                </a>
                with GLSL and p5.js. This was my first time using both, but I
                love the end result.
              </p>
            </div>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                Please <b>click</b> on the visualization to start/stop the song.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default GhostCoast
