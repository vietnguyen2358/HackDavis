import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetUrl, data } = body
    
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      )
    }
    
    console.log('Proxying request to:', targetUrl)
    console.log('Request data:', data)
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const responseData = await response.json()
    console.log('Proxy response:', responseData)
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error in proxy:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    )
  }
} 