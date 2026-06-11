import { useState, useEffect } from 'react';
import { freshness, dateFromDays } from '../data';
import { getMacros } from '../nutrition';
import { Icon } from '../icons';
import {
  Header, Btn, Chip, Card, Sheet, StatusPill, ItemThumb, EmptyState, Macros, ghostBtn,
} from '../ui';

const CATS = ['Fruit & Veg', 'Dairy', 'Protein', 'Pantry', 'Bakery', 'Drinks', 'Leftovers', 'Other'];
const EXPIRY_PRESETS = [
  { label: 'Today',   days: 0  },
  { label: '3 days',  days: 3  },
  { label: '1 week',  days: 7  },
  { label: '2 weeks', days: 14 },
];

const inputStyle = {
  width: '100%', height: 50, borderRadius: 14, border: '1px solid var(--line)',
  background: 'var(--surface)', padding: '0 15px', fontFamily: 'inherit',
  fontSize: 16, fontWeight: 550, color: 'var(--ink)', outline: 'none',
};

function Field({ label, children, style = {} }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 8, letterSpacing: 0.1 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Stepper({ onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 10, border: '1px solid var(--line)',
      background: 'var(--surface-2)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer',
    }}>
      <Icon name={icon} size={18} color="var(--ink)" strokeWidth={2.2} />
    </button>
  );
}

function FridgeRow({ item, onClick }) {
  const f = freshness(item.days);
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px',
      background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <ItemThumb cat={item.cat} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 650, color: 'var(--ink)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
          {item.qty} · {item.cat}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <StatusPill tone={f.tone} label={f.label} size="sm" />
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500 }}>
          {dateFromDays(item.days)}
        </span>
      </div>
    </button>
  );
}

function Section({ title, count, tone, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 8px' }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: `var(--${tone})` }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', letterSpacing: 0.2 }}>
          {title}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>{count}</span>
      </div>
      <Card pad={2}>{children}</Card>
    </div>
  );
}

export default function FridgeScreen({ fridge, onOpenItem, onOpenAdd }) {
  const [activeCat, setActiveCat] = useState(null);

  const cats = [...new Set(fridge.map(i => i.cat))].sort();
  const visible = activeCat ? fridge.filter(i => i.cat === activeCat) : fridge;
  const sorted = [...visible].sort((a, b) => a.days - b.days);
  const red   = sorted.filter(i => i.days <= 0);
  const amber = sorted.filter(i => i.days > 0 && i.days <= 3);
  const green = sorted.filter(i => i.days > 3);

  const rows = (arr) => arr.map((it, i) => (
    <div key={it.id}>
      {i > 0 && <div style={{ height: 1, background: 'var(--line-2)', marginLeft: 71 }} />}
      <FridgeRow item={it} onClick={() => onOpenItem(it)} />
    </div>
  ));

  return (
    <div style={{ paddingBottom: 120 }}>
      <Header
        title="Fridge"
        subtitle={`${fridge.length} items`}
        right={<Btn size="sm" icon="plus" onClick={onOpenAdd}>Add</Btn>}
      />

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <StatusPill tone="red"   label={`${red.length} need using`} />
          <StatusPill tone="amber" label={`${amber.length} use soon`} />
          <StatusPill tone="green" label={`${green.length} fresh`} />
        </div>

        {cats.length > 1 && (
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 18,
            margin: '0 -20px 18px', padding: '0 20px', scrollbarWidth: 'none',
          }}>
            <Chip active={!activeCat} onClick={() => setActiveCat(null)}>All</Chip>
            {cats.map(c => (
              <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(activeCat === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}

        {red.length   > 0 && <Section title="Use today" count={red.length}   tone="red"  >{rows(red)}</Section>}
        {amber.length > 0 && <Section title="Use soon"  count={amber.length} tone="amber">{rows(amber)}</Section>}
        {green.length > 0 && <Section title="Fresh"     count={green.length} tone="green">{rows(green)}</Section>}

        {fridge.length === 0 && (
          <EmptyState
            icon="fridge"
            title="Your fridge is empty"
            body="Add what you have at home to track expiry dates and get recipe ideas."
          />
        )}
      </div>
    </div>
  );
}

export function ItemForm({ open, onClose, onSave, editing }) {
  const [name,     setName]     = useState('');
  const [qty,      setQty]      = useState('1');
  const [cat,      setCat]      = useState('Other');
  const [days,     setDays]     = useState(3);
  const [scanning, setScanning] = useState(false);
  const [scanned,  setScanned]  = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name || '');
      setQty(editing?.qty   || '1');
      setCat(editing?.cat   || 'Other');
      setDays(editing?.days ?? 3);
      setScanning(false);
      setScanned(false);
    }
  }, [open, editing]);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      const picks = [
        { name: 'Semi-skimmed milk',  cat: 'Dairy',       qty: '2 L'   },
        { name: 'Cherry tomatoes',    cat: 'Fruit & Veg', qty: '250 g' },
        { name: 'Greek yogurt',       cat: 'Dairy',       qty: '500 g' },
        { name: 'Chicken thighs',     cat: 'Protein',     qty: '600 g' },
      ];
      const p = picks[Math.floor(Math.random() * picks.length)];
      setName(p.name); setCat(p.cat); setQty(p.qty);
      setScanning(false); setScanned(true);
    }, 1700);
  };

  const valid = name.trim().length > 0;
  const f = freshness(days);

  return (
    <Sheet open={open} onClose={onClose} maxHeight="92%">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
        <button onClick={onClose} style={ghostBtn}>Cancel</button>
        <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)' }}>
          {editing ? 'Edit item' : 'Add item'}
        </span>
        <button
          onClick={() => valid && onSave({ name: name.trim(), qty, cat, days })}
          style={{ ...ghostBtn, color: valid ? 'var(--green-ink)' : 'var(--ink-3)', fontWeight: 750 }}
        >
          Save
        </button>
      </div>

      <div style={{ overflowY: 'auto', padding: '4px 20px 28px' }}>
        {!editing && (
          <div style={{ marginBottom: 16 }}>
            {!scanning ? (
              <button onClick={runScan} style={{
                width: '100%', height: 56, borderRadius: 16, border: '1px solid var(--line)',
                background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 16px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, background: 'var(--green-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="scan" size={21} color="var(--green-ink)" strokeWidth={1.9} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>Scan barcode</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Auto-fill name from Open Food Facts</div>
                </div>
                <Icon name="chevR" size={18} color="var(--ink-3)" strokeWidth={2} />
              </button>
            ) : (
              <div style={{
                height: 150, borderRadius: 18, background: '#10221B', position: 'relative',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 180, height: 90, border: '2px solid rgba(255,255,255,.45)',
                  borderRadius: 12, position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'var(--green)', boxShadow: '0 0 12px var(--green)',
                    animation: 'cmf-scan 1.4s ease-in-out infinite',
                  }} />
                </div>
                <span style={{
                  position: 'absolute', bottom: 14, color: 'rgba(255,255,255,.7)',
                  fontSize: 13, fontFamily: 'var(--mono)',
                }}>
                  Looking up product…
                </span>
              </div>
            )}
            {scanned && (
              <div style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 7,
                color: 'var(--green-ink)', fontSize: 13.5, fontWeight: 600,
              }}>
                <Icon name="check" size={16} color="var(--green-ink)" strokeWidth={2.4} />
                Product found — review the details below
              </div>
            )}
          </div>
        )}

        <Field label="Item name">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Baby spinach"
            style={inputStyle}
          />
        </Field>

        <Field label="Quantity">
          <input
            value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="1 bag"
            style={inputStyle}
          />
        </Field>

        <Field label="Category">
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            margin: '0 -20px', padding: '0 20px 4px',
          }}>
            {CATS.map(c => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
            ))}
          </div>
        </Field>

        <Field label="Expires">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {EXPIRY_PRESETS.map(p => (
              <Chip key={p.label} active={days === p.days} onClick={() => setDays(p.days)}>
                {p.label}
              </Chip>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 14, padding: '10px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="calendar" size={20} color="var(--ink-3)" strokeWidth={1.8} />
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)' }}>
                  {dateFromDays(days)}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
                  {f.tone === 'red'
                    ? (days < 0 ? 'Already expired' : 'Expires today')
                    : `in ${days} day${days === 1 ? '' : 's'}`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Stepper onClick={() => setDays(d => Math.max(-2, d - 1))} icon="minus" />
              <Stepper onClick={() => setDays(d => d + 1)}               icon="plus"  />
            </div>
          </div>
        </Field>
      </div>
    </Sheet>
  );
}

export function ItemDetail({ item, onClose, onEdit, onDelete, onCookWith, onRebuy }) {
  if (!item) return null;
  const f      = freshness(item.days);
  const macros = getMacros(item.name);
  const statusLabel = f.label === 'Expired' || f.label === 'Today' ? f.label : `In ${f.label}`;
  return (
    <Sheet open={!!item} onClose={onClose}>
      <div style={{ padding: '8px 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <ItemThumb cat={item.cat} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.3 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 2 }}>
              {item.qty} · {item.cat}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <Card pad={13} style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 650, color: 'var(--ink-3)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Status
            </div>
            <StatusPill tone={f.tone} label={statusLabel} />
          </Card>
          <Card pad={13} style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 650, color: 'var(--ink-3)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Expiry date
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>
              {dateFromDays(item.days)}
            </div>
          </Card>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn full variant="primary" icon="bowl" onClick={() => onCookWith(item)}>
            Find a recipe with this
          </Btn>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn full variant="secondary" icon="edit"   onClick={() => onEdit(item)}>Edit</Btn>
            <Btn full variant="secondary" icon="basket" onClick={() => onRebuy(item)}>Re-buy</Btn>
          </div>
          <Btn full variant="danger" icon="trash" onClick={() => onDelete(item)}>
            Remove from fridge
          </Btn>
        </div>
      </div>
    </Sheet>
  );
}
