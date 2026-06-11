import { useState } from 'react';
import { DIET_FILTERS } from '../data';
import { Icon } from '../icons';
import { Header, Btn, Chip, Card } from '../ui';

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 50, height: 30, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? 'var(--green)' : 'var(--line)', position: 'relative',
      transition: 'background .2s', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 24, height: 24,
        borderRadius: 99, background: '#fff',
        transition: 'left .2s cubic-bezier(.32,.72,0,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

function Group({ title, caption, children }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 750, color: 'var(--ink-2)', letterSpacing: 0.3, padding: '0 6px 8px', textTransform: 'uppercase' }}>
        {title}
      </div>
      <Card pad={0}>{children}</Card>
      {caption && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', padding: '8px 6px 0', lineHeight: 1.4 }}>{caption}</div>}
    </div>
  );
}

const stepBtn = {
  width: 32, height: 32, borderRadius: 9, border: '1px solid var(--line)',
  background: 'var(--surface-2)', fontSize: 19, lineHeight: 1, color: 'var(--ink)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit', fontWeight: 400, flexShrink: 0,
};

function GoalRow({ label, unit, value, step, min = 0, onChange, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '13px 15px',
      borderBottom: last ? 'none' : '1px solid var(--line-2)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={stepBtn} onClick={() => onChange(Math.max(min, value - step))}>−</button>
        <div style={{ minWidth: 70, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{value}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 3 }}>{unit}</span>
        </div>
        <button style={stepBtn} onClick={() => onChange(value + step)}>+</button>
      </div>
    </div>
  );
}

function Row({ icon, title, detail, control, chevron, tone, onClick }) {
  const color = tone === 'red' ? 'var(--red-ink)' : 'var(--ink)';
  const Tag = control ? 'div' : 'button';
  const tagProps = control ? {} : { onClick, disabled: !onClick && !chevron };
  return (
    <Tag {...tagProps} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px',
      background: 'transparent', border: 'none', borderBottom: '1px solid var(--line-2)',
      cursor: onClick && !control ? 'pointer' : 'default', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
    }}>
      {icon && (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: tone === 'red' ? 'var(--red-soft)' : 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={18} color={tone === 'red' ? 'var(--red-ink)' : 'var(--ink-2)'} strokeWidth={1.9} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color }}>{title}</div>
        {detail && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{detail}</div>}
      </div>
      {control}
      {chevron && <Icon name="chevR" size={18} color="var(--ink-3)" strokeWidth={2} />}
    </Tag>
  );
}

export default function SettingsScreen({ filters, onToggleFilter, goals, onSetGoals, notifOn, onSetNotifOn, onBack, onReplay, onSignOut, onDeleteAllData, user }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80, background: 'var(--app-bg)',
      overflowY: 'auto', animation: 'cmf-slide-in .28s cubic-bezier(.32,.72,0,1)',
    }}>
      <Header title="Settings" onBack={onBack} />
      <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* account */}
        <Card pad={15} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 99, background: 'var(--green-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: 99, objectFit: 'cover' }} />
              : <span style={{ fontSize: 19, fontWeight: 750, color: 'var(--green-ink)' }}>{(user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()}</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{user?.user_metadata?.full_name || 'You'}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{user?.email}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 99 }}>
            Free
          </span>
        </Card>

        <Group title="Dietary preferences" caption="Applied to every recipe we generate.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 14 }}>
            {DIET_FILTERS.map(d => (
              <Chip key={d} active={filters.includes(d)} onClick={() => onToggleFilter(d)} icon={filters.includes(d) ? 'check' : undefined}>
                {d}
              </Chip>
            ))}
          </div>
        </Group>

        <Group title="Daily goals" caption="Used to size recipe recommendations and show % of goal on macro bars.">
          {goals && <>
            <GoalRow label="Calories"  unit="kcal" value={goals.kcal}    step={50} min={500} onChange={v => onSetGoals(g => ({ ...g, kcal:    v }))} />
            <GoalRow label="Protein"   unit="g"    value={goals.protein} step={5}  min={0}   onChange={v => onSetGoals(g => ({ ...g, protein: v }))} />
            <GoalRow label="Fat"       unit="g"    value={goals.fat}     step={5}  min={0}   onChange={v => onSetGoals(g => ({ ...g, fat:     v }))} />
            <GoalRow label="Carbs"     unit="g"    value={goals.carbs}   step={5}  min={0}   onChange={v => onSetGoals(g => ({ ...g, carbs:   v }))} last />
          </>}
        </Group>

        <Group title="Notifications">
          <Row title="Daily expiry reminder" detail="8:00 each morning" control={<Toggle on={notifOn} onChange={onSetNotifOn} />} />
        </Group>

        <Group title="Data & privacy">
          <Row icon="shield" title="Your data is private" detail="Only ingredient names are ever sent for recipes — never your account details." />
          {confirmDelete ? (
            <div style={{ padding: '14px 15px' }}>
              <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 12, lineHeight: 1.45 }}>
                This will permanently delete your fridge, shopping list, and saved recipes. This cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn full variant="danger" onClick={onDeleteAllData}>Delete everything</Btn>
                <Btn full variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Btn>
              </div>
            </div>
          ) : (
            <Row icon="trash" title="Delete all my data" tone="red" chevron onClick={() => setConfirmDelete(true)} />
          )}
        </Group>

        <Group title="About">
          <Row title="Replay the welcome tour" chevron onClick={onReplay} />
          <Row title="Terms & Privacy Policy" chevron />
          <Row title="Version" detail="1.0.0" />
        </Group>

        <Btn full variant="secondary" icon="logout" onClick={onSignOut} style={{ color: 'var(--red-ink)' }}>
          Sign out
        </Btn>
        <div style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink-3)' }}>
          ClearMyFridge · made to waste less
        </div>
      </div>
    </div>
  );
}
