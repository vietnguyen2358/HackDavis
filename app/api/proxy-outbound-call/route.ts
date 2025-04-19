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
    
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      console.log('Fetch response status:', response.status)
      
      // If the response is not ok, handle it as an error with detailed information
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API responded with an error:', response.status, errorText)
        
        return NextResponse.json(
          { error: `API responded with status ${response.status}: ${errorText}` },
          { status: response.status }
        )
      }
      
      // For successful responses, try to parse JSON
      let responseData
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        // If not JSON, get the text response
        const textResponse = await response.text()
        responseData = { message: textResponse }
      }
      
      console.log('Proxy response:', responseData)
      return NextResponse.json(responseData)
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: `Failed to connect to ${targetUrl}: ${fetchError?.message || 'Unknown error'}` },
        { status: 502 }
      )
    }
  } catch (error: any) {
    console.error('Error in proxy:', error)
    return NextResponse.json(
      { error: `Failed to proxy request: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
} 