export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fridge = [], filters = [], goals = null } = req.body;
  if (fridge.length < 1) return res.status(400).json({ error: 'No fridge items' });

  const fridgeLines = fridge
    .map(i => `- ${i.name} (${i.qty}, expires in ${i.days} day${i.days === 1 ? '' : 's'})`)
    .join('\n');

  const dietLine = filters.length > 0
    ? `Dietary requirements: ${filters.join(', ')}. Only suggest recipes that fully comply.\n`
    : '';

  const goalsLine = goals
    ? `User's daily macro goals: ${goals.kcal} kcal, ${goals.protein}g protein, ${goals.fat}g fat, ${goals.carbs}g carbs. Each recipe (per serving) should ideally cover 25–40% of these daily targets.\n`
    : '';

  const prompt = `You are a helpful home chef. Generate exactly 3 recipes using the fridge contents below.

Fridge contents:
${fridgeLines}

${dietLine}${goalsLine}Rules:
- Prioritise ingredients expiring soonest (lowest days value)
- Each recipe must use at least 2 fridge items
- List used fridge items in "uses" using their exact names as given above
- List any extra ingredients needed (not in the fridge) in "missing"
- Keep prep time between 5 and 45 minutes
- Return ONLY a valid JSON array, no markdown, no explanation

JSON structure:
[
  {
    "title": "Recipe name",
    "blurb": "One engaging sentence describing the dish",
    "prep": 20,
    "serves": 2,
    "uses": ["Exact fridge item name"],
    "missing": ["extra ingredient"],
    "macros": { "kcal": 400, "protein": 25, "fat": 15, "carbs": 40 },
    "tags": ["Vegetarian"],
    "steps": ["Step one.", "Step two.", "Step three."]
  }
]`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return res.status(502).json({ error: 'AI unavailable' });

  const json = await response.json();
  const text = json.content?.[0]?.text ?? '[]';

  let recipes = [];
  try {
    const match = text.match(/\[[\s\S]*\]/);
    recipes = match ? JSON.parse(match[0]) : [];
  } catch {
    return res.status(502).json({ error: 'Failed to parse AI response' });
  }

  const expiringNames = new Set(
    fridge.filter(i => i.days <= 3).map(i => i.name.toLowerCase())
  );

  recipes = recipes.slice(0, 3).map((r, i) => ({
    id: `ai-${Date.now()}-${i}`,
    title:        r.title        ?? 'Untitled',
    blurb:        r.blurb        ?? '',
    prep:         r.prep         ?? 20,
    serves:       r.serves       ?? 2,
    uses:         r.uses         ?? [],
    missing:      r.missing      ?? [],
    macros:       r.macros       ?? { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    tags:         r.tags         ?? [],
    steps:        r.steps        ?? [],
    expiringUsed: (r.uses ?? []).filter(u => expiringNames.has(u.toLowerCase())).length,
  }));

  res.json({ recipes });
}
