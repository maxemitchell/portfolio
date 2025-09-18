#!/usr/bin/env node

/**
 * Generate image metadata for CDN images to prevent layout shift
 * Extracts dimensions and dominant colors for proper placeholders
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const sharp = require('sharp')

const CDN_BASE_URL = process.env.GATSBY_CDN_BASE_URL || 'https://your-cdn-url.com'

/**
 * Download image and extract metadata
 */
async function getImageMetadata(imagePath) {
  const imageUrl = `${CDN_BASE_URL}${imagePath}`
  
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks = []
      
      response.on('data', (chunk) => {
        chunks.push(chunk)
      })
      
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks)
          const image = sharp(buffer)
          const metadata = await image.metadata()
          
          // Get dominant color
          const stats = await image.stats()
          const dominantChannel = stats.channels[0] // Use first channel for simplicity
          const dominantColor = `rgb(${Math.round(dominantChannel.mean)}, ${Math.round(dominantChannel.mean)}, ${Math.round(dominantChannel.mean)})`
          
          resolve({
            width: metadata.width,
            height: metadata.height,
            aspectRatio: metadata.width / metadata.height,
            dominantColor,
            format: metadata.format
          })
        } catch (error) {
          reject(error)
        }
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * Process a photo collection and generate metadata
 */
async function processPhotoCollection(collectionPath) {
  const indexPath = path.join(collectionPath, 'index.md')
  if (!fs.existsSync(indexPath)) return

  console.log(`📸 Processing: ${path.basename(collectionPath)}`)
  
  // Read the markdown file
  const content = fs.readFileSync(indexPath, 'utf8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return

  // Parse frontmatter
  const frontmatterLines = frontmatterMatch[1].split('\n')
  const frontmatter = {}
  frontmatterLines.forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/"/g, '')
      frontmatter[key.trim()] = isNaN(value) ? value : parseInt(value)
    }
  })

  const { slug, imageCount } = frontmatter
  if (!slug || !imageCount) return

  const imageMetadata = []
  
  // Process each image
  for (let i = 1; i <= imageCount; i++) {
    try {
      console.log(`  📥 Analyzing image ${i}/${imageCount}...`)
      const imagePath = `/photo_collections/${slug}/${i}.jpg`
      const metadata = await getImageMetadata(imagePath)
      imageMetadata.push({
        number: i,
        ...metadata
      })
    } catch (error) {
      console.error(`  ❌ Failed to process image ${i}:`, error.message)
      // Add placeholder metadata
      imageMetadata.push({
        number: i,
        width: 800,
        height: 600,
        aspectRatio: 4/3,
        dominantColor: '#000000',
        format: 'jpeg'
      })
    }
  }

  // Save metadata
  const metadataPath = path.join(collectionPath, 'images.json')
  fs.writeFileSync(metadataPath, JSON.stringify(imageMetadata, null, 2))
  console.log(`  ✅ Saved metadata: ${imageMetadata.length} images`)
}

/**
 * Process all photo collections
 */
async function generateImageMetadata() {
  console.log('🚀 Generating image metadata...\n')

  const photoCollectionsDir = path.join(__dirname, '..', 'content', 'photo-collections')
  
  if (!fs.existsSync(photoCollectionsDir)) {
    console.error('❌ Photo collections directory not found:', photoCollectionsDir)
    process.exit(1)
  }

  const collections = fs.readdirSync(photoCollectionsDir).filter(item => {
    const itemPath = path.join(photoCollectionsDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  console.log(`📁 Found ${collections.length} photo collections\n`)

  for (const collection of collections) {
    const collectionPath = path.join(photoCollectionsDir, collection)
    await processPhotoCollection(collectionPath)
    console.log() // Empty line for readability
  }

  console.log('🎉 Image metadata generation completed!')
  console.log('\n📋 Next steps:')
  console.log('1. Update CDNImage component to use the generated metadata')
  console.log('2. Add this script to your build process')
}

// Run the script
if (require.main === module) {
  generateImageMetadata().catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
}

module.exports = { generateImageMetadata }
