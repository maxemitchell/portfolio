import React from 'react'
import { graphql, Link } from 'gatsby'
import SEO from '../../components/SEO'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Img from 'gatsby-image'

const CodeArt = ({data}) => {
    return (
        <Layout>
            <SEO title="Code Art" />
            <div className="flex flex-wrap mt-10 justify-center items-center mb-10 max-w-6xl w-full mx-auto">

                <div className="flex flex-wrap md:flex-no-wrap w-full justify-center md:justify-start items-center">
                    <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-end mx-4">
                        <Link to="/code_art/thanksgiving_break" className="w-full max-w-md">
                            <Img
                                className="picture-border-sm-2 w-full"
                                alt="Space Ghost Preview Image"
                                fluid={data.thanksgivingBreak.childImageSharp.fluid}
                                loading="lazy"
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-start text-left ml-8 mr-4">
                        <Link to="/code_art/thanksgiving_break">
                            <Header variant="1">Thanksgiving Break</Header>
                        </Link>
                        <div className="flex w-full boxshadow-3d-left mt-4 mb-4">
                            <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
                                Over Thanksgiving Break 2020, I created this visualizer using{' '}
                                <a
                                    href="https://p5js.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    p5.js
                                </a>. The song featured is an unreleased track from my friend{' '}
                                <a
                                    href="https://www.instagram.com/bmark347/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeBlue hover:text-themeRed duration-500"
                                >
                                    Ben Mark
                                </a>
                                . I also released a{' '}
                                <a
                                    href="https://www.youtube.com/watch?v=_yXQayoxJOg"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    YouTube video{' '}
                                </a>
                                documenting my creation process.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-no-wrap w-full justify-center md:justify-end items-center mt-12">
                    <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-end text-right mr-8 ml-4">
                        <Link to="/code_art/ghost_coast">
                            <Header variant="4">Ghost Coast</Header>
                        </Link>
                            <div className="flex w-full boxshadow-3d-right mt-4 mb-4">
                                <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope m-4">
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
                                with GLSL and p5.js. This was my first
                                time using both, but I love the end result.
                                </p>
                            </div>
                    </div>
                    <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-start mx-4">
                        <Link to="/code_art/ghost_coast" className="w-full max-w-md">
                            <Img
                                className="picture-border-sm-1"
                                alt="Space Ghost Preview Image"
                                fluid={data.ghostCoast.childImageSharp.fluid}
                                loading="lazy"
                            />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-no-wrap w-full justify-center md:justify-start items-center mt-12">
                    <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-end mx-4">
                        <Link to="/code_art/packed_circles" className="w-full max-w-md">
                            <Img
                                className="picture-border-sm-2 w-full"
                                alt="PCK MTN Preview"
                                fluid={data.circlePacking.childImageSharp.fluid}
                                loading="lazy"
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-start text-left ml-8 mr-4">
                        <Link to="/code_art/packed_circles">
                            <Header variant="1">PCK MTN</Header>
                        </Link>
                        <div className="flex w-full boxshadow-3d-left mt-4 mb-4">
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
                <div className="flex flex-wrap md:flex-no-wrap w-full justify-center md:justify-end items-center mt-12">
                    <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-end text-right mr-8 ml-4">
                        <Link to="/code_art/color_of_average">
                            <Header variant="4">Color of Average</Header>
                        </Link>
                            <div className="flex w-full boxshadow-3d-right mt-4 mb-4">
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
                    </div>
                    <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-start mx-4">
                        <Link to="/code_art/color_of_average" className="w-full max-w-md">
                            <Img
                                className="picture-border-sm-1"
                                alt="Space Ghost Preview Image"
                                fluid={data.colorAverage.childImageSharp.fluid}
                                loading="lazy"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CodeArt

export const query = graphql`
    query CodeArtPreviews {
        ghostCoast: file(
            relativePath: { eq: "ghost_coast_preview.png" }
        ) {
            childImageSharp {
                fluid(traceSVG: { background: "#000000", color: "#0bbcd6" }) {
                    ...GatsbyImageSharpFluid_tracedSVG
                }
            }
        }
        thanksgivingBreak: file(
            relativePath: { eq: "thanksgiving_break_preview.png" }
        ) {
            childImageSharp {
                fluid(traceSVG: { background: "#000000", color: "#0bbcd6" }) {
                    ...GatsbyImageSharpFluid_tracedSVG
                }
            }
        }
        circlePacking: file(
            relativePath: { eq: "circle_packing_preview.png" }
        ) {
            childImageSharp {
                fluid(traceSVG: { background: "#000000", color: "#0bbcd6" }) {
                    ...GatsbyImageSharpFluid_tracedSVG
                }
            }
        }
        colorAverage: file(
            relativePath: { eq: "color_of_average_preview.png" }
        ) {
            childImageSharp {
                fluid(traceSVG: { background: "#000000", color: "#0bbcd6" }) {
                    ...GatsbyImageSharpFluid_tracedSVG
                }
            }
        }
    }
`