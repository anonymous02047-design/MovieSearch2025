import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
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

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          'error-codes': verificationResult['error-codes'] || ['unknown-error'],
        },
        { status: 400 }
      );
    }

    // Check action if provided
    if (action && verificationResult.action !== action) {
      return NextResponse.json(
        {
          success: false,
          'error-codes': ['action-mismatch'],
        },
        { status: 400 }
      );
    }

    // Check score if available (for reCAPTCHA v3)
    const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');
    if (verificationResult.score !== undefined && verificationResult.score < threshold) {
      return NextResponse.json(
        {
          success: false,
          'error-codes': ['score-too-low'],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      score: verificationResult.score,
      action: verificationResult.action,
      challenge_ts: verificationResult.challenge_ts,
      hostname: verificationResult.hostname,
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}