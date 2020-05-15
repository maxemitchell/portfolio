import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import WorkExperiences from '../components/WorkExperiences'
import Header from '../components/Header'
import SocialMedia from '../components/SocialMedia'
import MailLogo from '../images/mail.svg'

const About = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="flex flex-wrap w-full max-w-6xl mx-auto justify-between items-center">
        <div className="w-full font-manrope text-left text-lg font-thin leading-snug md:w-1/2 px-6 lg:px-8">
          <p className="w-full mt-4">
            In case it still wasn't clear, my name is <strong>Max</strong>.
          </p>
          <p className="w-full mt-5">
            I'm from <strong>Chicago, IL</strong>.
          </p>
          <p className="w-full mt-5">
            I study <strong>Computer Engineering</strong> with a minor in
            <strong> Technology and Management</strong> at <strong>UIUC</strong>
            .
          </p>
          <p className="w-full mt-5">
            In my free time I like to <strong>climb</strong> (bouldering), take{' '}
            <strong>pictures</strong> (currently rocking a Fuji X-T3), and
            <strong> travel</strong> (currently at 7 countries).
          </p>
          <p className="w-full mt-5">
            Yes, I realize how basic the above interests sound.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <Header variant="1">my experience</Header>
          <WorkExperiences />
        </div>

        <a 
          href="mailto:maxemitchell@gmail.com"
          className="mx-auto flex flex-no-wrap justify-center items-center mt-8 mb-2 hover:text-themeBlue hover:border-corners duration-300"
        >
          <MailLogo className="w-12 h-12" />
          <p className="ml-4 font-manrope text-3xl font-light">
            Reach out to me!
          </p>
        </a>

        <div className="w-full">
          <SocialMedia />
        </div>
      </div>
    </Layout>
  )
}

export default About

export const query = graphql`
  query About {
    site {
      siteMetadata {
        title
      }
    }
  }
`
