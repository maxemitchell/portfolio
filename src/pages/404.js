import React from 'react'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import { Link } from 'gatsby'

const NotFound = ({}) => {
  return (
    <Layout>
      <SEO title="404" />
      <div className="flex flex-wrap w-full max-w-6xl mx-auto justify-between items-center">
        <div className="w-full font-manrope text-center text-lg sm:text-xl font-thin leading-snug">
          <p>
            This page does not exist! Maybe it will in the future? Probably not.
          </p>
          <Link
            to="/"
            className="inline text-themeBlue hover:text-themeRed duration-500"
          >
            Click this to go back home :)
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default NotFound
