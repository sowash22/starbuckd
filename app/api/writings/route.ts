// app/api/writings/route.ts
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const writings = getAllPosts()
  return NextResponse.json(writings)
}
