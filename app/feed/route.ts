import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ashokmarannan.com'

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ashok Marannan</title>
    <link>${siteUrl}</link>
    <description>Curious about everything. Thoughts on engineering, AI, and building things.</description>
    <language>en-us</language>
    <managingEditor>ashok@example.com (Ashok Marannan)</managingEditor>
    <webMaster>ashok@example.com (Ashok Marannan)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${siteUrl}/writings/${post.slug}</link>
      <description>${escapeXml(post.frontmatter.summary)}</description>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/writings/${post.slug}</guid>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
