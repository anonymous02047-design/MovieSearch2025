/**
 * MongoDB Auto-Initialization Webhook
 * Automatically initializes MongoDB on first deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/mongodb-init';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.MONGODB_INIT_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize database
    const result = await initializeDatabase();
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Webhook initialization error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'MongoDB initialization webhook endpoint',
    method: 'POST',
    headers: {
      authorization: 'Bearer YOUR_WEBHOOK_SECRET',
    },
  });
}

