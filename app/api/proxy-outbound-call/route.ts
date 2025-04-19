import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetUrl, data } = body
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Target URL is required' },
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
          { success: false, error: `Failed to initiate call: ${errorText}` },
          { status: 500 }
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
        responseData = { success: true, message: textResponse }
      }
      
      console.log('Proxy response:', responseData)
      return NextResponse.json({ success: true, ...responseData })
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: `Failed to connect to service: ${fetchError?.message || 'Unknown error'}` },
        { status: 502 }
      )
    }
  } catch (error: any) {
    console.error('Error in proxy:', error)
    return NextResponse.json(
      { success: false, error: `Failed to process request: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
} 