import { useState, useRef } from 'react';
import { CATEGORY_ORDER } from '../data';
import { Icon } from '../icons';
import { Header, Btn, Card } from '../ui';

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

function ShopRow({ item, onToggle, last }) {
  return (
    <div>
      <button onClick={() => onToggle(item.id)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <Checkbox done={item.done} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15.5, fontWeight: 600,
            color: item.done ? 'var(--ink-3)' : 'var(--ink)',
            textDecorationLine: item.done ? 'line-through' : 'none',
            textDecorationColor: 'var(--ink-3)',
          }}>
            {item.name}
          </div>
          {item.note && !item.done && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{item.note}</div>
          )}
        </div>
        {item.source === 'ai' && !item.done && (
          <span style={{ fontSize: 11, fontWeight: 650, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99 }}>
            Suggested
          </span>
        )}
      </button>
      {!last && <div style={{ height: 1, background: 'var(--line-2)', marginLeft: 53 }} />}
    </div>
  );
}

export default function ShoppingScreen({ fridge, shopping, onToggleShop, onAddShop, onClearTicked }) {
  const [draft, setDraft]     = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const remaining = shopping.filter(s => !s.done).length;
  const doneCount = shopping.length - remaining;
  const allDone   = shopping.length > 0 && remaining === 0;

  const groups = CATEGORY_ORDER
    .map(cat => ({ cat, items: shopping.filter(s => s.cat === cat) }))
    .filter(g => g.items.length > 0);

  const onList = new Set(shopping.map(s => s.name.toLowerCase()));
  const fridgeNames = new Set((fridge || []).map(i => i.name.toLowerCase()));

  const suggestions = draft.trim().length > 0
    ? [...new Set([...(fridge || []).map(i => i.name), ...GROCERY_LIST])]
        .filter(s => {
          const sl = s.toLowerCase(), dl = draft.toLowerCase().trim();
          return sl.includes(dl) && sl !== dl && !onList.has(sl);
        })
        .slice(0, 8)
    : [];

  const pick = (name) => {
    onAddShop(name);
    setDraft('');
    inputRef.current?.blur();
  };

  const submit = () => {
    if (draft.trim()) { onAddShop(draft.trim()); setDraft(''); }
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
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
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
          {focused && suggestions.length > 0 && (
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
                  {fridgeNames.has(s.toLowerCase()) && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 650, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99 }}>
                      In fridge
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {allDone ? (
          <div style={{ marginTop: 6 }}>
            <Card pad={24} style={{ textAlign: 'center', background: 'var(--green-soft)', border: 'none' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 99, background: 'var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              }}>
                <Icon name="check" size={28} color="#fff" strokeWidth={3} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 750, color: 'var(--green-ink)', marginBottom: 4 }}>All done</div>
              <div style={{ fontSize: 14, color: 'var(--green-ink)', opacity: .8 }}>
                Everything on your list is ticked off.
              </div>
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
                      <ShopRow key={it.id} item={it} onToggle={onToggleShop} last={i === g.items.length - 1} />
                    ))}
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
