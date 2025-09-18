import React from 'react'
import Experience from './Experience'

const WorkExperiences = () => {
  return (
    <div className="px-6">
      <Experience
        variant={'right'}
        header={'krea.ai / Software Engineer'}
        date={'September 2025 - Present'}
        body={'Joining krea.ai to help create new creative tools.'}
      />

      <Experience
        variant={'left'}
        header={'tastytrade / Junior Developer -> Senior Software Engineer'}
        date={'August 2021 - September 2025'}
        body={
          'Started my full time engineering career at tastytrade in chicago as a junior developer and grew to senior. Led backend Ruby development of crypto features, order routing, and profit-loss systems handling 200k+ trades/day. Functioned as tech lead for crypto products and led incident response for business-critical systems.'
        }
      />

      <Experience
        variant={'right'}
        header={'Synchrony Financial / Emerging Technology Intern'}
        date={'January 2020 - May 2021'}
        body={
          'Worked on a React Data Analytics platform built with AWS S3, Lambda, and EMR.'
        }
      />

      <Experience
        variant={'left'}
        header={'HERE Technologies / Software Engineering Intern'}
        date={'July 2019 - August 2019'}
        body={
          'I returned to the Highly Automated Driving division and created a GraphQL API for serving Geospatial Data. Also worked on an Angular front-end app to accompany it.'
        }
      />

      <Experience
        variant={'right'}
        header={'University of Melbourne / Study Abroad'}
        date={'February 2019 - July 2019'}
        body={
          'Spent five months abroad in Melbourne Australia. Wish I was still there.'
        }
      />

      <Experience
        variant={'left'}
        header={'HERE Technologies / Software Engineering Intern'}
        date={'June 2018 - August 2018'}
        body={
          'Created a 3D Geospatial Visualization tool in JavaScript for R&D use.'
        }
      />

      <Experience
        variant={'right'}
        header={'University of Illinois at Urbana-Champaign'}
        date={'August 2017 - May 2021'}
        body={'Started my college career with the Fighting Illini.'}
      />

      <Experience
        variant={'left'}
        header={'Lane Tech High School'}
        date={'August 2011 - June 2017'}
        body={
          'Began the LTAC program for 7th and 8th grade and ended up staying for six years. Special props to the Innovation and Creation Lab, Physical Computing Lab, and Photography room.'
        }
      />
    </div>
  )
}

export default WorkExperiences
