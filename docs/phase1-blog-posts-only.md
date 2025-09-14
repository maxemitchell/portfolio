# Phase 1: Blog Posts Migration Only

## ✅ PHASE 1 COMPLETED SUCCESSFULLY
**Blog posts (writings) have been fully migrated from Contentful to static markdown files.**

## Updated Approach

### ✅ Confirmed Requirements
- **Rich Text**: Convert to standard markdown with support for:
  - Links, inline images, callouts
  - Bold, italics, code blocks
  - Standard markdown styling
- **Images**: Local storage (interim), eventually Cloudflare R2
- **Blog Images**: Store in same folder as the post
- **Folder Structure**: `content/writings/post-slug/index.md`

## ✅ COMPLETED Implementation Steps for Blog Posts

### ✅ Step 1: Set Up Basic Markdown System
1. ✅ Update `gatsby-config.js` to add content filesystem source
2. ✅ Create `content/writings/` folder structure
3. ✅ Test basic markdown processing

### ✅ Step 2: Create Rich Text Converter
1. ✅ Build Contentful Rich Text → Markdown converter
2. ✅ Handle all standard markdown elements:
   - **Bold**, *italic*, `code`
   - Links (external and internal)
   - Images (download and reference locally)
   - Lists, headings, blockquotes
   - Code blocks

### ✅ Step 3: Export and Transform Blog Posts
1. ✅ Create Contentful export script for writings
2. ✅ Download all associated images
3. ✅ Convert rich text to markdown
4. ✅ Generate frontmatter from Contentful fields

### ✅ Step 4: Update Blog Post Rendering
1. ✅ Create parallel GraphQL queries for markdown
2. ✅ Update writing template to work with markdown
3. ✅ Test side-by-side with Contentful

### ✅ Step 5: Switch Over Blog Posts
1. ✅ Update routing to use markdown
2. ✅ Remove Contentful blog post queries
3. ✅ Test all functionality

## Rich Text Conversion Examples

### Contentful Rich Text → Markdown

**Bold Text:**
```json
{"nodeType": "text", "value": "bold text", "marks": [{"type": "bold"}]}
```
→ `**bold text**`

**Links:**
```json
{
  "nodeType": "hyperlink",
  "data": {"uri": "https://example.com"},
  "content": [{"nodeType": "text", "value": "link text"}]
}
```
→ `[link text](https://example.com)`

**Internal Links:**
```json
{
  "nodeType": "entry-hyperlink", 
  "data": {"target": {"slug": "other-post"}},
  "content": [{"nodeType": "text", "value": "other post"}]
}
```
→ `[other post](../other-post/)`

**Embedded Images:**
```json
{
  "nodeType": "embedded-asset-block",
  "data": {"target": {"sys": {"id": "asset-id"}}}
}
```
→ `![Alt text](./images/filename.jpg)`

**Code Blocks:**
```json
{
  "nodeType": "code-block",
  "content": [{"nodeType": "text", "value": "console.log('hello')"}]
}
```
→ 
````markdown
```
console.log('hello')
```
````

## File Structure Result

After migration, blog posts will look like:

```
content/
└── writings/
    ├── my-first-post/
    │   ├── index.md
    │   └── images/
    │       ├── hero-image.jpg
    │       └── inline-image.png
    └── another-post/
        ├── index.md
        └── images/
            └── diagram.jpg
```

**Example `index.md`:**
```markdown
---
title: "My First Blog Post"
slug: "my-first-post"
writingDate: "2023-10-27"
metadata: "Some metadata"
type: "writing"
---

# My First Blog Post

This is **bold text** and this is *italic text*.

Here's a [link to another post](../another-post/) and an [external link](https://example.com).

![Hero image](./images/hero-image.jpg)

## Code Example

```javascript
console.log('Hello world!');
```

> This is a callout/blockquote

- List item 1
- List item 2
```

## ✅ MIGRATION COMPLETED

The blog post migration has been successfully completed. All Phase 1 objectives have been achieved:

- Blog posts are now served from static markdown files
- Rich text content has been converted to standard markdown
- All images have been downloaded and stored locally
- Blog post routing and templates have been updated
- Contentful dependencies for blog posts have been removed

The site is now ready for potential future migrations of artboards and photo collections if needed.
