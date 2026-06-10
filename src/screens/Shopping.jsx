import { useState, useRef, useEffect } from 'react';
import { CATEGORY_ORDER } from '../data';
import { Icon } from '../icons';
import { Header, Btn, Card } from '../ui';

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
  const [draft, setDraft]           = useState('');
  const [focused, setFocused]       = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const inputRef  = useRef(null);
  const debounceRef = useRef(null);

  const remaining = shopping.filter(s => !s.done).length;
  const doneCount = shopping.length - remaining;
  const allDone   = shopping.length > 0 && remaining === 0;

  const groups = CATEGORY_ORDER
    .map(cat => ({ cat, items: shopping.filter(s => s.cat === cat) }))
    .filter(g => g.items.length > 0);

  const onList = new Set(shopping.map(s => s.name.toLowerCase()));

  useEffect(() => {
    const q = draft.trim();
    if (!q) { setSuggestions([]); setLoading(false); return; }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: q, fridge: (fridge || []).map(i => i.name) }),
        });
        const { suggestions: raw = [] } = await res.json();
        setSuggestions(raw.filter(s => !onList.has(s.toLowerCase()) && s.toLowerCase() !== q.toLowerCase()));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [draft]);

  const pick = (name) => {
    onAddShop(name);
    setDraft('');
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const submit = () => {
    if (draft.trim()) { onAddShop(draft.trim()); setDraft(''); setSuggestions([]); }
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
          {focused && (loading || suggestions.length > 0) && (
            <div style={{
              marginTop: 6, background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,.08)',
            }}>
              {loading && suggestions.length === 0 ? (
                <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-3)', fontSize: 14 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 99, border: '2px solid var(--line)', borderTopColor: 'var(--green)', animation: 'cmf-spin 0.7s linear infinite', flexShrink: 0 }} />
                  Suggesting…
                </div>
              ) : suggestions.map((s, i) => (
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
                  {(fridge || []).some(f => f.name.toLowerCase() === s.toLowerCase()) && (
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
