import { NextResponse } from 'next/server';
import { checkHealth } from '@hritikpedia/shared/db';

export async function GET() {
  const dbHealth = await checkHealth();
  const isHealthy = dbHealth.status === 'healthy';

  const mem = process.memoryUsage();
  return NextResponse.json(
    {
      app: 'Hritikpedia Admin Console',
      status: isHealthy ? 'ok' : 'degraded',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbHealth,
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      },
      env: process.env.NODE_ENV || 'development',
    },
    { status: isHealthy ? 200 : 503 }
  );
}
