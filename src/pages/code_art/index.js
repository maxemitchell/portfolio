import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../../components/SEO'
import Layout from '../../components/Layout'
import CodeArtPreview from '../../components/CodeArtPreview'

const CodeArt = ({ data }) => {
  return (
    <Layout>
      <SEO
        title="Code Art"
        desc="A collection of code art I've made. Some music visualizers, some in processing, some in three.js"
      />
      <div className="flex flex-wrap mt-10 justify-center items-center mb-10 max-w-6xl w-full mx-auto">
        <CodeArtPreview
          slug="/code_art/little_man_kir_edit"
          title="Little Man KiR Edit"
          image={data.littleManRemix.childImageSharp.gatsbyImageData}
          type="left"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              Inspired by 2001: A Space Odyssey's 'Beyond the Infinite' scene, I
              created this music visualizer using{' '}
              <a
                href="https://threejs.org/"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                three.js
              </a>
              . The song featured is an edit of Little Man's Little Dragon by my
              friend{' '}
              <a
                href="https://instagram.com/kirsongs"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeBlue hover:text-themeRed duration-500"
              >
                KiR{' '}
              </a>
              <a
                href="https://soundcloud.com/kirsongs"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                (his soundcloud)
              </a>
              .
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/miss_julia_the_third"
          title="Miss Julia the Third"
          image={data.missJuliaTheThird.childImageSharp.gatsbyImageData}
          type="right"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              A little 3D Julia Sets Visualization
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/unknown_lines"
          title="Unknown Lines"
          image={data.unknownLines.childImageSharp.gatsbyImageData}
          type="left"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              Inspired by Joy Division's Unknown Pleasures album cover, I
              created this music visualizer using{' '}
              <a
                href="https://threejs.org/"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                three.js
              </a>
              . The song featured is an unreleased track from my friend{' '}
              <a
                href="https://www.instagram.com/benisonmusic"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeBlue hover:text-themeRed duration-500"
              >
                benison
              </a>
              .
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/an_average_packing"
          title="An Average Packing"
          image={data.averagePacking.childImageSharp.gatsbyImageData}
          type="right"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              Combining my previous two generative works, this is a work with
              packed circles that take the average color of their neighbors,
              using the{' '}
              <a
                href="https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                k-nearest neighbors algorithm
              </a>{' '}
              (In this case with k=7).
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/thanksgiving_break"
          title="Thanksgiving Break"
          image={data.thanksgivingBreak.childImageSharp.gatsbyImageData}
          type="left"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              Over Thanksgiving Break 2020, I created this visualizer using{' '}
              <a
                href="https://p5js.org/"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                p5.js
              </a>
              . The song featured is an unreleased track from my friend{' '}
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
          }
        />

        <CodeArtPreview
          slug="/code_art/ghost_coast"
          title="Ghost Coast"
          image={data.ghostCoast.childImageSharp.gatsbyImageData}
          type="right"
          className="mt-12"
          description={
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
              with GLSL and p5.js. This was my first time using both, but I love
              the end result.
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/packed_circles"
          title="PCK MTN"
          image={data.circlePacking.childImageSharp.gatsbyImageData}
          type="left"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              My first piece of generative art. Inspired by various posts on{' '}
              <a
                href="https://www.reddit.com/r/generative/"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                r/generative
              </a>{' '}
              and this{' '}
              <a
                href="https://editor.p5js.org/cah689/sketches/B1kCFI36b"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeBlue hover:text-themeRed duration-500"
              >
                example
              </a>{' '}
              by Daniel Shiffman (notably his use of target circles per frame).
              Color Palette comes from Childish Gambino's STN MTN mixtape.
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/color_of_average"
          title="Color of Average"
          image={data.colorAverage.childImageSharp.gatsbyImageData}
          type="right"
          className="mt-12"
          description={
            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
              My second generative art. Inspired by{' '}
              <a
                href="https://www.reddit.com/r/generative/comments/kbvau2/oc_each_clock_shows_average_time_of_its_neighbors/"
                target="_blank"
                rel="noreferrer"
                className="inline text-themeRed hover:text-themeBlue duration-500"
              >
                this post
              </a>{' '}
              on reddit, I created some sort of naturally changing gradient. It
              has a nice pastel look to it, and works with a handful of source
              points that rotate the colorwheel while the rest of the points
              take the average value of their neighbors.
            </p>
          }
        />

        <CodeArtPreview
          slug="/code_art/iris_gen"
          title="iris-gen"
          image={data.irisGen.childImageSharp.gatsbyImageData}
          type="left"
          className="mt-12"
          description={
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
          }
        />
      </div>
    </Layout>
  )
}

export default CodeArt

export const query = graphql`
  query CodeArtPreviews {
    littleManRemix: file(relativePath: { eq: "little_man_remix_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    missJuliaTheThird: file(
      relativePath: { eq: "miss_julia_the_third_preview.png" }
    ) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    ghostCoast: file(relativePath: { eq: "ghost_coast_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    unknownLines: file(relativePath: { eq: "unknown_lines_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    thanksgivingBreak: file(
      relativePath: { eq: "thanksgiving_break_preview.png" }
    ) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    circlePacking: file(relativePath: { eq: "circle_packing_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    colorAverage: file(relativePath: { eq: "color_of_average_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    averagePacking: file(
      relativePath: { eq: "an_average_packing_preview.png" }
    ) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
    irisGen: file(relativePath: { eq: "iris_gen_preview.png" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          layout: CONSTRAINED
        )
      }
    }
  }
`
