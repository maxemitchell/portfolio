import React from 'react'

const Experience = ({ variant, header, date, body }) => {
  if(variant == "left"){
    return (
      <div className="group w-full timeline-left px-5 text-left font-manrope">
        <div className="flex items-end pt-4">
          <div className="timeline-sq-blue group-hover:timeline-sq-blue-hover duration-1000 bg-themeBlue h-4 w-4 ease-in-out"></div>
          <h3 className="font-thin ml-4 text-lg">{header}</h3>
        </div>
        <h5 className="font-semibold ml-1 text-base">{date}</h5>
        <p className="max-h-0 overflow-hidden group-hover:max-h-100 mb-4 font-thin ml-1 mt-2 text-base duration-2000 leading-snug">
          {body}
        </p>
      </div>
    )
  }else if(variant == "right"){
    return (
      <div className="group w-full timeline-right px-5 text-right font-manrope">
        <div className="flex items-start pt-4 justify-end">
          <h3 className="font-thin mr-4 text-lg">{header}</h3>
          <div className="timeline-sq-red group-hover:timeline-sq-red-hover duration-1000 bg-themeRed h-4 w-4 ease-in-out"></div>
        </div>
        <h5 className="font-semibold mr-1 text-base">{date}</h5>
        <p className="max-h-0 overflow-hidden group-hover:max-h-100 mb-4 font-thin mr-1 mt-2 text-base duration-2000 leading-snug">
          {body}
        </p>
      </div>
    )
  }else{
    return(
      <>
      </>
    )
  }
}

export default Experience
