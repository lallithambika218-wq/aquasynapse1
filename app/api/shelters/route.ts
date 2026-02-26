import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json([{ id: '1', name: 'Sample Shelter', location: 'Demo Location', state: 'Bihar', capacity: 500, current_occupancy: 250, status: 'operational', coordinates: { lat: 25.5, lng: 85.1 }, created_at: new Date().toISOString() }])
    }
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const status = searchParams.get('status')

    let query = supabase.from('shelters').select('*')

    if (state) {
      query = query.eq('state', state)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      location,
      state,
      capacity,
      current_occupancy,
      status,
      coordinates,
    } = body

    if (!name || !location || !state || !capacity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('shelters')
      .insert([
        {
          name,
          location,
          state,
          capacity,
          current_occupancy: current_occupancy || 0,
          status: status || 'operational',
          coordinates,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
