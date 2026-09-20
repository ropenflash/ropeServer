/**
 * Vercel Serverless Function — typeahead search against Supabase Postgres (PostgREST).
 * Spring Boot remains available for local/self-hosted use; Vercel cannot run Spring Boot.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' });
  }

  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.status(200).json([]);
  }

  // Strip PostgREST filter metacharacters from user input
  const safe = query.replace(/[,.()]/]/.g, ' ').replace(/\s+/g, ' ').trim();
  if (!safe) {
    return res.status(200).json([]);
  }

  const limitRaw = Number.parseInt(String(req.query.limit || '8'), 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 20) : 8;
  const pattern = `*${safe}*`;

  const params = new URLSearchParams({
    select: 'id,name,category,description',
    or: `(name.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern})`,
    order: 'name.asc',
    limit: String(limit),
  });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/search_items?${params}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({
        error: 'Supabase search failed',
        detail: body.slice(0, 300),
      });
    }

    const rows = await response.json();
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({
      error: 'Search request failed',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
