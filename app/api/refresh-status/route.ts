import { NextResponse } from 'next/server'
import { getRefreshStatus } from '@/lib/scheduler/refresh-state'

export async function GET() {
  return NextResponse.json(getRefreshStatus())
}
