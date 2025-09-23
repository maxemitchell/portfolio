#!/usr/bin/env node

import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import https from 'https'
import sharp from 'sharp'
import yaml from 'js-yaml'
import dotenv from 'dotenv'

dotenv.config()

const CDN_BASE_URL = process.env.GATSBY_CDN_BASE_URL
const CONCURRENCY_LIMIT = 3
const MAX_CONSECUTIVE_FAILURES = 5
const MAX_IMAGE_NUMBER = 200
const DEFAULT_ASPECT_RATIO = 1.333
const DEFAULT_DOMINANT_COLOR = '#f0f0f0'
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/


function parseMarkdownFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX)
  if (!match) throw new Error('Invalid markdown format')
  
  const [, frontmatterYaml, body] = match
  const frontmatter = yaml.load(frontmatterYaml)
  return { frontmatter, body }
}

function stringifyMarkdownWithFrontmatter(frontmatter, body) {
  const yamlString = yaml.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"'
  })
  
  return `---\n${yamlString}---\n${body}`
}

async function getImageMetadata(imagePath) {
  const imageUrl = `${CDN_BASE_URL}/${imagePath}`
  
  return new Promise((resolve, reject) => {
    const request = https.get(imageUrl, async (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`))
        return
      }

      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks)
          const image = sharp(buffer)
          const metadata = await image.metadata()
       
          const { data } = await image.resize(1, 1).raw().toBuffer({ resolveWithObject: true })
          const r = data[0]
          const g = data[1] || data[0]
          const b = data[2] || data[0]
          const dominantColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          
          resolve({
            width: metadata.width,
            height: metadata.height,
            aspectRatio: Math.round((metadata.width / metadata.height) * 1000) / 1000,
            dominantColor,
            format: metadata.format
          })
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on('error', reject)
    request.setTimeout(30000, () => request.destroy())
  })
}

async function getPhotoCollectionImages(slug, r2FolderName) {
  const folderName = r2FolderName || slug
  const images = []
  let imageNumber = 1
  let consecutiveFailures = 0
  
  while (consecutiveFailures < MAX_CONSECUTIVE_FAILURES && imageNumber <= MAX_IMAGE_NUMBER) {
    try {
      await getImageMetadata(`photo_collections/${folderName}/${imageNumber}.jpg`)
      images.push({ name: imageNumber.toString() })
      consecutiveFailures = 0
    } catch {
      consecutiveFailures++
    }
    imageNumber++
  }
  
  return images
}

async function processPhotoCollection(collectionPath) {
  const indexPath = path.join(collectionPath, 'index.md')
  
  if (!fsSync.existsSync(indexPath)) {
    console.log(`⚠️  No index.md found in ${path.basename(collectionPath)}`)
    return
  }

  console.log(`📸 Processing: ${path.basename(collectionPath)}`)
  
  try {
    const content = await fs.readFile(indexPath, 'utf8')
    const { frontmatter, body } = parseMarkdownFrontmatter(content)
    
    if (!frontmatter.slug) {
      console.error(`  ❌ No slug found in frontmatter`)
      return
    }

    let images = frontmatter.images
    const hasExistingMetadata = Array.isArray(images) && images.length > 0 &&
      images.every(img => img && typeof img.aspectRatio !== 'undefined' && typeof img.dominantColor !== 'undefined')

    if (hasExistingMetadata) {
      console.log(`  ✅ Metadata already exists, skipping...`)
      return
    }

    images = await getPhotoCollectionImages(frontmatter.slug, frontmatter.r2FolderName)
    const folderName = frontmatter.r2FolderName || frontmatter.slug
    if (!images.length) {
      console.error(`  ❌ No images found for collection ${folderName}`)
      return
    }
    console.log(`  📊 Detected ${images.length} images`)
    
    const processedImages = await processImagesWithConcurrency(images, folderName)
    processedImages.sort((a, b) => parseInt(a.name) - parseInt(b.name))

    const featuredImageMetadata = frontmatter.featuredImage ? 
      processedImages.find(img => parseInt(img.name) === frontmatter.featuredImage) : null

    const updatedFrontmatter = {
      ...frontmatter,
      images: processedImages,
      featuredImageMetadata: featuredImageMetadata ? {
        aspectRatio: featuredImageMetadata.aspectRatio,
        dominantColor: featuredImageMetadata.dominantColor
      } : null
    }

    delete updatedFrontmatter.imageCount

    const newContent = stringifyMarkdownWithFrontmatter(updatedFrontmatter, body)
    await fs.writeFile(indexPath, newContent)
    
    console.log(`  ✅ Updated frontmatter with ${processedImages.length} images`)
  } catch (error) {
    console.error(`  ❌ Failed to process collection:`, error.message)
  }
}

async function processImagesWithConcurrency(images, folderName) {
  const processedImages = []
  
  for (let i = 0; i < images.length; i += CONCURRENCY_LIMIT) {
    const batch = []
    
    for (let j = 0; j < CONCURRENCY_LIMIT && i + j < images.length; j++) {
      const imageIndex = i + j
      const imageInfo = images[imageIndex]
      const imageName = imageInfo.name || (imageIndex + 1).toString()
      
      batch.push(
        processSingleImage(folderName, imageName, imageIndex + 1, images.length)
      )
    }

    const batchResults = await Promise.all(batch)
    processedImages.push(...batchResults)
  }

  return processedImages
}

async function processSingleImage(folderName, imageName, currentIndex, totalImages) {
  try {
    console.log(`  📥 Analyzing image ${imageName} (${currentIndex}/${totalImages})...`)
    const metadata = await getImageMetadata(`photo_collections/${folderName}/${imageName}.jpg`)
    
    return {
      name: imageName,
      aspectRatio: metadata.aspectRatio,
      dominantColor: metadata.dominantColor
    }
  } catch {
    console.error(`  ❌ Failed to process image ${imageName}`)
    return {
      name: imageName,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      dominantColor: DEFAULT_DOMINANT_COLOR
    }
  }
}

async function processArtboard(artboardPath) {
  const indexPath = path.join(artboardPath, 'index.md')
  
  if (!fsSync.existsSync(indexPath)) {
    console.log(`⚠️  No index.md found in ${path.basename(artboardPath)}`)
    return
  }

  console.log(`🎨 Processing: ${path.basename(artboardPath)}`)
  
  try {
    const content = await fs.readFile(indexPath, 'utf8')
    const { frontmatter, body } = parseMarkdownFrontmatter(content)

    if (!frontmatter.artboard) {
      console.error(`  ❌ No artboard image path found in frontmatter`)
      return
    }

    if (frontmatter.artboardMetadata && frontmatter.artboardMetadata.aspectRatio && frontmatter.artboardMetadata.dominantColor) {
      console.log(`  ✅ Metadata already exists, skipping...`)
      return
    }

    console.log(`  📊 Processing artboard image: ${frontmatter.artboard}`)
    console.log(`  📥 Analyzing artboard image...`)
    
    const metadata = await getImageMetadata(frontmatter.artboard)
    
    const updatedFrontmatter = {
      ...frontmatter,
      artboardMetadata: {
        aspectRatio: metadata.aspectRatio,
        dominantColor: metadata.dominantColor,
        width: metadata.width,
        height: metadata.height
      }
    }
    
    const newContent = stringifyMarkdownWithFrontmatter(updatedFrontmatter, body)
    await fs.writeFile(indexPath, newContent)
    
    console.log(`  ✅ Updated artboard with metadata`)
    
  } catch (error) {
    console.error(`  ❌ Failed to process artboard:`, error.message)
  }
}

async function generateUnifiedMetadata() {
  console.log('🚀 Generating unified image metadata...\n')

  await processPhotoCollections()
  await processArtboards()
}

async function processPhotoCollections() {
  const photoCollectionsDir = 'content/photo_collections'
  
  if (!fsSync.existsSync(photoCollectionsDir)) {
    console.log('📁 No photo collections directory found')
    return
  }

  const collections = fsSync.readdirSync(photoCollectionsDir).filter(item => {
    const itemPath = path.join(photoCollectionsDir, item)
    return fsSync.statSync(itemPath).isDirectory()
  })

  console.log(`📁 Found ${collections.length} photo collections\n`)

  for (const collection of collections) {
    const collectionPath = path.join(photoCollectionsDir, collection)
    await processPhotoCollection(collectionPath)
    console.log()
  }
}

async function processArtboards() {
  const artboardsDir = 'content/artboards'
  
  if (!fsSync.existsSync(artboardsDir)) {
    console.log('🎨 No artboards directory found')
    return
  }

  const artboards = fsSync.readdirSync(artboardsDir).filter(item => {
    const itemPath = path.join(artboardsDir, item)
    return fsSync.statSync(itemPath).isDirectory()
  })

  console.log(`🎨 Found ${artboards.length} artboards\n`)

  for (const artboard of artboards) {
    const artboardPath = path.join(artboardsDir, artboard)
    await processArtboard(artboardPath)
    console.log()
  }
}

generateUnifiedMetadata()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
