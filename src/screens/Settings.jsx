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

function Row({ icon, title, detail, control, chevron, tone, onClick }) {
  const color = tone === 'red' ? 'var(--red-ink)' : 'var(--ink)';
  return (
    <button onClick={onClick} disabled={!onClick && !chevron} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px',
      background: 'transparent', border: 'none', borderBottom: '1px solid var(--line-2)',
      cursor: onClick ? 'pointer' : 'default', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
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
    </button>
  );
}

export default function SettingsScreen({ filters, onToggleFilter, notifOn, onSetNotifOn, onBack, onReplay, onSignOut, user }) {
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

        <Group title="Notifications">
          <Row title="Daily expiry reminder" detail="8:00 each morning" control={<Toggle on={notifOn} onChange={onSetNotifOn} />} />
        </Group>

        <Group title="Data & privacy">
          <Row icon="shield" title="Your data is private" detail="Only ingredient names are ever sent for recipes — never your account details." />
          <Row icon="trash" title="Delete all my data" tone="red" chevron />
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
