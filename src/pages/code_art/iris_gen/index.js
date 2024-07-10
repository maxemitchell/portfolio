import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import p5 from 'p5'
import Iris from 'iris-gen'

class IrisGen extends React.Component {
  constructor() {
    super()
    this.myRef = React.createRef()
  }

  Sketch(p) {
    let dimension, canvas, myIris
    const windowRatio = 2.0
    const border = 4

    const recurseSquare = (x, y, size) => {
      if (size < 4) {
        myIris.updatePetal()
        return
      } else {
        const myColor = myIris.currentPetalColor()
        p.fill(myColor.h, myColor.s, myColor.l)
        p.square(x, y, size)
        const newSize = size / 2 - border * 2
        if (p.random(10) < 9) {
          recurseSquare(x + border, y + border, newSize)
        }
        if (p.random(10) < 8) {
          recurseSquare(x + border, y + newSize + border * 2, newSize)
        }
        if (p.random(10) < 8) {
          recurseSquare(x + newSize + border * 2, y + border, newSize)
        }
        if (p.random(10) < 1) {
          recurseSquare(
            x + newSize + border * 2,
            y + newSize + border * 2,
            newSize
          )
        }
      }
    }
    // Initial setup to create canvas
    p.setup = () => {
      dimension = p.min(
        p.windowWidth / windowRatio,
        p.windowHeight / windowRatio
      )
      p.frameRate(5)
      p.pixelDensity(4.0)
      p.noStroke()
      p.colorMode(p.HSB, 360, 100, 100)
      p.angleMode(p.DEGREES)
      p.noLoop()

      canvas = p.createCanvas(dimension, dimension)
      canvas.mouseClicked(p.handleClick)

      myIris = new Iris()
    }

    p.draw = () => {
      p.clear()
      myIris.updatePetal()
      recurseSquare(0, 0, dimension)
    }

    p.windowResized = () => {
      dimension = p.min(
        p.windowWidth / windowRatio,
        p.windowHeight / windowRatio
      )
      p.resizeCanvas(dimension, dimension)
    }

    p.handleClick = () => {
      myIris = new Iris()
      p.redraw()
    }
  }

  // React things to make p5.js work properly and not lag when leaving the current page below
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
        <SEO title="Code Art" />
        <div className="flex flex-wrap lg:flex-nowrap mt-12 w-full justify-center items-center">
          {/* The actaual canvas for p5.js */}
          <div
            className="flex justify-center picture-border-sm-1"
            ref={this.myRef}
          />
          <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
            <Header variant="1">iris-gen</Header>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4 ">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                A color based generative art to test my{' '}
                <a
                  href="https://github.com/maxemitchell/iris-gen"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeRed hover:text-themeBlue duration-500"
                >
                  iris-gen
                </a>{' '}
                color palette library.
              </p>
            </div>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                This artwork <strong>randomly generates</strong> each time you{' '}
                <strong>click</strong> it. So please click it as much as your
                heart desires.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IrisGen
