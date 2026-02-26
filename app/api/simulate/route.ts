import { NextRequest, NextResponse } from 'next/server'
import { runSimulation, analyzeCorrelations } from '@/lib/kaggle-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { datasetId, percentage, scenario } = body

    if (!datasetId || percentage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: datasetId, percentage' },
        { status: 400 }
      )
    }

    // Run simulation with selected dataset
    const simulationResult = await runSimulation(datasetId, percentage, scenario || 'flood')

    // Analyze correlations
    const correlations = await analyzeCorrelations(simulationResult.originalData)

    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      correlations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const datasetId = searchParams.get('datasetId')
    const percentage = searchParams.get('percentage')
    const scenario = searchParams.get('scenario')

    if (!datasetId || !percentage) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const simulationResult = await runSimulation(
      datasetId,
      parseInt(percentage),
      scenario || 'flood'
    )

    const correlations = await analyzeCorrelations(simulationResult.originalData)

    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      correlations,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    )
  }
}
