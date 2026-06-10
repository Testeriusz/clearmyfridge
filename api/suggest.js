export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { query, fridge = [] } = req.body;
  if (!query || query.trim().length < 1) return res.json({ suggestions: [] });

  const fridgeList = fridge.slice(0, 20).join(', ');
  const prompt = fridgeList
    ? `The user has these items in their fridge: ${fridgeList}.\n\nThey are typing "${query}" into a grocery shopping list. Suggest up to 8 grocery items whose name starts with or contains "${query}". Prioritise items that complement what's in their fridge. Return ONLY a JSON array of short item name strings, nothing else.`
    : `Suggest up to 8 grocery items whose name starts with or contains "${query}". Return ONLY a JSON array of short item name strings, nothing else.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return res.json({ suggestions: [] });

  const json = await response.json();
  const text = json.content?.[0]?.text ?? '[]';

  let suggestions = [];
  try {
    const match = text.match(/\[[\s\S]*\]/);
    suggestions = match ? JSON.parse(match[0]) : [];
  } catch {
    suggestions = [];
  }

  res.json({ suggestions: suggestions.filter(s => typeof s === 'string').slice(0, 8) });
}
