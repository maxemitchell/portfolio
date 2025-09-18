import React from 'react'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import WorkExperiences from '../components/WorkExperiences'
import Header from '../components/Header'

const About = ({}) => {
  return (
    <Layout>
      <SEO
        title="About"
        desc="All about Max Mitchell. Who is he? What does he do?"
      />
      <div className="flex flex-wrap w-full max-w-6xl mx-auto justify-between items-center">
        <div className="w-full font-manrope text-left text-base sm:text-md font-extralight md:w-1/2 px-6 lg:px-8">
          <p className="w-full mt-2 sm:mt-4">
            In case it still wasn't clear, my name is <strong>Max</strong>.
          </p>
          <p className="w-full mt-3 sm:mt-5">
            I'm from <strong>Chicago</strong>.
          </p>
          <p className="w-full mt-3 sm:mt-5">
            I studied <strong>Computer Engineering</strong> with a minor in
            <strong> Technology and Management</strong> at <strong>UIUC</strong>
            .
          </p>
          <p className="w-full mt-3 sm:mt-5">
            At the end of this month, I'm joining <strong>krea.ai</strong> as a{' '}
            <strong>Software Engineer</strong> to help create new creative
            tools.
          </p>
          <p className="w-full mt-3 sm:mt-5">
            In my free time I workout (currently enjoying yoga + running), take
            photos, work on whatever visual thing has my attention at the moment
            (currently projection mapping), go to concerts, meditate, and scroll
            on my phone.
          </p>
          <p className="w-full mt-3 sm:mt-5">
            I'm pretty bad at writing about myself.
          </p>

          <p className="w-full mt-3 sm:mt-5">
            <strong>Reach out to me</strong> on{' '}
            <a
              href="mailto:maxemitchell@gmail.com"
              className="text-themeBlue hover:text-themeRed"
            >
              email
            </a>
            ,{' '}
            <a
              href="https://www.instagram.com/maxedmitchell"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              instagram
            </a>
            ,{' '}
            <a
              href="https://twitter.com/maxemitchell"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              twitter
            </a>
            ,{' '}
            <a
              href="https://github.com/maxemitchell"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              github
            </a>
            ,{' '}
            <a
              href="https://www.linkedin.com/in/maxemitchell/"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              linkedin
            </a>
            ,{' '}
            <a
              href="https://www.youtube.com/c/MaxMitchell"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              youtube
            </a>
            , or{' '}
            <a
              href="https://www.tiktok.com/@maxemitchell"
              target="_blank"
              className="text-themeBlue hover:text-themeRed"
            >
              tiktok
            </a>
            .
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <Header variant="1">my experience</Header>
          <WorkExperiences />
        </div>
      </div>
    </Layout>
  )
}

export default About
