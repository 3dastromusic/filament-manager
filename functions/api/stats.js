// GET /api/stats - dashboard summary statistics
export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;

  const totals = await db.prepare(`
    SELECT
      COUNT(*) as total_spools,
      SUM(CASE WHEN status = 'In Use' THEN 1 ELSE 0 END) as in_use,
      SUM(CASE WHEN status = 'Unopened' THEN 1 ELSE 0 END) as unopened,
      SUM(CASE WHEN status = 'Empty' THEN 1 ELSE 0 END) as empty,
      COALESCE(SUM(cost), 0) as total_investment,
      COALESCE(SUM(remaining), 0) as total_remaining,
      COALESCE(SUM(spool_weight), 0) as total_capacity
    FROM filaments
  `).first();

  const { results: materialBreakdown } = await db.prepare(`
    SELECT material, COUNT(*) as count
    FROM filaments
    GROUP BY material
    ORDER BY count DESC
  `).all();

  const { results: lowStock } = await db.prepare(`
    SELECT id, brand, material, color, remaining, spool_weight,
      ROUND(CAST(remaining AS REAL) / CAST(spool_weight AS REAL) * 100, 1) as pct
    FROM filaments
    WHERE spool_weight > 0
      AND (CAST(remaining AS REAL) / CAST(spool_weight AS REAL)) < 0.25
      AND status != 'Empty'
    ORDER BY pct ASC
  `).all();

  return Response.json({
    totals,
    materialBreakdown,
    lowStock
  });
}
