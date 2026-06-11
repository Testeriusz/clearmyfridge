import { useState, useEffect, useRef } from 'react';
import { CATEGORY_ORDER } from '../data';
import { getMacros } from '../nutrition';
import { Icon } from '../icons';
import { Header, Btn, Card, Chip, Sheet, Macros, ItemThumb } from '../ui';

const GROCERY_LIST = [
  // Dairy
  'Milk', 'Semi-skimmed milk', 'Oat milk', 'Almond milk', 'Soy milk', 'Coconut milk',
  'Butter', 'Salted butter', 'Unsalted butter',
  'Cheddar', 'Mozzarella', 'Parmesan', 'Feta', 'Brie', 'Cream cheese', 'Cottage cheese', 'Goat cheese',
  'Yogurt', 'Greek yogurt', 'Sour cream', 'Crème fraîche',
  'Single cream', 'Double cream', 'Whipping cream',
  'Eggs', 'Free-range eggs',
  // Produce – vegetables
  'Tomatoes', 'Cherry tomatoes', 'Beef tomatoes', 'Tinned tomatoes',
  'Onions', 'Red onions', 'Spring onions', 'Shallots',
  'Garlic', 'Ginger',
  'Potatoes', 'Sweet potatoes', 'New potatoes',
  'Carrots', 'Parsnips', 'Beetroot',
  'Broccoli', 'Cauliflower', 'Cabbage', 'Brussels sprouts', 'Kale', 'Spinach', 'Rocket', 'Lettuce', 'Watercress',
  'Courgette', 'Aubergine', 'Pepper', 'Red pepper', 'Yellow pepper',
  'Mushrooms', 'Chestnut mushrooms', 'Portobello mushrooms',
  'Cucumber', 'Celery', 'Leek', 'Fennel', 'Asparagus', 'Green beans', 'Peas', 'Sweetcorn',
  'Avocado', 'Edamame',
  'Chilli', 'Red chilli', 'Green chilli',
  // Produce – fruit
  'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 'Grapefruit',
  'Strawberries', 'Raspberries', 'Blueberries', 'Blackberries',
  'Grapes', 'Melon', 'Watermelon', 'Pineapple', 'Mango', 'Papaya',
  'Peaches', 'Plums', 'Nectarines', 'Pears', 'Kiwi',
  'Dates', 'Figs',
  // Protein – meat
  'Chicken breast', 'Chicken thighs', 'Chicken wings', 'Whole chicken',
  'Beef mince', 'Steak', 'Beef stew meat',
  'Pork mince', 'Pork chops', 'Bacon', 'Pancetta', 'Prosciutto', 'Ham',
  'Lamb mince', 'Lamb chops', 'Lamb shoulder',
  'Sausages', 'Chorizo', 'Salami',
  'Turkey mince', 'Turkey breast',
  // Protein – fish & seafood
  'Salmon', 'Salmon fillet', 'Smoked salmon',
  'Cod', 'Haddock', 'Sea bass', 'Tuna steak',
  'Tinned tuna', 'Tinned sardines', 'Tinned mackerel',
  'Prawns', 'King prawns', 'Shrimp',
  'Mussels', 'Squid',
  // Protein – plant
  'Tofu', 'Firm tofu', 'Silken tofu',
  'Tempeh', 'Halloumi', 'Quorn mince', 'Quorn fillets',
  'Chickpeas', 'Tinned chickpeas', 'Lentils', 'Red lentils',
  'Black beans', 'Kidney beans', 'Butter beans', 'Cannellini beans',
  // Pantry – grains & pasta
  'Pasta', 'Spaghetti', 'Penne', 'Fusilli', 'Tagliatelle', 'Lasagne sheets', 'Orzo',
  'Rice', 'Basmati rice', 'Brown rice', 'Risotto rice', 'Jasmine rice',
  'Bread', 'Sourdough', 'Baguette', 'Pitta bread', 'Tortillas', 'Wraps', 'Naan bread', 'Bagels',
  'Oats', 'Granola', 'Cornflakes', 'Muesli',
  'Couscous', 'Quinoa', 'Bulgur wheat', 'Polenta',
  'Noodles', 'Rice noodles', 'Egg noodles', 'Udon noodles',
  // Pantry – oils, sauces & condiments
  'Olive oil', 'Extra virgin olive oil', 'Vegetable oil', 'Coconut oil', 'Sesame oil',
  'Soy sauce', 'Fish sauce', 'Worcestershire sauce', 'Hot sauce', 'Sriracha',
  'Ketchup', 'Mustard', 'Dijon mustard', 'Mayonnaise', 'Horseradish',
  'Balsamic vinegar', 'White wine vinegar', 'Apple cider vinegar',
  'Tomato purée', 'Tomato pasta sauce',
  'Pesto', 'Tahini', 'Hummus',
  'Honey', 'Maple syrup', 'Jam', 'Peanut butter', 'Almond butter',
  // Pantry – spices & baking
  'Salt', 'Black pepper', 'Paprika', 'Smoked paprika', 'Cumin', 'Coriander',
  'Turmeric', 'Chilli flakes', 'Cayenne pepper', 'Oregano', 'Thyme', 'Rosemary',
  'Cinnamon', 'Nutmeg', 'Cardamom', 'Garam masala', 'Curry powder',
  'Flour', 'Self-raising flour', 'Bread flour', 'Cornflour',
  'Sugar', 'Caster sugar', 'Brown sugar', 'Icing sugar',
  'Baking powder', 'Baking soda', 'Yeast', 'Vanilla extract',
  'Dark chocolate', 'Cocoa powder',
  // Pantry – tins & jars
  'Chopped tomatoes', 'Coconut cream', 'Coconut milk tinned',
  'Vegetable stock', 'Chicken stock', 'Beef stock', 'Stock cubes',
  'Tinned sweetcorn', 'Tinned peas',
  // Drinks
  'Coffee', 'Ground coffee', 'Instant coffee', 'Coffee beans',
  'Tea', 'Green tea', 'Herbal tea',
  'Orange juice', 'Apple juice', 'Oat milk', 'Sparkling water', 'Still water',
  'Wine', 'Red wine', 'White wine', 'Beer',
  // Snacks & other
  'Crisps', 'Nuts', 'Almonds', 'Cashews', 'Walnuts', 'Peanuts',
  'Dark chocolate bar', 'Milk chocolate bar',
  'Rice cakes', 'Crackers', 'Breadsticks',
  'Popcorn',
  // Frozen
  'Frozen peas', 'Frozen spinach', 'Frozen sweetcorn', 'Frozen berries',
  'Frozen chips', 'Frozen pizza',
  // Fresh herbs
  'Basil', 'Parsley', 'Coriander', 'Mint', 'Dill', 'Chives', 'Tarragon',
];

function Checkbox({ done }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
      border: done ? 'none' : '2px solid var(--line)',
      background: done ? 'var(--green)' : 'var(--surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .15s, border-color .15s',
    }}>
      {done && <Icon name="check" size={16} color="#fff" strokeWidth={3} />}
    </div>
  );
}

function ShopRow({ item, onToggle, onOpen, last }) {
  const macros = getMacros(item.name);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', WebkitTapHighlightColor: 'transparent' }}>
        {/* Checkbox area — toggles done */}
        <button onClick={() => onToggle(item.id)} style={{
          flexShrink: 0, padding: '12px 10px 12px 14px', alignSelf: 'stretch',
          background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <Checkbox done={item.done} />
        </button>
        {/* Name + macros area — opens detail */}
        <button onClick={() => onOpen(item)} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px 10px 3px',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
          minWidth: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 15.5, fontWeight: 600,
              color: item.done ? 'var(--ink-3)' : 'var(--ink)',
              textDecorationLine: item.done ? 'line-through' : 'none',
              textDecorationColor: 'var(--ink-3)',
            }}>
              {item.name}
            </div>
            {macros && !item.done && (
              <div style={{ fontSize: 11.5, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
                <span style={{ color: 'var(--ink-2)', fontWeight: 650 }}>{macros.kcal} kcal</span>
                <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}> · {macros.protein}g P · {macros.fat}g F · {macros.carbs}g C</span>
              </div>
            )}
          </div>
          {item.source === 'ai' && !item.done && (
            <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 650, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99 }}>
              Suggested
            </span>
          )}
          <Icon name="chevR" size={15} color="var(--ink-3)" strokeWidth={2} style={{ flexShrink: 0 }} />
        </button>
      </div>
      {!last && <div style={{ height: 1, background: 'var(--line-2)', marginLeft: 53 }} />}
    </div>
  );
}

function ShopDetail({ item, onClose, onToggle }) {
  if (!item) return null;
  const macros = getMacros(item.name);
  return (
    <Sheet open={!!item} onClose={onClose}>
      <div style={{ padding: '8px 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <ItemThumb cat={item.cat} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.3 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3 }}>{item.cat}</div>
          </div>
        </div>

        {macros ? (
          <Card pad={6} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, padding: '7px 10px 0' }}>
              Nutrition · per 100g
            </div>
            <Macros macros={macros} />
          </Card>
        ) : (
          <Card pad={13} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>No nutrition data for this item</div>
          </Card>
        )}

        <Btn full variant={item.done ? 'secondary' : 'primary'} onClick={() => { onToggle(item.id); onClose(); }}>
          {item.done ? 'Mark as not bought' : 'Mark as bought'}
        </Btn>
      </div>
    </Sheet>
  );
}

const HISTORY_KEY = 'cmf_shop_history';
const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } };
const saveToHistory = (name) => {
  try {
    const h = getHistory().filter(x => x.toLowerCase() !== name.toLowerCase());
    localStorage.setItem(HISTORY_KEY, JSON.stringify([name, ...h].slice(0, 200)));
  } catch {}
};

export default function ShoppingScreen({ fridge, shopping, onToggleShop, onAddShop, onClearTicked }) {
  const [draft, setDraft] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const inputRef = useRef(null);

  const remaining = shopping.filter(s => !s.done).length;
  const doneCount = shopping.length - remaining;

  const availCats = CATEGORY_ORDER.filter(c => shopping.some(s => s.cat === c));
  const groups = CATEGORY_ORDER
    .map(cat => ({ cat, items: shopping.filter(s => s.cat === cat) }))
    .filter(g => g.items.length > 0)
    .filter(g => !activeCat || g.cat === activeCat);

  const onList      = new Set(shopping.map(s => s.name.toLowerCase()));
  const fridgeNames = new Set((fridge || []).map(i => i.name.toLowerCase()));

  const [suggestions, setSuggestions] = useState([]);

  // Local suggestions — instant on every keystroke
  useEffect(() => {
    const q = draft.trim().toLowerCase();
    if (!q) { setSuggestions([]); return; }
    const history = getHistory();
    const seen    = new Set();
    const result  = [];
    for (const s of [...history, ...(fridge || []).map(i => i.name), ...GROCERY_LIST]) {
      if (s.toLowerCase().includes(q) && s.toLowerCase() !== q && !onList.has(s.toLowerCase()) && !seen.has(s.toLowerCase())) {
        seen.add(s.toLowerCase());
        result.push(s);
      }
      if (result.length >= 8) break;
    }
    setSuggestions(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, shopping]);

  // AI suggestions — debounced, replaces local results when ready
  useEffect(() => {
    const q = draft.trim();
    if (q.length < 3) return;
    const timer = setTimeout(async () => {
      try {
        const res  = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: q, fridge: (fridge || []).map(i => i.name) }),
        });
        const { suggestions: ai = [] } = await res.json();
        const filtered = ai.filter(s => !onList.has(s.toLowerCase()));
        if (!filtered.length) return;
        const aiSet = new Set(filtered.map(s => s.toLowerCase()));
        setSuggestions(prev =>
          [...filtered, ...prev.filter(s => !aiSet.has(s.toLowerCase()))].slice(0, 8)
        );
      } catch {} // silently keep local suggestions on error
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const historySet = new Set(getHistory().map(h => h.toLowerCase()));

  const pick = (name) => {
    saveToHistory(name);
    onAddShop(name);
    setDraft('');
    inputRef.current?.blur();
  };

  const submit = () => {
    if (!draft.trim()) return;
    saveToHistory(draft.trim());
    onAddShop(draft.trim());
    setDraft('');
  };

  return (
    <div style={{ paddingBottom: 120 }}>
      <Header
        title="Shopping"
        subtitle={remaining > 0 ? `${remaining} to buy` : 'All done'}
        right={doneCount > 0
          ? <Btn size="sm" variant="secondary" onClick={onClearTicked}>Clear ticked</Btn>
          : null}
      />

      <div style={{ padding: '0 20px' }}>
        {/* add item input */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 14, zIndex: 1 }}>
                <Icon name="plus" size={19} color="var(--ink-3)" strokeWidth={2.2} />
              </span>
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Add an item"
                style={{
                  width: '100%', height: 50, borderRadius: 14, border: '1px solid var(--line)',
                  background: 'var(--surface)', padding: '0 14px 0 42px',
                  fontFamily: 'inherit', fontSize: 15.5, fontWeight: 550, color: 'var(--ink)', outline: 'none',
                }}
              />
            </div>
            {draft.trim() && <Btn onClick={submit}>Add</Btn>}
          </div>
          {suggestions.length > 0 && (
            <div style={{
              marginTop: 6, background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,.08)',
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onMouseDown={() => pick(s)}
                  onTouchStart={() => pick(s)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: 'transparent', border: 'none',
                    borderBottom: i < suggestions.length - 1 ? '1px solid var(--line-2)' : 'none',
                    cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Icon name="plus" size={16} color="var(--ink-3)" strokeWidth={2.2} />
                  <span style={{ fontSize: 15, fontWeight: 550, color: 'var(--ink)' }}>{s}</span>
                  {fridgeNames.has(s.toLowerCase())
                    ? <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 650, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99 }}>In fridge</span>
                    : historySet.has(s.toLowerCase())
                      ? <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 650, color: 'var(--ink-3)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 99 }}>Recent</span>
                      : null
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        {availCats.length > 1 && (
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 18,
            margin: '0 -20px 18px', padding: '0 20px', scrollbarWidth: 'none',
          }}>
            <Chip active={!activeCat} onClick={() => setActiveCat(null)}>All</Chip>
            {availCats.map(c => (
              <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(activeCat === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}

        {shopping.length === 0 ? (
          <div style={{ marginTop: 6 }}>
            <Card pad={24} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Your list is empty</div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Add items above or generate from a recipe.</div>
            </Card>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color: 'var(--ink-3)', fontSize: 13 }}>
              <Icon name="info" size={15} color="var(--ink-3)" strokeWidth={1.8} />
              Suggestions are based on what's running low at home.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {groups.map(g => (
                <div key={g.cat}>
                  <div style={{ fontSize: 13, fontWeight: 750, color: 'var(--ink-2)', letterSpacing: 0.3, padding: '0 6px 8px', textTransform: 'uppercase' }}>
                    {g.cat}
                  </div>
                  <Card pad={2}>
                    {g.items.map((it, i) => (
                      <ShopRow key={it.id} item={it} onToggle={onToggleShop} onOpen={setDetailItem} last={i === g.items.length - 1} />
                    ))}
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ShopDetail
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onToggle={(id) => { onToggleShop(id); setDetailItem(d => d && d.id === id ? { ...d, done: !d.done } : d); }}
      />
    </div>
  );
}
