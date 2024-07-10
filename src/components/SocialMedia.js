import React from 'react'
import GithubLogo from '../images/github.svg'
import InstagramLogo from '../images/instagram.svg'
import TwitterLogo from '../images/twitter.svg'
import LinkedInLogo from '../images/linkedin.svg'
import YouTubeLogo from '../images/youtube.svg'

const SocialMedia = () => {
  return (
    <div className="inline sm:flex-nowrap w-full justify-evenly items-baseline sm:justify-center font-manrope font-medium text-base text-themeOffWhite md:text-lg mb-6 mt-3">
      <a
        href="https://www.instagram.com/maxedmitchell"
        target="_blank"
        className="text-sm text-themeBlue hover:text-themeRed"
      >
        Instagram
      </a>
      ,{' '}
      <a
        href="https://twitter.com/maxemitchell"
        target="_blank"
        className="text-sm text-themeBlue hover:text-themeRed"
      >
        Twitter
      </a>
      ,{' '}
      <a
        href="https://github.com/maxemitchell"
        target="_blank"
        className="text-sm text-themeBlue hover:text-themeRed"
      >
        Github
      </a>
      ,{' '}
      <a
        href="https://www.linkedin.com/in/maxemitchell/"
        target="_blank"
        className="text-sm text-themeBlue hover:text-themeRed"
      >
        LinkedIn
      </a>
      ,{' '}
      <a
        href="https://www.youtube.com/c/MaxMitchell"
        target="_blank"
        className="text-sm text-themeBlue hover:text-themeRed"
      >
        YouTube
      </a>
    </div>
  )
}

export default SocialMedia
