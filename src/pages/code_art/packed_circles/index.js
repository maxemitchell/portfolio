import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import p5 from 'p5'

class PackedCircles extends React.Component {
    constructor() {
        super()
        this.myRef = React.createRef()
    }


    Sketch = (p) => {
        let dimension, canvas, circles
        let windowRatio = 2.

        let colors = [ 
            p.color('#dc4d07'),
            p.color('#a0d2f3'),
            p.color('#fbe997'),
            p.color('#f06f07'),
            p.color('#4e6167')
        ]

        class Circle {
            constructor(x, y, diameter) {
                this.x = x
                this.y = y
                this.d = diameter
                this.color = colors[p.round(x)%3 + p.round(y)%2]
                this.growing = true
            }

            draw() {
                p.fill(this.color)
                p.circle(this.x, this.y, this.d)
            }

            // Grows until it hits another circle
            grow() {
                this.d += 1
            }

            // Returns true if the given x,y point is within the current circle
            collisionCheck(x, y, d, slack) {
                return p.dist(this.x, this.y, x, y) <= ((this.d/2) + d/2 + slack)
            } 
        }

        class Circles {
            constructor() {
                this.circles = []
                this.MAX_CIRCLES = 1000
                this.MAX_ATTEMPTS = 1250
                this.growing = true
            }

            addCircle() {
                if(this.circles.length >= this.MAX_CIRCLES){
                    return -1
                }
                
                let target = 1 + p.constrain(p.floor(p.frameCount / 120), 0, 20)      // Shamelessly Stolen from Daniel Shiffman
                
                let numAttempts = 0
                let numAdded = 0
                while(numAttempts < this.MAX_ATTEMPTS){
                    numAttempts++
                    let x = p.random(p.width)
                    let y = p.random(p.height)
                    let d = 1

                    let isValid = true
                    for(let i = 0; i < this.circles.length; i++){
                        if(this.circles[i].collisionCheck(x, y, d, 6)){
                            isValid = false
                            break
                        }
                    }

                    if(isValid){
                        this.circles.push(new Circle(x,y,d))
                        numAdded++
                    }

                    if(numAdded == target){
                        break
                    }
                }
            }

            grow() {
                if(this.growing){
                    let stillGrowing = false
                    for(let i = 0; i < this.circles.length; i++){
                        let curCircle = this.circles[i]
                        if(curCircle.growing){
                            stillGrowing = true
                            curCircle.grow()
                            // NOTE: this is inefficient and has N^2 runtime but N is small so should be okay
                            for(let j = 0; j < this.circles.length; j++){
                                if(curCircle != this.circles[j]){
                                    if(this.circles[j].collisionCheck(curCircle.x, curCircle.y, curCircle.d, .5)){
                                        curCircle.growing = false
                                    }
                                }
                            }
                        }
                    }
                    this.growing = stillGrowing
                }
            }

            draw() {
                for(let i = 0; i < this.circles.length; i++){
                    this.circles[i].draw()
                }
            }
        }

        // Initial setup to create canvas and audio analyzers
        p.setup = () => {
            dimension = p.min(p.windowWidth / windowRatio, p.windowHeight / windowRatio)
            p.frameRate(60)
            p.pixelDensity(2.0)
            p.noStroke()

            canvas = p.createCanvas(dimension, dimension)
            circles = new Circles()
        }

        p.draw = () => {
            p.clear()
            circles.addCircle()
            circles.grow()
            circles.draw()
            if(!circles.growing){
                p.noLoop()
            }
        }

        p.windowResized = () => {
            dimension = p.min(p.windowWidth / windowRatio, p.windowHeight / windowRatio)
            p.resizeCanvas(dimension, dimension)
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
                <div className="flex flex-wrap lg:flex-no-wrap mt-12 w-full justify-center items-center">
                    {/* The actaual canvas for p5.js */}
                    <div
                        className="flex justify-center picture-border-sm-1"
                        ref={this.myRef}
                    />
                    <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
                        <Header variant="1">PCK MTN</Header>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4 ">
                            <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
                                My first piece of generative art. Inspired by various posts on{' '}
                                <a
                                    href="https://www.reddit.com/r/generative/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    r/generative
                                </a>
                                {' '}and this{' '}
                                <a
                                    href="https://editor.p5js.org/cah689/sketches/B1kCFI36b"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeBlue hover:text-themeRed duration-500"
                                >
                                    example
                                </a>
                                {' '}by Daniel Shiffman (notably his use of target circles per frame). Color Palette comes from Childish Gambino's STN MTN mixtape. 
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default PackedCircles