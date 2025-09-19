import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'MovieSearch 2025'
    const description = searchParams.get('description') || 'Advanced Movie Discovery Platform'
    const type = searchParams.get('type') || 'website'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f23',
            backgroundImage: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              maxWidth: '1200px',
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                fontSize: '120px',
                marginBottom: '40px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              🎬
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: type === 'movie' ? '72px' : '84px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            
            {/* Description */}
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '40px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                lineHeight: 1.4,
                textAlign: 'center',
                maxWidth: '1000px',
              }}
            >
              {description}
            </div>
            
            {/* Brand */}
            <div
              style={{
                fontSize: '28px',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '600',
                letterSpacing: '2px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              MovieSearch 2025
            </div>
          </div>
          
          {/* Bottom Accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
