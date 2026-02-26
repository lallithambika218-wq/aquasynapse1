import { NextRequest, NextResponse } from 'next/server'
import { getAvailableDatasets, fetchDataset } from '@/lib/kaggle-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const datasetId = searchParams.get('datasetId')

    if (action === 'fetch' && datasetId) {
      // Fetch specific dataset
      const data = await fetchDataset(datasetId)
      return NextResponse.json({
        success: true,
        datasetId,
        data,
        rowCount: data.length,
        timestamp: new Date().toISOString(),
      })
    } else {
      // List available datasets
      const datasets = await getAvailableDatasets()
      return NextResponse.json({
        success: true,
        datasets,
        count: datasets.length,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Dataset error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, datasetId } = body

    if (action === 'fetch' && datasetId) {
      const data = await fetchDataset(datasetId)
      return NextResponse.json({
        success: true,
        datasetId,
        data,
        rowCount: data.length,
        timestamp: new Date().toISOString(),
      })
    }

    const datasets = await getAvailableDatasets()
    return NextResponse.json({
      success: true,
      datasets,
      count: datasets.length,
    })
  } catch (error) {
    console.error('Dataset error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
