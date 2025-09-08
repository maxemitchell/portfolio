#!/usr/bin/env node

/**
 * Export Contentful data to local files
 * Run: node scripts/export-contentful.js
 */

const contentful = require('contentful')
const fs = require('fs')
const path = require('path')

require('dotenv').config()

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const OUTPUT_DIR = path.join(__dirname, '../content')

// Utility functions
const slugify = (text) => 
  text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const extractImageUrl = (asset) => {
  return asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null
}

// Export writings as markdown
async function exportWritings() {
  console.log('Exporting writings...')
  
  const entries = await client.getEntries({
    content_type: 'writing',
    order: '-sys.createdAt',
    limit: 100
  })

  for (const entry of entries.items) {
    const { title, body, writingDate, metadata } = entry.fields
    const slug = entry.fields.slug || slugify(title)
    
    // Convert rich text to markdown (simplified)
    const markdownContent = convertRichTextToMarkdown(body)
    
    const frontmatter = `---
title: "${title}"
date: "${formatDate(writingDate)}"
slug: "${slug}"
preview: "${markdownContent.split('\\n')[0].substring(0, 150)}..."
metadata: ${JSON.stringify(metadata || {}, null, 2)}
---

${markdownContent}`

    const filename = `${formatDate(writingDate)}-${slug}.md`
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'writings', filename),
      frontmatter
    )
  }
  
  console.log(`Exported ${entries.items.length} writings`)
}

// Export artboards as JSON
async function exportArtboards() {
  console.log('Exporting artboards...')
  
  const entries = await client.getEntries({
    content_type: 'artboard',
    order: '-sys.createdAt',
    limit: 100
  })

  for (const entry of entries.items) {
    const { title, description, artboardDate, image } = entry.fields
    const slug = entry.fields.slug || slugify(title)
    
    const artboard = {
      id: entry.sys.id,
      title,
      description: description || '',
      date: formatDate(artboardDate),
      slug,
      images: {
        main: extractImageUrl(image),
        thumbnail: extractImageUrl(image) // Will be replaced with R2 URLs
      },
      metadata: {
        contentfulId: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt
      }
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'artboards', `${slug}.json`),
      JSON.stringify(artboard, null, 2)
    )
  }
  
  console.log(`Exported ${entries.items.length} artboards`)
}

// Export photo collections as JSON
async function exportPhotoCollections() {
  console.log('Exporting photo collections...')
  
  const entries = await client.getEntries({
    content_type: 'photoCollection',
    order: '-sys.createdAt',
    limit: 100
  })

  for (const entry of entries.items) {
    const { title, description, photoCollectionDate, images } = entry.fields
    const slug = entry.fields.slug || slugify(title)
    
    const collection = {
      id: entry.sys.id,
      title,
      description: description || '',
      date: formatDate(photoCollectionDate),
      slug,
      coverImage: images && images.length > 0 ? extractImageUrl(images[0]) : null,
      images: (images || []).map((image, index) => ({
        url: extractImageUrl(image),
        alt: image.fields?.description || `Image ${index + 1}`,
        caption: image.fields?.title || ''
      })),
      metadata: {
        contentfulId: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt
      }
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'photo-collections', `${slug}.json`),
      JSON.stringify(collection, null, 2)
    )
  }
  
  console.log(`Exported ${entries.items.length} photo collections`)
}

// Export site data
async function exportSiteData() {
  console.log('Exporting site data...')
  
  const entries = await client.getEntries({
    content_type: 'siteData',
    limit: 10
  })

  for (const entry of entries.items) {
    const siteData = {
      id: entry.sys.id,
      ...entry.fields,
      metadata: {
        contentfulId: entry.sys.id,
        createdAt: entry.sys.createdAt,
        updatedAt: entry.sys.updatedAt
      }
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'site', `${entry.fields.title || 'site-data'}.json`),
      JSON.stringify(siteData, null, 2)
    )
  }
  
  console.log(`Exported ${entries.items.length} site data entries`)
}

// Simple rich text to markdown converter
function convertRichTextToMarkdown(richText) {
  if (!richText || !richText.content) return ''
  
  return richText.content.map(node => {
    switch (node.nodeType) {
      case 'paragraph':
        return node.content.map(c => c.value || '').join('') + '\\n\\n'
      case 'heading-3':
        return '### ' + node.content.map(c => c.value || '').join('') + '\\n\\n'
      case 'unordered-list':
        return node.content.map(li => 
          '- ' + li.content.map(p => p.content.map(c => c.value || '').join('')).join('\\n')
        ).join('\\n') + '\\n\\n'
      case 'embedded-asset-block':
        return `![Image](contentful-asset-${node.data.target.sys.id})\\n\\n`
      default:
        return ''
    }
  }).join('')
}

// Create image mapping file
async function createImageMapping() {
  console.log('Creating image mapping...')
  
  const assets = await client.getAssets({ limit: 1000 })
  
  const imageMapping = {}
  for (const asset of assets.items) {
    if (asset.fields.file && asset.fields.file.url) {
      imageMapping[asset.sys.id] = {
        contentfulUrl: `https:${asset.fields.file.url}`,
        filename: asset.fields.file.fileName,
        title: asset.fields.title || '',
        description: asset.fields.description || '',
        // R2 URL will be populated during image migration
        r2Url: null
      }
    }
  }
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'images', 'r2-urls.json'),
    JSON.stringify(imageMapping, null, 2)
  )
  
  console.log(`Created mapping for ${assets.items.length} images`)
}

// Main export function
async function exportAll() {
  try {
    // Ensure directories exist
    const dirs = ['writings', 'artboards', 'photo-collections', 'site', 'images']
    dirs.forEach(dir => {
      const dirPath = path.join(OUTPUT_DIR, dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    })

    await exportWritings()
    await exportArtboards() 
    await exportPhotoCollections()
    await exportSiteData()
    await createImageMapping()
    
    console.log('\\n✅ Export completed successfully!')
    console.log(`Content exported to: ${OUTPUT_DIR}`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  }
}

// Run export
exportAll()
