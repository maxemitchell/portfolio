import React from 'react'
import Experience from './Experience'

const WorkExperiences = () => {
  return (
    <div className="px-6">
      <Experience
        variant={'top'}
        header={'tastytrade / Junior Developer'}
        date={'August 2021 - Present'}
        body={
          'Starting my full time engineering career at tastytrade in chicago :)'
        }
      />

      <Experience
        variant={'right'}
        header={'Synchrony Financial / Emerging Technology Intern'}
        date={'January 2020 - May 2021'}
        body={
          'Currently working on a React Data Analytics platform built with AWS S3, Lambda, and EMR.'
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
