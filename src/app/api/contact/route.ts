import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract reCAPTCHA token from headers
    const recaptchaToken = request.headers.get('x-recaptcha-token');
    
    // Verify reCAPTCHA token if provided
    let recaptchaScore = 0.5; // Default score
    if (recaptchaToken) {
      try {
        const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY || '',
            response: recaptchaToken,
            remoteip: request.ip || request.headers.get('x-forwarded-for') || '',
          }),
        });

        const verification = await verificationResponse.json();
        
        if (!verification.success) {
          return NextResponse.json(
            { error: 'reCAPTCHA verification failed' },
            { status: 400 }
          );
        }

        recaptchaScore = verification.score || 0.5;
        
        // Check if score is acceptable
        if (recaptchaScore < 0.5) {
          return NextResponse.json(
            { error: 'reCAPTCHA score too low' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        // Continue without reCAPTCHA verification in case of error
      }
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message, phone, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    // 4. Log the contact form submission

    // For now, we'll just simulate success
    const contactData = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      inquiryType: inquiryType || 'general',
      timestamp: new Date().toISOString(),
      recaptchaScore: recaptchaScore,
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Log the contact form submission
    console.log('Contact form submission:', contactData);

    // In a real application, you would save this to a database
    // await saveContactSubmission(contactData);

    // Send email notification (you would implement this)
    // await sendContactNotification(contactData);

    // Send auto-reply to user (you would implement this)
    // await sendAutoReply(contactData);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: contactData.id,
      timestamp: contactData.timestamp,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
