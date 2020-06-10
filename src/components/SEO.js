import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from 'gatsby'

const SEO = ({ title, desc, banner }) => {
  const { site } = useStaticQuery(query)
  const { pathname } = useLocation()

  const {
    buildTime,
    siteMetadata: {
      siteUrl,
      defaultTitle,
      titleTemplate,
      defaultDescription,
      defaultBanner,
      headline,
      siteLanguage,
      ogLanguage,
      author,
      twitter,
      facebook,
    },
  } = site

  const seo = {
    title: title || defaultTitle,
    description: desc || defaultDescription,
    image: `${siteUrl}${banner || defaultBanner}`,
    url: `${siteUrl}${pathname || ''}`,
  }

  // schema.org in JSONLD format
  // https://developers.google.com/search/docs/guides/intro-structured-data
  // You can fill out the 'author', 'creator' with more data or another type (e.g. 'Organization')

  const schemaOrgWebPage = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: siteUrl,
    headline,
    inLanguage: siteLanguage,
    mainEntityOfPage: siteUrl,
    description: defaultDescription,
    name: defaultTitle,
    author: {
      '@type': 'Person',
      name: author,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: author,
    },
    copyrightYear: '2020',
    creator: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    datePublished: '2020-05-20T10:30:00+01:00',
    dateModified: buildTime,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}${defaultBanner}`,
    },
  }

  return (
    <>
      <Helmet title={seo.title} titleTemplate={titleTemplate}>
        <html lang={siteLanguage} />
        <meta name="description" content={seo.description} />
        <meta name="image" content={seo.image} />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgWebPage)}
        </script>

        <meta property="og:site_name" content={facebook} />
        <meta property="og:locale" content={ogLanguage} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:image:alt" content={seo.description} />

        <meta name="twitter:creator" content={twitter} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        <meta name="twitter:image:alt" content={seo.description} />
      </Helmet>
    </>
  )
}
export default SEO
SEO.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  banner: PropTypes.string,
  pathname: PropTypes.string
}
SEO.defaultProps = {
  title: null,
  desc: null,
  banner: null,
  pathname: null
}
const query = graphql`
  query SEO {
    site {
      buildTime(formatString: "YYYY-MM-DD")
      siteMetadata {
        siteUrl
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        defaultBanner: banner
        headline
        siteLanguage
        ogLanguage
        author
        twitter
        facebook
      }
    }
  }
`
