import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import p5 from 'p5'

class AnAveragePacking extends React.Component {
    constructor() {
        super()
        this.myRef = React.createRef()
    }


    Sketch = (p) => {
        let dimension, canvas, circles
        let windowRatio = 2.

        // Class that represents each circle
        class AveragedCircle {
            // Constructed with a location (x,y), a diameter, and a boolean isSource
            constructor(x, y, diameter, isSource) {
                this.x = x
                this.y = y
                this.d = diameter
                this.isSource = isSource
                this.kNN = []
                this.growing = true
                if(isSource){
                    this.hue = p.random(360)
                    this.color = p.color(this.hue,37,77)
                }else{
                    this.hue = 0
                    this.color = p.color(this.hue,0,27)
                }
            }

            draw() {
                p.fill(p.color(177,0,7))
                p.stroke(this.color)
                p.strokeWeight(1);
                p.circle(this.x, this.y, this.d)
            }

            // Grows until it hits another circle
            grow() {
                this.d += 1
            }

            // Returns true if the given x,y point is within the current circle + slack
            collisionCheck(x, y, d, slack) {
                return p.dist(this.x, this.y, x, y) <= ((this.d/2) + d/2 + slack)
            } 
        }

        // A colleciton of circles that randomly pack and slowly change and average the color
        class AveragedCircles {
            constructor() {
                this.circles = []
                this.MAX_CIRCLES = 600     // Max number of circles that can be added
                this.NUM_SOURCES = 27       // Not a hard limit on the number of sources, but effects the overall probability of a circle being a source
                this.MAX_ATTEMPTS = 750     // Max attempts to hit the target number of circles added per frame
                this.FIND_KNN_NUM = 500     // Number of circles when the KNN is found for each point and colors start changing
                this.foundKNN = false
                this.k = 7                  // Number of closes tneighbors used to calculate average color
                this.sat = 43
                this.brightness = 71
            }

            addCircle() {
                if(this.circles.length >= this.MAX_CIRCLES){
                    return -1
                }
                
                // Attempt to add target number of valid circles within MAX_ATTEMPTS
                let target = 1 + p.constrain(p.floor(p.frameCount / 240), 1, 20)      // Shamelessly Stolen from Daniel Shiffman
                let numAttempts = 0
                let numAdded = 0
                while(numAttempts < this.MAX_ATTEMPTS){
                    numAttempts++
                    let x = p.random(p.width)
                    let y = p.random(p.height)
                    let isSource = p.random(this.MAX_CIRCLES) < this.NUM_SOURCES 
                    let d = 3

                    let isValid = true
                    for(let i = 0; i < this.circles.length; i++){
                        if(this.circles[i].collisionCheck(x, y, d, 6)){
                            isValid = false
                            break
                        }
                    }
                    if(isValid){
                        this.circles.push(new AveragedCircle(x,y,d,isSource))
                        numAdded++

                        // If we already calculated KNN for the existing FIND_KNN_NUM of circles, we need to calculate the KNN for the new circle
                        if(this.circles.length > this.FIND_KNN_NUM){
                            let idx = this.circles.length-1
                            this.findKNN(idx)
                        }
                    }
                    if(numAdded == target){
                        break
                    }
                }
            }

            grow() {
                for(let i = 0; i < this.circles.length; i++){
                    let curCircle = this.circles[i]
                    if(curCircle.growing){
                        curCircle.grow()
                        // NOTE: this is inefficient and has N^2 runtime but N is small so should be okay
                        for(let j = 0; j < this.circles.length; j++){
                            if(curCircle != this.circles[j]){
                                if(this.circles[j].collisionCheck(curCircle.x, curCircle.y, curCircle.d, 1.3)){
                                    curCircle.growing = false
                                }
                            }
                        }
                    }
                }
            }

            updateColors() {
                // If we haven't found the KNN yet, we need to find it for each existing point
                if(!this.foundKNN){
                    for(let i = 0; i < this.circles.length; i++){
                        this.findKNN(i)
                    }
                    this.foundKNN = true
                }

                for(let i = 0; i < this.circles.length; i++){
                    let curCircle = this.circles[i]

                    if(!curCircle.isSource){
                        let targetHueX = 0
                        let targetHueY = 0

                        for(let j = 0; j < curCircle.kNN.length; j++){
                            let neighborHue = this.circles[curCircle.kNN[j]].hue
                            targetHueX += p.cos(neighborHue - 180)
                            targetHueY += p.sin(neighborHue - 180)
                        }
                        curCircle.hue = p.atan2(targetHueY,targetHueX) + 180
                    }else{
                        curCircle.hue = (curCircle.hue+.6)%360
                    }
                    curCircle.color = p.color(curCircle.hue, this.sat, this.brightness)
                }
            }

            draw() {
                for(let i = 0; i < this.circles.length; i++){
                    this.circles[i].draw()
                }
            }

            findKNN(idx) {
                let curCircle = this.circles[idx]
                if(!curCircle.isSource){
                    let closestCircles = []
                    let maxDist

                    for(let j = 0; j < this.circles.length; j++){
                        let nextCircle = this.circles[j]
                        let distance =  p.dist(curCircle.x, curCircle.y, nextCircle.x, nextCircle.y)
                        
                        if(closestCircles.length < this.k || distance < maxDist){
                            closestCircles.push({idx: j, dist: distance})
                            closestCircles.sort((a,b) => a.dist < b.dist ? -1 : 1)
                            if(closestCircles.length > this.k){
                                closestCircles.pop()
                            }
                            maxDist = closestCircles[closestCircles.length - 1].dist
                        }
                    }
                    this.circles[idx].kNN = closestCircles.map((a) => a.idx)
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

            circles = new AveragedCircles()
        }

        p.draw = () => {
            // p.clear()
            p.background(177,0,0)
            circles.addCircle()
            circles.grow()
            if(circles.circles.length > circles.FIND_KNN_NUM){
                circles.updateColors()
            }
            circles.draw()
        }

        p.windowResized = () => {
            dimension = p.min(p.windowWidth / windowRatio, p.windowHeight / windowRatio)
            p.resizeCanvas(dimension, dimension)
        }

        p.handleClick = () => {
            p.save()
            circles = new AveragedCircles()
            p.frameCount = 0
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
                        <Header variant="1">An Average Packing</Header>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4 ">
                            <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
                                Combining my previous two generative works, this is a work with packed circles that take the average color of their neighbors, using the{' '}
                                <a
                                    href="https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                k-nearest neighbors algorithm
                                </a>
                                {' '}(In this case with k=7).
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

export default AnAveragePacking