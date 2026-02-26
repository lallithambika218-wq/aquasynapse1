import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')

    if (!supabase) {
      return NextResponse.json({ id: '1', state: state || 'Bihar', temperature: 32, humidity: 75, wind_speed: 20, rainfall: 45, alert_level: 'medium', created_at: new Date().toISOString() })
    }

    if (state) {
      // Get weather data for specific state
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('state', state)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Get all weather data
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .order('state', { ascending: true })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }
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
    const { state, temperature, humidity, wind_speed, rainfall, alert_level } = body

    if (!state || temperature === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('weather_data')
      .insert([
        {
          state,
          temperature,
          humidity,
          wind_speed,
          rainfall,
          alert_level,
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
