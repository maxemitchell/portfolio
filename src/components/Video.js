import React from 'react'
import ReactPlayer from 'react-player/lazy'

const Video = ({ videoID, className }) => (
  <div className={className}>
    <ReactPlayer
      light={'https://i.ytimg.com/vi_webp/' + videoID + '/0.webp'}
      url={'https://www.youtube.com/embed/' + videoID}
      width="100%"
      height="100%"
    />
  </div>
)

export default Video
