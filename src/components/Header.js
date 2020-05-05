import React from 'react'

const Header = ({ variant, children }) => {
  return (
    <div className="w-full text-center mt-4 mb-4 text-2xl md:text-3xl lg:text-4xl">
      {variant === "1" &&
        <h3 className="inline font-bold px-5 pb-2 title-bg text-themePurple title-bg-1 rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      }
      {variant === "2" &&
        <h3 className="inline font-bold px-5 pb-2 title-bg text-themePurple title-bg-2 rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      }
      {variant === "3" &&
        <h3 className="inline font-normal md:font-semibold px-5 pb-2 title-bg-3 text-themeOffWhite rounded-tl-lg rounded-br-lg">
          {children}
        </h3>
      }
      {variant === "4" &&
        <h3 className="inline font-normal md:font-semibold px-5 pb-2 title-bg-4 text-themeOffWhite rounded-tr-lg rounded-bl-lg">
          {children}
        </h3>
      }
    </div>
  )
}

export default Header
