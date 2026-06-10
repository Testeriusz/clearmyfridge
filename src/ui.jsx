import { useState, useEffect } from 'react';
import { Icon } from './icons';

const TONE = {
  green: { soft: 'var(--green-soft)', ink: 'var(--green-ink)', solid: 'var(--green)' },
  amber: { soft: 'var(--amber-soft)', ink: 'var(--amber-ink)', solid: 'var(--amber)' },
  red:   { soft: 'var(--red-soft)',   ink: 'var(--red-ink)',   solid: 'var(--red)'   },
};

export const CAT_THUMB = {
  Produce:   { bg: '#E8F2E8', fg: '#4B7A4F', icon: 'leaf'   },
  Dairy:     { bg: '#EEF1F4', fg: '#5E6B7A', icon: 'drop'   },
  Protein:   { bg: '#F3EDE5', fg: '#8A6A45', icon: 'egg'    },
  Pantry:    { bg: '#F1EEE7', fg: '#7A7158', icon: 'flame'  },
  Bakery:    { bg: '#F4EEE2', fg: '#8A7142', icon: 'flame'  },
  Drinks:    { bg: '#E7F1F0', fg: '#4E7C77', icon: 'drop'   },
  Leftovers: { bg: '#EEEFEA', fg: '#6B7064', icon: 'bowl'   },
  Other:     { bg: '#EEEFEA', fg: '#6B7064', icon: 'basket' },
};

export function ItemThumb({ cat, size = 44 }) {
  const t = CAT_THUMB[cat] || CAT_THUMB.Other;
  return (
    <div style={{
      width: size, height: size, borderRadius: 13, background: t.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon name={t.icon} size={size * 0.5} color={t.fg} strokeWidth={1.7} />
    </div>
  );
}

export function StatusPill({ tone, label, size = 'md' }) {
  const c = TONE[tone];
  const pad = size === 'sm' ? '2px 8px 2px 7px' : '4px 10px 4px 9px';
  const fs = size === 'sm' ? 12 : 13;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, background: c.soft,
      color: c.ink, padding: pad, borderRadius: 99, fontSize: fs, fontWeight: 600,
      letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: c.solid }} />
      {label}
    </span>
  );
}

export function Btn({ children, variant = 'primary', full = false, disabled = false, onClick, icon, size = 'md', style = {} }) {
  const sizes = {
    sm: { h: 40, fs: 15,   px: 16, r: 13 },
    md: { h: 52, fs: 16.5, px: 20, r: 16 },
    lg: { h: 56, fs: 17,   px: 22, r: 17 },
  }[size];
  const variants = {
    primary:   { bg: 'var(--green)',      color: '#fff',          border: 'none',                    shadow: '0 1px 2px rgba(16,107,78,.25), 0 6px 16px rgba(29,158,117,.22)' },
    secondary: { bg: 'var(--surface)',    color: 'var(--ink)',    border: '1px solid var(--line)',    shadow: '0 1px 2px rgba(20,30,24,.04)' },
    soft:      { bg: 'var(--green-soft)', color: 'var(--green-ink)', border: 'none',                 shadow: 'none' },
    ghost:     { bg: 'transparent',       color: 'var(--ink-2)', border: 'none',                    shadow: 'none' },
    danger:    { bg: 'var(--red-soft)',   color: 'var(--red-ink)', border: 'none',                  shadow: 'none' },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        height: sizes.h, padding: `0 ${sizes.px}px`, borderRadius: sizes.r,
        background: variants.bg, color: variants.color, border: variants.border,
        boxShadow: disabled ? 'none' : variants.shadow,
        fontFamily: 'inherit', fontSize: sizes.fs, fontWeight: 650, letterSpacing: 0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        width: full ? '100%' : undefined, cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1, transition: 'transform .12s, opacity .15s, box-shadow .15s',
        WebkitTapHighlightColor: 'transparent', ...style,
      }}
      onPointerDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.975)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 18 : 20} color={variants.color} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function Chip({ children, active = false, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      height: 38, padding: '0 15px', borderRadius: 99,
      background: active ? 'var(--green)' : 'var(--surface)',
      color: active ? '#fff' : 'var(--ink-2)',
      border: active ? '1px solid var(--green)' : '1px solid var(--line)',
      fontFamily: 'inherit', fontSize: 14.5, fontWeight: 600, letterSpacing: 0.1,
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      whiteSpace: 'nowrap', transition: 'background .15s, color .15s, border-color .15s',
      WebkitTapHighlightColor: 'transparent', flexShrink: 0,
    }}>
      {icon && <Icon name={icon} size={16} color={active ? '#fff' : 'var(--ink-3)'} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function Card({ children, style = {}, pad = 16, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 20, padding: pad,
      border: '1px solid var(--line)', boxShadow: '0 1px 2px rgba(20,30,24,.03)',
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      {children}
    </div>
  );
}

export function Macros({ macros, compact = false }) {
  const items = [
    { k: 'kcal',    v: macros.kcal,    u: '' },
    { k: 'protein', v: macros.protein, u: 'g' },
    { k: 'fat',     v: macros.fat,     u: 'g' },
    { k: 'carbs',   v: macros.carbs,   u: 'g' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: compact ? 0 : 2 }}>
      {items.map((m, i) => (
        <div key={m.k} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          padding: '6px 2px',
          borderLeft: i > 0 ? '1px solid var(--line-2)' : 'none',
        }}>
          <span style={{ fontSize: compact ? 14.5 : 16, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
            {m.v}<span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>{m.u}</span>
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {m.k}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Sheet({ open, onClose, children, maxHeight = '88%' }) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(18,28,22,.34)',
        opacity: show ? 1 : 0, transition: 'opacity .28s', backdropFilter: 'blur(1.5px)',
      }} />
      <div style={{
        position: 'relative', background: 'var(--app-bg)', borderRadius: '28px 28px 0 0',
        maxHeight, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .3s cubic-bezier(.32,.72,0,1)',
        boxShadow: '0 -8px 40px rgba(18,28,22,.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <div style={{ width: 38, height: 5, borderRadius: 99, background: 'var(--line)' }} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdBanner({ label = 'Sponsored' }) {
  return (
    <div style={{
      borderRadius: 14, border: '1px dashed var(--line)', background: 'var(--surface-2)',
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: 'repeating-linear-gradient(135deg, #ECEEE8 0 6px, #F4F5F1 6px 12px)',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>Ad space — banner</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>320×50 · non-intrusive</div>
      </div>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase',
        letterSpacing: 0.6, border: '1px solid var(--line)', borderRadius: 5, padding: '2px 6px',
      }}>{label}</span>
    </div>
  );
}

export function SegTabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display: 'flex', background: 'var(--surface-2)', border: '1px solid var(--line)',
      borderRadius: 13, padding: 4, gap: 4,
    }}>
      {tabs.map(t => {
        const active = t.value === value;
        return (
          <button key={t.value} onClick={() => onChange(t.value)} style={{
            flex: 1, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: active ? 'var(--surface)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink-3)',
            fontFamily: 'inherit', fontSize: 14.5, fontWeight: 650,
            boxShadow: active ? '0 1px 2px rgba(20,30,24,.08)' : 'none',
            transition: 'background .15s, color .15s',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            {t.label}
            {t.count != null && (
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: active ? 'var(--green-ink)' : 'var(--ink-3)',
                background: active ? 'var(--green-soft)' : 'transparent',
                borderRadius: 99, minWidth: 18, padding: '1px 5px',
              }}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Header({ title, subtitle, right, onBack, sticky = true }) {
  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 20,
      padding: '52px 20px 12px', background: 'var(--app-bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {onBack && (
            <button onClick={onBack} style={{
              width: 38, height: 38, borderRadius: 12, border: '1px solid var(--line)',
              background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', marginLeft: -2, flexShrink: 0,
            }}>
              <Icon name="chevL" size={20} color="var(--ink)" strokeWidth={2.2} />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            {subtitle && (
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--green-ink)', marginBottom: 2 }}>
                {subtitle}
              </div>
            )}
            <h1 style={{
              margin: 0, fontSize: 30, fontWeight: 750, letterSpacing: -0.5,
              color: 'var(--ink)', lineHeight: 1.05,
            }}>
              {title}
            </h1>
          </div>
        </div>
        {right && <div style={{ flexShrink: 0, paddingBottom: 2 }}>{right}</div>}
      </div>
    </div>
  );
}

export function IconButton({ name, onClick, badge, color = 'var(--ink)' }) {
  return (
    <button onClick={onClick} style={{
      width: 42, height: 42, borderRadius: 13, border: '1px solid var(--line)',
      background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', position: 'relative', boxShadow: '0 1px 2px rgba(20,30,24,.03)',
    }}>
      <Icon name={name} size={21} color={color} strokeWidth={1.9} />
      {badge && (
        <span style={{
          position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 99,
          background: 'var(--red)', color: '#fff', fontSize: 10.5, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          border: '2px solid var(--app-bg)',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

const TABS = [
  { key: 'home',     label: 'Home',     icon: 'home'   },
  { key: 'fridge',   label: 'Fridge',   icon: 'fridge' },
  { key: 'recipes',  label: 'Recipes',  icon: 'bowl'   },
  { key: 'shopping', label: 'Shopping', icon: 'basket' },
  { key: 'alerts',   label: 'Alerts',   icon: 'bell'   },
];

export function TabBar({ active, onChange, alertCount = 0 }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      paddingTop: 9,
      background: 'rgba(246,247,244,0.86)', backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)', borderTop: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
    }}>
      {TABS.map(t => {
        const on = t.key === active;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '2px 10px', position: 'relative', WebkitTapHighlightColor: 'transparent',
            minWidth: 56,
          }}>
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} size={25} color={on ? 'var(--green)' : 'var(--ink-3)'} strokeWidth={on ? 2.1 : 1.8} />
              {t.key === 'alerts' && alertCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 99,
                  background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  border: '1.5px solid var(--app-bg)',
                }}>
                  {alertCount}
                </span>
              )}
            </div>
            <span style={{
              fontSize: 11, fontWeight: on ? 700 : 600,
              color: on ? 'var(--green)' : 'var(--ink-3)', letterSpacing: 0.1,
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', left: 16, right: 16, bottom: 96, zIndex: 65,
      background: 'var(--ink)', color: '#fff', borderRadius: 16, padding: '13px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      boxShadow: '0 10px 30px rgba(18,28,22,.32)',
      animation: 'cmf-toast .26s cubic-bezier(.32,.72,0,1)',
    }}>
      <span style={{ fontSize: 14.5, fontWeight: 550 }}>{toast.msg}</span>
      {toast.onUndo && (
        <button onClick={toast.onUndo} style={{
          border: 'none', background: 'transparent', color: 'var(--green-soft)',
          fontFamily: 'inherit', fontSize: 14.5, fontWeight: 750, cursor: 'pointer', padding: '2px 4px',
        }}>
          Undo
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, body }) {
  return (
    <div style={{
      padding: '48px 32px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 18, background: 'var(--surface)',
        border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={28} color="var(--ink-3)" strokeWidth={1.7} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
      <div style={{ fontSize: 14.5, color: 'var(--ink-2)', maxWidth: 240, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

export const ghostBtn = {
  border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
  color: 'var(--ink-2)', cursor: 'pointer', padding: '6px 2px',
};
