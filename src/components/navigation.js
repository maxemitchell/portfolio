import React from 'react'
import { Link } from 'gatsby'

export default () => (
  <nav role="navigation">
    <ul className="">
      <li className="">
        <Link to="/">home</Link>
      </li>
      <li className="">
        <Link to="/about">about max</Link>
      </li>
    </ul>
    <hr />
  </nav>
)
