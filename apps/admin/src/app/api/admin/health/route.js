import { NextResponse } from 'next/server';
import { checkHealth } from '@hritikpedia/shared/db';

export async function GET() {
  const dbHealth = await checkHealth();
  const isHealthy = dbHealth.status === 'healthy';

  return NextResponse.json(
    {
      app: 'Hritikpedia Admin Console',
      status: isHealthy ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbHealth,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
