#!/usr/bin/env node

/**
 * Export all writings from Contentful for migration to markdown
 */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const fs = require('fs')
const path = require('path')
const https = require('https')
const { documentToPlainTextString } = require('@contentful/rich-text-plain-text-renderer')

// Contentful Management API (we'll use this to get full data)
const contentful = require('contentful')

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error('❌ Missing Contentful credentials. Check your .env file.')
  process.exit(1)
}

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'writings')
const IMAGES_DIR = 'images'

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
 * Convert Contentful Rich Text to Markdown
 */
function richTextToMarkdown(richText) {
  if (!richText || !richText.content) {
    return ''
  }

  let markdown = ''

  function processNode(node) {
    switch (node.nodeType) {
      case 'document':
        return node.content.map(processNode).join('\n\n')
      
      case 'paragraph':
        if (!node.content || node.content.length === 0) {
          return ''
        }
        // Check if paragraph is empty (just whitespace)
        const paragraphText = node.content.map(processNode).join('')
        if (paragraphText.trim() === '') {
          return ''
        }
        return paragraphText

      case 'heading-1':
        return `# ${node.content.map(processNode).join('')}`
      
      case 'heading-2':
        return `## ${node.content.map(processNode).join('')}`
      
      case 'heading-3':
        return `### ${node.content.map(processNode).join('')}`
      
      case 'heading-4':
        return `#### ${node.content.map(processNode).join('')}`
      
      case 'heading-5':
        return `##### ${node.content.map(processNode).join('')}`
      
      case 'heading-6':
        return `###### ${node.content.map(processNode).join('')}`

      case 'unordered-list':
        return node.content.map(item => `- ${processNode(item)}`).join('\n')
      
      case 'ordered-list':
        return node.content.map((item, index) => `${index + 1}. ${processNode(item)}`).join('\n')
      
      case 'list-item':
        return node.content.map(processNode).join('')

      case 'blockquote':
        const quote = node.content.map(processNode).join('\n')
        return quote.split('\n').map(line => `> ${line}`).join('\n')

      case 'hr':
        return '---'

      case 'code-block':
        const code = node.content.map(processNode).join('')
        return `\`\`\`\n${code}\n\`\`\``

      case 'table':
        const rows = node.content.map(processNode)
        if (rows.length === 0) return ''
        
        // Check if first row is header row
        const hasHeader = node.content[0] && node.content[0].content && 
                         node.content[0].content.some(cell => cell.nodeType === 'table-header-cell')
        
        if (hasHeader && rows.length > 1) {
          // Add header separator after first row
          const headerRow = rows[0]
          const separatorRow = headerRow.split('|').map(() => '---').join('|')
          return [headerRow, separatorRow, ...rows.slice(1)].join('\n')
        }
        
        return rows.join('\n')

      case 'table-row':
        const cells = node.content.map(processNode)
        return `| ${cells.join(' | ')} |`

      case 'table-header-cell':
      case 'table-cell':
        return node.content.map(processNode).join('').trim()

      case 'embedded-asset-block':
        // Handle embedded assets
        if (node.data && node.data.target && node.data.target.sys) {
          const assetId = node.data.target.sys.id
          const assetTitle = node.data.target.fields?.title || 'Image'
          
          // Get file extension from the asset data if available
          let extension = '.jpg'
          if (node.data.target.fields?.file?.fileName) {
            const fileName = node.data.target.fields.file.fileName
            extension = path.extname(fileName) || '.jpg'
          }
          
          return `![${assetTitle}](./images/${assetId}${extension})`
        }
        return ''

      case 'hyperlink':
        const linkText = node.content.map(processNode).join('')
        return `[${linkText}](${node.data.uri})`

      case 'entry-hyperlink':
        const entryText = node.content.map(processNode).join('')
        if (node.data && node.data.target && node.data.target.slug) {
          return `[${entryText}](../${node.data.target.slug}/)`
        }
        return entryText

      case 'text':
        let text = node.value || ''
        
        // Apply marks (formatting) - be more careful about empty text
        if (node.marks && text.trim() !== '') {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'bold':
                text = `**${text}**`
                break
              case 'italic':
                text = `*${text}*`
                break
              case 'underline':
                text = `<u>${text}</u>`
                break
              case 'code':
                text = `\`${text}\``
                break
            }
          })
        }
        
        return text

      default:
        console.warn(`  ⚠️  Unknown node type: ${node.nodeType}`)
        return node.content ? node.content.map(processNode).join('') : ''
    }
  }

  return processNode(richText)
}

/**
 * Create markdown file for a writing entry
 */
async function createMarkdownFile(entry, postDir) {
  const { title, slug, writingDate, metadata, body } = entry.fields
  
  console.log(`📝 Processing: ${title}`)
  
  // Create post directory
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true })
  }

  // Create images directory
  const imagesDir = path.join(postDir, IMAGES_DIR)
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  // Convert rich text to markdown
  let markdownContent = ''
  if (body) {
    markdownContent = richTextToMarkdown(body)
    
    // Find and download embedded assets
    const assetsToDownload = []
    
    function findEmbeddedAssets(node) {
      if (node.nodeType === 'embedded-asset-block' && node.data && node.data.target) {
        assetsToDownload.push(node.data.target)
      }
      
      if (node.content) {
        node.content.forEach(findEmbeddedAssets)
      }
    }
    
    findEmbeddedAssets(body)
    
    // Download found assets
    for (const asset of assetsToDownload) {
      if (asset.fields && asset.fields.file) {
        const assetId = asset.sys.id
        const file = asset.fields.file
        const imageUrl = `https:${file.url}`
        const extension = path.extname(file.fileName) || '.jpg'
        const filename = `${assetId}${extension}`
        const filepath = path.join(imagesDir, filename)
        
        try {
          await downloadImage(imageUrl, filepath)
        } catch (error) {
          console.error(`  ❌ Failed to download ${filename}:`, error.message)
        }
      }
    }
  }

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
slug: "${slug}"
writingDate: "${writingDate}"
${metadata ? `metadata: "${metadata}"` : ''}
type: "writing"
---

`

  // Write markdown file
  const markdownFile = path.join(postDir, 'index.md')
  const fullContent = frontmatter + markdownContent
  
  fs.writeFileSync(markdownFile, fullContent, 'utf8')
  console.log(`  ✅ Created: ${markdownFile}`)
}

/**
 * Main export function
 */
async function exportWritings() {
  console.log('🚀 Starting Contentful writings export...\n')

  try {
    // Fetch all writings from Contentful
    const response = await client.getEntries({
      content_type: 'writing', // Adjust if your content type ID is different
      include: 10, // Include referenced assets
    })

    console.log(`📚 Found ${response.items.length} writings to export\n`)

    // Process each writing
    for (const entry of response.items) {
      const slug = entry.fields.slug
      const postDir = path.join(OUTPUT_DIR, slug)
      
      await createMarkdownFile(entry, postDir)
      console.log() // Empty line for readability
    }

    console.log('🎉 Export completed successfully!')
    console.log(`\n📁 Files created in: ${OUTPUT_DIR}`)
    console.log('\n📋 Next steps:')
    console.log('1. Review the generated markdown files')
    console.log('2. Test the new queries in GraphiQL')
    console.log('3. Update your templates to use markdown data')

  } catch (error) {
    console.error('❌ Export failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run the export
if (require.main === module) {
  exportWritings()
}

module.exports = { exportWritings, richTextToMarkdown }
