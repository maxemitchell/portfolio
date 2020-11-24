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
            <div className="flex flex-wrap mt-10 justify-center items-center mb-10">
                <Link
                    to="/code_art/ghost_coast"
                    className="flex flex-wrap md:flex-no-wrap w-full justify-center items-center mb-8"
                >
                    <div className="flex flex-wrap w-1/3 justify-end text-right">
                        <Header variant="1">Space Ghost Coast To Coast</Header>
                        <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope mr-8 mb-4">
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
                            Please{' '}
                            <strong>
                                click/tap{' '}
                            </strong> 
                            on the visualizer to <strong>start/stop</strong> the music.
                        </p>
                    </div>
                    <div className="flex w-1/3 justify-start ml-4">
                        <Img
                            className="picture-border-sm-2"
                            alt="Space Ghost Preview Image"
                            fixed={data.ghostCoast.childImageSharp.fixed}
                            loading="lazy"
                        />
                    </div>
                </Link>

                <Link
                    to="/code_art/thanksgiving_break"
                    className="flex flex-wrap md:flex-no-wrap w-full justify-center items-center mb-8"
                >
                    <div className="flex w-1/3 justify-end mr-4">
                        <Img
                            className="picture-border-sm-2"
                            alt="Space Ghost Preview Image"
                            fixed={data.ghostCoast.childImageSharp.fixed}
                            loading="lazy"
                        />
                    </div>
                    <div className="flex flex-wrap w-1/3 justify-start text-left">
                        <Header variant="1">Thanksgiving Break</Header>
                        <p className="w-full text-sm md:text-md lg:text-lg font-thin font-manrope ml-8 mb-4">
                            It was Thanksgiving Break bitches
                        </p>
                    </div>
                </Link>
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
            fixed(width: 300, height: 300) {
                ...GatsbyImageSharpFixed
            }
            }
        }
 
    }
`