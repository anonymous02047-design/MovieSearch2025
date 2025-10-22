/**
 * MongoDB Health Check API
 * GET /api/health/mongodb
 */

import { NextResponse } from 'next/server';
import { getDatabaseHealth, getDatabaseStats, initializeDatabase, needsInitialization } from '@/lib/mongodb-init';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if database needs initialization
    const needsInit = await needsInitialization();

    if (needsInit) {
      console.log('Database needs initialization, initializing now...');
      await initializeDatabase();
    }

    // Get health status
    const health = await getDatabaseHealth();
    
    // Get stats if healthy
    let stats = null;
    if (health.status === 'healthy') {
      const statsResult = await getDatabaseStats();
      stats = statsResult.success ? statsResult.stats : null;
    }

    return NextResponse.json({
      ...health,
      stats,
    }, {
      status: health.status === 'healthy' ? 200 : 503,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}

