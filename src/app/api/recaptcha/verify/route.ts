import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'reCAPTCHA secret key not configured' },
        { status: 500 }
      );
    }

    // Verify the token with Google's reCAPTCHA API
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: request.ip || request.headers.get('x-forwarded-for') || '',
      }),
    });

    const verification = await verificationResponse.json();
    
    if (!verification.success) {
      return NextResponse.json(
        { 
          error: 'reCAPTCHA verification failed',
          details: verification['error-codes'] || []
        },
        { status: 400 }
      );
    }

    // Check if the action matches (if provided)
    if (action && verification.action !== action) {
      return NextResponse.json(
        { 
          error: 'reCAPTCHA action mismatch',
          expected: action,
          received: verification.action
        },
        { status: 400 }
      );
    }

    // Check if score is acceptable (for v3)
    const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');
    if (verification.score < threshold) {
      return NextResponse.json(
        { 
          error: 'reCAPTCHA score too low',
          score: verification.score,
          threshold: threshold
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      score: verification.score,
      action: verification.action,
      hostname: verification.hostname,
      challenge_ts: verification.challenge_ts,
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during reCAPTCHA verification' },
      { status: 500 }
    );
  }
}
