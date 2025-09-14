#!/usr/bin/env node

/**
 * Export all artboards from Contentful for migration to markdown
 */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const fs = require('fs')
const path = require('path')
const https = require('https')
const contentful = require('contentful')

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error('❌ Missing Contentful credentials. Check your .env file.')
  process.exit(1)
}

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const OUTPUT_DIR = path.join(__dirname, 'content', 'artboards')

/**
 * Download image from URL to local file
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)

    https.get(url, (response) => {
      response.pipe(file)

      file.on('finish', () => {
        file.close()
        console.log(`  ✅ Downloaded: ${path.basename(filepath)}`)
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete partial file
      reject(err)
    })
  })
}

/**
 * Create markdown file for an artboard entry
 */
async function createArtboardMarkdown(entry, artboardDir) {
  const { title, slug, artboardDate, metadata, artboard, description } = entry.fields

  console.log(`🎨 Processing: ${title}`)

  // Create artboard directory
  if (!fs.existsSync(artboardDir)) {
    fs.mkdirSync(artboardDir, { recursive: true })
  }

  let artboardFilename = ''

  // Download artboard image if it exists
  if (artboard && artboard.fields) {
    const file = artboard.fields.file
    const imageUrl = `https:${file.url}`
    const extension = path.extname(file.fileName) || '.jpg'
    artboardFilename = `artboard${extension}`
    const filepath = path.join(artboardDir, artboardFilename)

    try {
      await downloadImage(imageUrl, filepath)
    } catch (error) {
      console.error(`  ❌ Failed to download artboard image:`, error.message)
    }
  }

  // Convert description from Contentful markdown to plain markdown
  let markdownContent = ''
  if (description) {
    // Contentful stores this as a markdown string, not rich text
    markdownContent = description
  }

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
slug: "${slug}"
artboardDate: "${artboardDate}"
${metadata ? `metadata: "${metadata}"` : ''}
type: "artboard"
${artboardFilename ? `artboard: "./${artboardFilename}"` : ''}
---

${markdownContent}
`

  // Write markdown file
  const markdownFile = path.join(artboardDir, 'index.md')
  fs.writeFileSync(markdownFile, frontmatter, 'utf8')
  console.log(`  ✅ Created: ${markdownFile}`)
}

/**
 * Export all artboards
 */
async function exportArtboards() {
  console.log('🚀 Starting Contentful artboards export...\n')

  try {
    // Fetch all artboards from Contentful
    const response = await client.getEntries({
      content_type: 'artboard', // Adjust if your content type ID is different
      include: 10, // Include referenced assets
    })

    console.log(`🎨 Found ${response.items.length} artboards to export\n`)

    // Process each artboard
    for (const entry of response.items) {
      const slug = entry.fields.slug
      const artboardDir = path.join(OUTPUT_DIR, slug)

      await createArtboardMarkdown(entry, artboardDir)
      console.log() // Empty line for readability
    }

    console.log('🎉 Artboards export completed successfully!')
    console.log(`\n📁 Files created in: ${OUTPUT_DIR}`)
    console.log('\n📋 Next steps:')
    console.log('1. Review the generated markdown files')
    console.log('2. Update artboard template to use markdown data')
    console.log('3. Update homepage and photos page queries')
    console.log('4. Test the new artboard pages')

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run the export
if (require.main === module) {
  exportArtboards()
}

module.exports = { exportArtboards }
