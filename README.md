# portfolio
[![Netlify Status](https://api.netlify.com/api/v1/badges/97b2c704-59a3-4cda-b2db-39e77ec53634/deploy-status)](https://app.netlify.com/sites/maxemitchell/deploys) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/c45d994aba1f49bb841e9e6d0a2486d7)](https://www.codacy.com/manual/maxemitchell/portfolio?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxemitchell/portfolio&amp;utm_campaign=Badge_Grade)

A personal portfolio website for my projects and photography. You can check it out [here.](https://www.maxemitchell.com)

The front end was created using [Gatsby](https://www.gatsbyjs.org/) and [TailwindCSS](https://tailwindcss.com/). Content is managed with static markdown files in the `content/` folder, and images are hosted on [Cloudflare R2](https://developers.cloudflare.com/r2/) with a Worker CDN for optimized delivery. The site itself is hosted on [Netlify](https://www.netlify.com/).

## Resources Used
-   [Ryan Wiemer's gatsby-starter-gcn](https://github.com/ryanwiemer/gatsby-starter-gcn)
-   [iammatthias's personal photography page](https://github.com/iammatthias/.com)
-   Way too much Google searching

## Development Instructions
1.  Clone the repo.
2.  Install yarn (or npm) if you don't already have it.
3.  In the top level directory, run `yarn install`
4.  Look at the `.env.example` file, and create local `.env.production` and `.env.development` files with your API Keys.
5.  Generate image metadata for lazy loading: `node scripts/generate-image-metadata.js`
    - This script processes images in `content/photo_collections/` and `content/artboards/`
    - Extracts dominant colors for smooth lazy loading placeholders
    - Updates markdown frontmatter with aspect ratios and metadata
6.  To run locally, run `yarn dev`
7.  To test the production version, run `yarn build` followed by `yarn serve`

## Future Development
-   Add a light mode and ability to toggle between
-   Add a blog page
-   Continue to mess with styling
-   Add more photo collections and videos

### General Notes
I made this site for the purpose of both learning a modern front-end stack and to be able to say I built my own personal site from scratch. This gave me the freedom of creating something actually unique, and the end result was far more performant than many bootstrap style websites, especially for the resolution of my pictures. This will also be constantly changing and evolving, but for now I'm happy with where it's at.
