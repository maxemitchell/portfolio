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
        let dimension, canvas, squares
        let windowRatio = 2.

        class AveragedSquare {
            constructor(x, y, l, isSource) {
                this.x = x
                this.y = y
                this.l = l
                this.hue = p.random(360)
                this.color = p.color(this.hue, 37, 77)
                this.isSource = isSource
            }

            draw() {
                p.fill(this.color)
                p.noStroke()
                p.square(this.x, this.y, this.l+.5, 0)
            }
        }

        class Squares {
            constructor() {
                this.squares = []
                this.NUM_SQUARES = p.round(p.random(10,100))
                this.NUM_SOURCES = p.round(p.random(2,20))
                this.SPACING = 0

                let length = p.width / (this.NUM_SQUARES + this.SPACING)
                let height = p.height / (this.NUM_SQUARES + this.SPACING)
                let lengthMargin = length / this.NUM_SQUARES
                let heightMargin = height / this.NUM_SQUARES

                for(let i = 0; i < this.NUM_SQUARES; i++){
                    let curRow = []
                    let x = i*length + this.SPACING*i*lengthMargin + lengthMargin*this.SPACING/2
                    
                    for(let j = 0; j < this.NUM_SQUARES; j++){
                        let isSource = p.random(this.NUM_SQUARES*this.NUM_SQUARES) < this.NUM_SOURCES
                        let y = j*height + this.SPACING*j*heightMargin + heightMargin*this.SPACING/2

                        curRow.push(new AveragedSquare(x, y, length, isSource))
                    }
                    this.squares.push(curRow)
                }
            }

            draw() {
                for(let i = 0; i < this.squares.length; i++){
                    for(let j = 0; j < this.squares[i].length; j++){
                        this.squares[i][j].draw()
                    }
                }
            }

            update() {
                for(let i = 0; i < this.squares.length; i++){
                    for(let j = 0; j < this.squares[i].length; j++){
                        let curSquare = this.squares[i][j]
                        if(curSquare.isSource){
                            curSquare.hue = (curSquare.hue+.6)%360
                        }else{
                            let targetHueX = 0
                            let targetHueY = 0
                            let neighborHue

                            // long code below I know its sloppy fight me
                            neighborHue = this.getHue(i-1,j)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i-1,j-1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i-1,j+1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i,j-1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i,j+1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i+1,j)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i+1,j-1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }
                            neighborHue = this.getHue(i+1,j+1)
                            if(neighborHue != -1){
                                targetHueY += p.sin(neighborHue-180)
                                targetHueX += p.cos(neighborHue-180)
                            }              
                            curSquare.hue = p.atan2(targetHueY, targetHueX)+180
                        }
                        curSquare.color = p.color(curSquare.hue, 37, 77)
                    }
                }
            }

            getHue(row,col) {
                if(row < 0 || col < 0 || row == this.NUM_SQUARES || col == this.NUM_SQUARES){
                    return -1
                }else{
                    return this.squares[row][col].hue
                }
            }
        }

        // Initial setup to create canvas and audio analyzers
        p.setup = () => {
            dimension = p.min(p.windowWidth / windowRatio, p.windowHeight / windowRatio)
            p.frameRate(60)
            p.pixelDensity(2.0)
            p.noStroke()
            p.colorMode(p.HSB, 360, 100, 100)
            p.angleMode(p.DEGREES)

            canvas = p.createCanvas(dimension, dimension)
            canvas.mouseClicked(p.handleClick)

            squares = new Squares()
        }

        p.draw = () => {
            p.clear()
            squares.update()
            squares.draw()
        }

        p.windowResized = () => {
            dimension = p.min(p.windowWidth / windowRatio, p.windowHeight / windowRatio)
            p.resizeCanvas(dimension, dimension)
        }

        p.handleClick = () => {
            squares = new Squares()
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
                        <Header variant="1">Color of Average</Header>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4 ">
                            <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
                                My second generative art. Inspired by{' '}
                                <a
                                    href="https://www.reddit.com/r/generative/comments/kbvau2/oc_each_clock_shows_average_time_of_its_neighbors/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    this post
                                </a>
                                {' '}on reddit, I created some sort of naturally changing gradient. It has a nice pastel look to it, and works with a handful of source points that rotate the colorwheel while the rest of the points take the average value of their neighbors.
                            </p>
                        </div>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
                            <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
                                This artwork <strong>randomly generates</strong> each time you <strong>click</strong> it. So please click it as much as your heart desires.
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default PackedCircles