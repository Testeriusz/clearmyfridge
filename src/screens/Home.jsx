import { freshness } from '../data';
import { Icon } from '../icons';
import { StatusPill, Card, Macros, AdBanner } from '../ui';

function GreetingHeader({ onOpenSettings }) {
  const now   = new Date();
  const hour  = now.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const date  = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ padding: '52px 20px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 3 }}>{date}</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 750, letterSpacing: -0.5, color: 'var(--ink)' }}>{greet}</h1>
      </div>
      <button onClick={onOpenSettings} style={{
        width: 44, height: 44, borderRadius: 14, border: '1px solid var(--line)',
        background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 1px 2px rgba(20,30,24,.03)',
      }}>
        <Icon name="user" size={21} color="var(--ink)" strokeWidth={1.8} />
      </button>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ padding: '0 2px 10px' }}>
      <span style={{ fontSize: 15, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.1 }}>{children}</span>
    </div>
  );
}

function GlanceCard({ icon, label, value, onClick }) {
  return (
    <Card pad={15} onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, background: 'var(--green-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={20} color="var(--green-ink)" strokeWidth={1.9} />
      </div>
      <div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 17, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.2 }}>{value}</div>
      </div>
    </Card>
  );
}

export default function HomeScreen({ fridge, generated, shopping, onSetTab, onOpenRecipe, onOpenSettings, onOpenItem }) {
  const sorted = [...fridge].sort((a, b) => a.days - b.days);
  const urgent = sorted.filter(i => i.days <= 3);
  const today  = sorted.filter(i => i.days <= 0);
  const idea   = generated[0];
  const toBuy  = shopping.filter(s => !s.done).length;

  return (
    <div style={{ paddingBottom: 120 }}>
      <GreetingHeader onOpenSettings={onOpenSettings} />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AdBanner />

        {/* Hero — use soon */}
        <div style={{
          background: 'linear-gradient(165deg, #1F9E76 0%, #178A66 100%)',
          borderRadius: 24, padding: 20, color: '#fff',
          boxShadow: '0 1px 2px rgba(16,107,78,.2), 0 14px 30px rgba(29,158,117,.22)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: 'rgba(255,255,255,.07)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <Icon name="clock" size={17} color="rgba(255,255,255,.9)" strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 650, color: 'rgba(255,255,255,.92)', letterSpacing: 0.2 }}>USE SOON</span>
            </div>
            <div style={{ fontSize: 25, fontWeight: 750, letterSpacing: -0.4, lineHeight: 1.15, marginBottom: 4 }}>
              {urgent.length} item{urgent.length === 1 ? '' : 's'} to use in the next few days
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.82)', marginBottom: 16 }}>
              {today.length > 0
                ? `${today.length} need using today.`
                : 'Nothing expires today — nicely done.'}{' '}
              Cook before they go to waste.
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px', marginBottom: 16 }}>
              {urgent.slice(0, 6).map(it => {
                const f = freshness(it.days);
                return (
                  <button key={it.id} onClick={() => onOpenItem(it)} style={{
                    flexShrink: 0, background: 'rgba(255,255,255,.16)', borderRadius: 14, border: 'none',
                    padding: '9px 12px', textAlign: 'left', cursor: 'pointer', minWidth: 96,
                    backdropFilter: 'blur(4px)',
                  }}>
                    <div style={{ fontSize: 13.5, fontWeight: 650, color: '#fff', whiteSpace: 'nowrap' }}>{it.name}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.8)', marginTop: 3, fontWeight: 600 }}>
                      {f.label === 'Today' || f.label === 'Expired' ? f.label : 'in ' + f.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => onSetTab('recipes')} style={{
              width: '100%', height: 50, borderRadius: 15, border: 'none',
              background: '#fff', color: 'var(--green-ink)',
              fontFamily: 'inherit', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <Icon name="bowl" size={20} color="var(--green-ink)" strokeWidth={2} /> See what to cook
            </button>
          </div>
        </div>

        {/* Today's idea */}
        {idea && (
          <div>
            <SectionLabel>Today's idea</SectionLabel>
            <Card pad={0} onClick={() => onOpenRecipe(idea)} style={{ overflow: 'hidden' }}>
              <div style={{
                height: 92, background: 'linear-gradient(135deg, #EAF3EC 0%, #E2EFE6 100%)',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="bowl" size={40} color="#A9C6B2" strokeWidth={1.5} />
                <span style={{ position: 'absolute', top: 12, left: 12 }}>
                  <StatusPill tone="green" label={`Uses ${idea.expiringUsed} expiring`} size="sm" />
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 17.5, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.2, marginBottom: 4 }}>
                  {idea.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
                  <Icon name="clock" size={15} color="var(--ink-3)" strokeWidth={1.9} /> {idea.prep} min · serves {idea.serves}
                </div>
                <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 10 }}>
                  <Macros macros={idea.macros} compact />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Glance row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <GlanceCard icon="fridge"  label="In your fridge" value={`${fridge.length} items`} onClick={() => onSetTab('fridge')} />
          <GlanceCard icon="basket" label="Shopping list"  value={`${toBuy} to buy`}         onClick={() => onSetTab('shopping')} />
        </div>
      </div>
    </div>
  );
}
