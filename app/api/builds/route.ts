// app/api/builds/route.ts
import { NextResponse } from 'next/server'
import { getBuilds } from '@/lib/builds'

export async function GET() {
  const builds = await getBuilds() // getBuilds is async
  return NextResponse.json(builds)
}
