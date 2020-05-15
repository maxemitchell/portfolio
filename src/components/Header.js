import React from 'react'

const Header = ({ variant, children }) => {
  return (
    <div className="w-full text-center mt-5 mb-5">
      {variant === '1' && (
        <h3 className="inline font-bold text-2xl px-3 md:px-4 pb-1 md:pb-2 text-themePurple gradient-bg border-tl rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      )}
      {variant === '2' && (
        <h3 className="inline font-bold text-2xl px-3 md:px-4 pb-1 md:pb-2 text-themePurple gradient-bg border-corners rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      )}
      {variant === '3' && (
        <h3 className="inline mb-5 font-normal text-2xl md:text-3xl lg:text-4xl md:font-semibold px-5 pb-2 title-bg text-themeOffWhite rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      )}
    </div>
  )
}

export default Header
