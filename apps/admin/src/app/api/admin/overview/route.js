import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { isAdmin } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || !isAdmin(payload.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Users metrics
    const usersCountRes = await query('SELECT COUNT(*) as total FROM users');
    const totalUsers = parseInt(usersCountRes.rows[0]?.total || '0', 10);

    // 2. Notes metrics
    const notesCountRes = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_free = TRUE) as free_count,
        COUNT(*) FILTER (WHERE is_free = FALSE) as paid_count,
        COUNT(*) FILTER (WHERE status = 'published') as published_count
      FROM notes
    `);
    const notesMetrics = notesCountRes.rows[0] || {};

    // 3. Orders and Revenue
    const ordersRes = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'paid') as paid_orders,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_revenue
      FROM orders
    `);
    const orderMetrics = ordersRes.rows[0] || {};

    // 3b. Daily revenue for the last 30 days (chart data)
    const revenueSeriesRes = await query(`
      SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS day,
             COALESCE(SUM(amount), 0) AS revenue
      FROM orders
      WHERE status = 'paid'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `);

    const previousRevenueRes = await query(`
      SELECT COALESCE(SUM(amount), 0) AS revenue
      FROM orders
      WHERE status = 'paid'
        AND created_at >= NOW() - INTERVAL '60 days'
        AND created_at < NOW() - INTERVAL '30 days'
    `);

    const revenueByDay = new Map(
      revenueSeriesRes.rows.map((row) => [row.day, parseFloat(row.revenue || '0')])
    );

    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);
    const revenueSeries = [];
    for (let offset = 29; offset >= 0; offset -= 1) {
      const day = new Date(todayUtc);
      day.setUTCDate(todayUtc.getUTCDate() - offset);
      const key = day.toISOString().slice(0, 10);
      revenueSeries.push({ date: key, revenue: revenueByDay.get(key) || 0 });
    }

    const revenueLast30Days = revenueSeries.reduce((sum, point) => sum + point.revenue, 0);
    const revenuePrevious30Days = parseFloat(previousRevenueRes.rows[0]?.revenue || '0');
    const revenueChangePercent =
      revenuePrevious30Days > 0
        ? Math.round(((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) * 1000) / 10
        : null;

    // 4. Newsletter Subscribers
    const subscribersRes = await query(`
      SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = 'active'
    `);
    const totalSubscribers = parseInt(subscribersRes.rows[0]?.total || '0', 10);

    // 5. Recent Security Events
    const securityRes = await query(`
      SELECT id, event_type, ip_address, details, created_at
      FROM security_events
      ORDER BY created_at DESC
      LIMIT 6
    `);

    // 6. Recent Audit Activity
    const auditRes = await query(`
      SELECT id, actor_email, action, entity_type, details, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 6
    `);

    return NextResponse.json({
      metrics: {
        totalUsers,
        publishedNotes: parseInt(notesMetrics.published_count || '0', 10),
        totalNotes: parseInt(notesMetrics.total || '0', 10),
        freeNotes: parseInt(notesMetrics.free_count || '0', 10),
        paidNotes: parseInt(notesMetrics.paid_count || '0', 10),
        totalOrders: parseInt(orderMetrics.total_orders || '0', 10),
        paidOrders: parseInt(orderMetrics.paid_orders || '0', 10),
        totalRevenue: parseFloat(orderMetrics.total_revenue || '0'),
        newsletterSubscribers: totalSubscribers,
      },
      revenue: {
        last30Days: Math.round(revenueLast30Days * 100) / 100,
        previous30Days: Math.round(revenuePrevious30Days * 100) / 100,
        changePercent: revenueChangePercent,
        series: revenueSeries,
      },
      recentSecurityEvents: securityRes.rows,
      recentAuditLogs: auditRes.rows,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Overview metrics error:', err);
    return NextResponse.json({ error: 'Failed to query database metrics' }, { status: 500 });
  }
}
