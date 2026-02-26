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
      return NextResponse.json({ id: '1', state: state || 'Bihar', risk_score: 65, risk_level: 'high', confidence_level: 0.85, analysis_text: 'Demo analysis', created_at: new Date().toISOString() })
    }

    if (state) {
      // Get risk assessment for specific state
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('state', state)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Get all risk assessments
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('risk_score', { ascending: false })

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
    const {
      state,
      risk_score,
      risk_level,
      confidence_level,
      analysis_text,
      created_by,
    } = body

    if (!state || risk_score === undefined || !risk_level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('risk_assessments')
      .insert([
        {
          state,
          risk_score,
          risk_level,
          confidence_level: confidence_level || 0,
          analysis_text,
          created_by,
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
