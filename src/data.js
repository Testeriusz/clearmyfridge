export function freshness(days) {
  if (days <= 0) return { key: 'red',   tone: 'red',   label: days < 0 ? 'Expired' : 'Today' };
  if (days <= 3) return { key: 'amber', tone: 'amber', label: days === 1 ? '1 day' : `${days} days` };
  return             { key: 'green', tone: 'green', label: `${days} days` };
}

export function dateFromDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export const FRIDGE_SEED = [
  { id: 'f1',  name: 'Baby spinach',    qty: '1 bag',     cat: 'Produce',   days: 0,  added: 4 },
  { id: 'f2',  name: 'Leftover rice',   qty: '1 box',     cat: 'Leftovers', days: 0,  added: 3 },
  { id: 'f3',  name: 'Salmon fillet',   qty: '2 fillets', cat: 'Protein',   days: -1, added: 5 },
  { id: 'f4',  name: 'Chicken breast',  qty: '500 g',     cat: 'Protein',   days: 1,  added: 3 },
  { id: 'f5',  name: 'Whole milk',      qty: '2 L',       cat: 'Dairy',     days: 2,  added: 5 },
  { id: 'f6',  name: 'Butter',          qty: '1 block',   cat: 'Dairy',     days: 2,  added: 12 },
  { id: 'f7',  name: 'Vine tomatoes',   qty: '4',         cat: 'Produce',   days: 3,  added: 4 },
  { id: 'f8',  name: 'Red peppers',     qty: '3',         cat: 'Produce',   days: 3,  added: 4 },
  { id: 'f9',  name: 'Greek yogurt',    qty: '500 g',     cat: 'Dairy',     days: 4,  added: 2 },
  { id: 'f10', name: 'Carrots',         qty: '500 g',     cat: 'Produce',   days: 5,  added: 4 },
  { id: 'f11', name: 'Mature cheddar',  qty: '200 g',     cat: 'Dairy',     days: 6,  added: 6 },
  { id: 'f12', name: 'Orange juice',    qty: '1 L',       cat: 'Drinks',    days: 7,  added: 5 },
  { id: 'f13', name: 'Apples',          qty: '5',         cat: 'Produce',   days: 8,  added: 6 },
  { id: 'f14', name: 'Free-range eggs', qty: '10',        cat: 'Protein',   days: 9,  added: 7 },
];

export const GENERATED_SEED = [
  {
    id: 'r1', title: 'Cheesy spinach scramble', prep: 15, serves: 2,
    uses: ['Baby spinach', 'Free-range eggs', 'Mature cheddar', 'Butter'],
    missing: [],
    expiringUsed: 1,
    macros: { kcal: 420, protein: 28, fat: 31, carbs: 6 },
    tags: ['Vegetarian'],
    blurb: 'A soft, slow scramble that folds wilted spinach and sharp cheddar through buttery eggs.',
    steps: [
      'Melt the butter in a non-stick pan over a low heat.',
      'Wilt the spinach for one minute, then push to one side.',
      'Beat the eggs with a pinch of salt and pour into the pan.',
      'Stir gently and constantly until just set, then fold through the spinach.',
      'Take off the heat, scatter over grated cheddar and let it melt.',
    ],
  },
  {
    id: 'r2', title: 'Chicken & pepper traybake', prep: 35, serves: 2,
    uses: ['Chicken breast', 'Red peppers', 'Carrots', 'Vine tomatoes'],
    missing: ['Olive oil', 'Paprika'],
    expiringUsed: 2,
    macros: { kcal: 380, protein: 41, fat: 14, carbs: 22 },
    tags: [],
    blurb: 'Everything roasts on one tray — sweet peppers and carrots under juicy chicken.',
    steps: [
      'Heat the oven to 200°C. Slice the peppers, carrots and tomatoes.',
      'Toss the vegetables with olive oil, paprika, salt and pepper on a tray.',
      'Nestle the chicken breasts on top and brush with a little more oil.',
      'Roast for 28–30 minutes until the chicken is cooked through.',
      'Rest for two minutes, then spoon over the roasting juices to serve.',
    ],
  },
  {
    id: 'r3', title: 'Spinach & tomato rice bowl', prep: 12, serves: 1,
    uses: ['Leftover rice', 'Baby spinach', 'Vine tomatoes', 'Mature cheddar'],
    missing: ['Garlic'],
    expiringUsed: 3,
    macros: { kcal: 350, protein: 12, fat: 11, carbs: 52 },
    tags: ['Vegetarian'],
    blurb: 'A five-minute warm bowl that rescues last night\'s rice with fresh tomato and greens.',
    steps: [
      'Warm a splash of oil and soften the chopped garlic for thirty seconds.',
      'Add the chopped tomatoes and cook until just collapsing.',
      'Stir through the leftover rice until piping hot throughout.',
      'Fold in the spinach until wilted, then season to taste.',
      'Top with grated cheddar and a grind of black pepper.',
    ],
  },
];

export const SAVED_SEED = [
  {
    id: 's1', title: 'Greek yogurt & apple bowl', prep: 5, serves: 1,
    uses: ['Greek yogurt', 'Apples'], missing: ['Honey', 'Oats'], expiringUsed: 0,
    macros: { kcal: 290, protein: 18, fat: 7, carbs: 38 }, tags: ['Vegetarian'],
    blurb: 'A quick high-protein breakfast bowl with grated apple and a drizzle of honey.',
    steps: [
      'Spoon the yogurt into a bowl.',
      'Coarsely grate or dice the apple and pile it on top.',
      'Scatter over oats and finish with a drizzle of honey.',
    ],
  },
  {
    id: 's2', title: 'Roast salmon & carrots', prep: 25, serves: 2,
    uses: ['Salmon fillet', 'Carrots'], missing: ['Lemon', 'Dill'], expiringUsed: 0,
    macros: { kcal: 410, protein: 34, fat: 24, carbs: 14 }, tags: [],
    blurb: 'A clean traybake of flaky salmon over honey-roasted carrots.',
    steps: [
      'Heat the oven to 200°C and cut the carrots into batons.',
      'Roast the carrots for fifteen minutes with a little oil.',
      'Add the salmon, lemon slices and dill; roast twelve minutes more.',
      'Serve straight from the tray.',
    ],
  },
];

export const SHOPPING_SEED = [
  { id: 'sh1',  name: 'Milk',            cat: 'Dairy',   source: 'ai',     done: false, note: 'Running low' },
  { id: 'sh2',  name: 'Natural yogurt',  cat: 'Dairy',   source: 'ai',     done: false },
  { id: 'sh3',  name: 'Onions',          cat: 'Produce', source: 'ai',     done: false },
  { id: 'sh4',  name: 'Garlic',          cat: 'Produce', source: 'ai',     done: false },
  { id: 'sh5',  name: 'Lemons',          cat: 'Produce', source: 'manual', done: true  },
  { id: 'sh6',  name: 'Olive oil',       cat: 'Pantry',  source: 'ai',     done: false },
  { id: 'sh7',  name: 'Paprika',         cat: 'Pantry',  source: 'ai',     done: false, note: 'For traybake' },
  { id: 'sh8',  name: 'Chicken thighs',  cat: 'Protein', source: 'ai',     done: false },
  { id: 'sh9',  name: 'Wholemeal bread', cat: 'Bakery',  source: 'ai',     done: true  },
  { id: 'sh10', name: 'Coffee beans',    cat: 'Pantry',  source: 'manual', done: false },
];

export const ALERTS_SEED = [
  { id: 'a1', items: ['Baby spinach', 'Leftover rice'], days: 0,  when: 'Today, 8:00',     recipeId: 'r1', read: false },
  { id: 'a2', items: ['Salmon fillet'],                 days: -1, when: 'Yesterday, 8:00', recipeId: 's2', read: false },
  { id: 'a3', items: ['Chicken breast'],                days: 1,  when: 'Today, 8:00',     recipeId: 'r2', read: true  },
  { id: 'a4', items: ['Whole milk', 'Butter'],          days: 2,  when: 'Yesterday, 8:00', recipeId: null, read: true  },
];

export const DIET_FILTERS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Low-calorie'];

export const CATEGORY_ORDER = ['Dairy', 'Fruit & Veg', 'Protein', 'Pantry', 'Bakery', 'Drinks', 'Leftovers', 'Other'];
