import { Icon } from '../icons';
import { Header, Card, EmptyState } from '../ui';

function alertMessage(items, days) {
  const list = items.length === 1 ? items[0]
    : items.length === 2 ? `${items[0]} and ${items[1]}`
    : `${items[0]}, ${items[1]} and ${items.length - 2} more`;
  if (days < 0)  return `${list} ${items.length === 1 ? 'has' : 'have'} expired`;
  if (days === 0) return `${list} ${items.length === 1 ? 'expires' : 'expire'} today`;
  if (days === 1) return `${list} ${items.length === 1 ? 'expires' : 'expire'} tomorrow`;
  return `${list} ${items.length === 1 ? 'expires' : 'expire'} in ${days} days`;
}

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

export default function AlertsScreen({ alerts, onOpenRecipeById, notifOn, onSetNotifOn }) {
  const unread = alerts.filter(a => !a.read).length;

  return (
    <div style={{ paddingBottom: 120 }}>
      <Header title="Alerts" subtitle={unread > 0 ? `${unread} new` : 'Up to date'} />
      <div style={{ padding: '0 20px' }}>
        <Card pad={15} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--green-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="bell" size={20} color="var(--green-ink)" strokeWidth={1.9} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Daily expiry reminder</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>Every morning at 8:00</div>
          </div>
          <Toggle on={notifOn} onChange={onSetNotifOn} />
        </Card>

        {alerts.length === 0 ? (
          <EmptyState icon="bell" title="No alerts" body="You'll be reminded here when items are about to expire." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map(a => {
              const tone      = a.days <= 0 ? 'red' : a.days <= 3 ? 'amber' : 'green';
              const clickable = !!a.recipeId;
              return (
                <Card key={a.id} pad={0} onClick={clickable ? () => onOpenRecipeById(a.recipeId) : undefined}>
                  <div style={{ display: 'flex', gap: 13, padding: 15 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, background: `var(--${tone}-soft)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon name="clock" size={20} color={`var(--${tone}-ink)`} strokeWidth={1.9} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {!a.read && <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--green)', flexShrink: 0 }} />}
                        <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>{a.when}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginTop: 4, lineHeight: 1.35 }}>
                        {alertMessage(a.items, a.days)}
                      </div>
                      {clickable && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--green-ink)', fontSize: 13.5, fontWeight: 700 }}>
                          <Icon name="bowl" size={16} color="var(--green-ink)" strokeWidth={2} />
                          View a recipe idea
                          <Icon name="chevR" size={15} color="var(--green-ink)" strokeWidth={2.2} />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
