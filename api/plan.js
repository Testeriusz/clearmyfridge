export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fridge = [], filters = [], goals = null } = req.body;
  if (fridge.length < 1) return res.status(400).json({ error: 'No fridge items' });

  const fridgeLines = fridge
    .map(i => `- ${i.name} (${i.qty}, expires in ${i.days} day${i.days === 1 ? '' : 's'})`)
    .join('\n');

  const dietLine = filters.length > 0
    ? `Dietary requirements: ${filters.join(', ')}. All recipes must fully comply.\n`
    : '';

  const goalsLine = goals
    ? `User's daily macro goals: ${goals.kcal} kcal, ${goals.protein}g protein, ${goals.fat}g fat, ${goals.carbs}g carbs.
Target per meal: Breakfast ~25%, Lunch ~35%, Dinner ~35%, Snack ~5% of daily goals per serving.\n`
    : '';

  const prompt = `You are a helpful home chef. Plan a full day of eating using the fridge contents below.
Generate exactly 4 recipes — one for each meal type: Breakfast, Lunch, Dinner, Snack.

Fridge contents:
${fridgeLines}

${dietLine}${goalsLine}Rules:
- Each recipe must use at least 1 fridge item
- Prioritise ingredients expiring soonest (lowest days value)
- Breakfast should be light/quick (≤20 min), Snack even lighter (≤10 min)
- List extra ingredients needed (not in fridge) in "missing"
- Return ONLY a valid JSON array of exactly 4 objects, no markdown, no explanation

JSON structure:
[
  {
    "mealType": "Breakfast",
    "title": "Recipe name",
    "blurb": "One engaging sentence",
    "prep": 10,
    "serves": 1,
    "uses": ["Exact fridge item name"],
    "missing": ["extra ingredient"],
    "macros": { "kcal": 300, "protein": 15, "fat": 10, "carbs": 40 },
    "tags": ["Vegetarian"],
    "steps": ["Step one.", "Step two."]
  }
]

The four objects must have mealType values: "Breakfast", "Lunch", "Dinner", "Snack" in that order.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return res.status(502).json({ error: 'AI unavailable' });

  const json = await response.json();
  const text = json.content?.[0]?.text ?? '[]';

  let raw = [];
  try {
    const match = text.match(/\[[\s\S]*\]/);
    raw = match ? JSON.parse(match[0]) : [];
  } catch {
    return res.status(502).json({ error: 'Failed to parse AI response' });
  }

  const MEAL_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const expiringNames = new Set(fridge.filter(i => i.days <= 3).map(i => i.name.toLowerCase()));

  const plan = MEAL_ORDER.map((mealType, idx) => {
    const r = raw.find(x => x.mealType === mealType) ?? raw[idx] ?? {};
    return {
      id:           `plan-${mealType.toLowerCase()}-${Date.now()}`,
      mealType,
      title:        r.title        ?? `${mealType} recipe`,
      blurb:        r.blurb        ?? '',
      prep:         r.prep         ?? 15,
      serves:       r.serves       ?? 1,
      uses:         r.uses         ?? [],
      missing:      r.missing      ?? [],
      macros:       r.macros       ?? { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      tags:         r.tags         ?? [],
      steps:        r.steps        ?? [],
      expiringUsed: (r.uses ?? []).filter(u => expiringNames.has(u.toLowerCase())).length,
    };
  });

  res.json({ plan });
}
