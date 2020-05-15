import React from 'react'
import Experience from './Experience'

const WorkExperiences = () => {
  return (
    <div className="px-6">
      <Experience
        variant={'top'}
        header={'Synchrony Financial / Emerging Technology Intern'}
        date={'January 2020 - Present'}
        body={"Currently working on a React Data Analytics platform built with AWS S3, Lambda, and EMR."}
      />

      <Experience
        variant={'right'}
        header={'HERE Technologies / Software Engineering Intern'}
        date={'July 2019 - August 2019'}
        body={'I returned to the Highly Automated Driving division and created a GraphQL API for serving Geospatial Data. Also worked on an Angular front-end app to accompany it.'}
      />

      <Experience
        variant={'left'}
        header={'University of Melbourne / Study Abroad'}
        date={'February 2019 - July 2019'}
        body={'Spent five months abroad in Melbourne Australia. Wish I was still there.'}
      />

      <Experience
        variant={'right'}
        header={'HERE Technologies / Software Engineering Intern'}
        date={'June 2018 - August 2018'}
        body={'Created a 3D Geospatial Visualization tool in JavaScript for R&D use.'}
      />
    </div>
  )
}

export default WorkExperiences
