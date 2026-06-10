import { useState, Fragment } from 'react';
import { DIET_FILTERS } from '../data';
import { Icon } from '../icons';
import {
  Header, Btn, Chip, Card, Macros, Sheet, StatusPill, AdBanner,
  SegTabs, EmptyState, ghostBtn,
} from '../ui';

const vegTag = {
  fontSize: 11.5, fontWeight: 650, color: 'var(--green-ink)', background: 'var(--green-soft)',
  padding: '3px 9px', borderRadius: 99,
};

function RecipeCard({ recipe, saved, onSave, onOpen }) {
  return (
    <Card pad={0} style={{ overflow: 'hidden' }} onClick={() => onOpen(recipe)}>
      <div style={{
        height: 84, background: 'linear-gradient(135deg, #EAF3EC 0%, #E1EEE5 100%)',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="bowl" size={36} color="#A9C6B2" strokeWidth={1.5} />
        {recipe.expiringUsed > 0 && (
          <span style={{ position: 'absolute', top: 11, left: 12 }}>
            <StatusPill tone="green" label={`Uses ${recipe.expiringUsed} expiring`} size="sm" />
          </span>
        )}
        <button onClick={e => { e.stopPropagation(); onSave(recipe); }} style={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 11,
          background: 'rgba(255,255,255,.86)', border: 'none', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)',
        }}>
          <Icon name="heart" size={19} color={saved ? 'var(--red)' : 'var(--ink-3)'} fill={saved} strokeWidth={1.9} />
        </button>
      </div>
      <div style={{ padding: 15 }}>
        <div style={{ fontSize: 17.5, fontWeight: 750, color: 'var(--ink)', letterSpacing: -0.2, marginBottom: 4 }}>
          {recipe.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="clock" size={15} color="var(--ink-3)" strokeWidth={1.9} />{recipe.prep} min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="bowl" size={15} color="var(--ink-3)" strokeWidth={1.9} />Uses {recipe.uses.length} of your items
          </span>
        </div>
        {recipe.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {recipe.tags.map(t => <span key={t} style={vegTag}>{t}</span>)}
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 10 }}>
          <Macros macros={recipe.macros} compact />
        </div>
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <div className="cmf-shimmer" style={{ height: 84, background: 'var(--line-2)' }} />
      <div style={{ padding: 15 }}>
        <div className="cmf-shimmer" style={{ height: 18, width: '65%', borderRadius: 6, background: 'var(--line-2)', marginBottom: 10 }} />
        <div className="cmf-shimmer" style={{ height: 12, width: '45%', borderRadius: 6, background: 'var(--line-2)', marginBottom: 16 }} />
        <div className="cmf-shimmer" style={{ height: 40, borderRadius: 8, background: 'var(--line-2)' }} />
      </div>
    </Card>
  );
}

export default function RecipesScreen({
  fridge, generated, generating, hasGenerated,
  onGenerate, filters, onToggleFilter,
  saved, onToggleSave, onOpenRecipe, savedIds,
}) {
  const [tab, setTab]   = useState('fridge');
  const enoughItems     = fridge.length >= 3;

  return (
    <div style={{ paddingBottom: 120 }}>
      <Header title="Recipes" subtitle="From your fridge" />
      <div style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: 18 }}>
          <SegTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'fridge', label: 'For your fridge' },
              { value: 'saved',  label: 'Saved', count: saved.length },
            ]}
          />
        </div>

        {tab === 'fridge' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 9 }}>Dietary preferences</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DIET_FILTERS.map(d => (
                  <Chip key={d} active={filters.includes(d)} onClick={() => onToggleFilter(d)} icon={filters.includes(d) ? 'check' : undefined}>
                    {d}
                  </Chip>
                ))}
              </div>
            </div>

            {!hasGenerated && !generating && (
              <Card pad={22} style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 17, background: 'var(--green-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                }}>
                  <Icon name="bowl" size={28} color="var(--green-ink)" strokeWidth={1.7} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 750, color: 'var(--ink)', marginBottom: 6, letterSpacing: -0.2 }}>
                  Three recipes, no waste
                </div>
                <div style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.45, maxWidth: 270, margin: '0 auto 18px' }}>
                  We'll suggest meals using only what's in your fridge{filters.length > 0 ? `, ${filters.join(' and ').toLowerCase()}` : ''}.
                </div>
                <Btn full size="lg" variant="primary" icon="bowl" disabled={!enoughItems} onClick={onGenerate}>
                  {enoughItems ? 'Generate recipes' : 'Add at least 3 items'}
                </Btn>
                {!enoughItems && (
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 10 }}>
                    You have {fridge.length} item{fridge.length === 1 ? '' : 's'} — add a few more to generate.
                  </div>
                )}
              </Card>
            )}

            {generating && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, color: 'var(--ink-2)', fontSize: 14.5, fontWeight: 600, padding: '4px 0 16px' }}>
                  <span className="cmf-spin" style={{ width: 17, height: 17, borderRadius: 99, border: '2px solid var(--line)', borderTopColor: 'var(--green)', display: 'inline-block' }} />
                  Reading your fridge…
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
                </div>
              </div>
            )}

            {hasGenerated && !generating && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>3 recipes for you</span>
                  <button onClick={onGenerate} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green-ink)', fontWeight: 700, fontSize: 14 }}>
                    <Icon name="flame" size={16} color="var(--green-ink)" strokeWidth={2} /> Regenerate
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {generated.map((r, i) => (
                    <Fragment key={r.id}>
                      <RecipeCard recipe={r} saved={savedIds.has(r.id)} onSave={onToggleSave} onOpen={onOpenRecipe} />
                      {i === 0 && <AdBanner label="Ad" />}
                    </Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color: 'var(--ink-3)', fontSize: 13 }}>
              <Icon name="shield" size={15} color="var(--ink-3)" strokeWidth={1.8} />
              Saved recipes are available offline · {saved.length}/20
            </div>
            {saved.length === 0 ? (
              <EmptyState icon="heart" title="No saved recipes yet" body="Tap the heart on any recipe to keep it here — even without a connection." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {saved.map(r => (
                  <RecipeCard key={r.id} recipe={r} saved onSave={onToggleSave} onOpen={onOpenRecipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function RecipeDetail({ recipe, fridge, saved, onClose, onSave, onAddMissing }) {
  if (!recipe) return null;

  return (
    <Sheet open={!!recipe} onClose={onClose} maxHeight="94%">
      <div style={{ overflowY: 'auto' }}>
        <div style={{
          height: 150, background: 'linear-gradient(135deg, #EAF3EC 0%, #DCEBE1 100%)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bowl" size={56} color="#A2C2AC" strokeWidth={1.4} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, left: 16, width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,.9)', border: 'none', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon name="chevD" size={20} color="var(--ink)" strokeWidth={2.2} />
          </button>
          <button onClick={() => onSave(recipe)} style={{
            position: 'absolute', top: 14, right: 16, width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,.9)', border: 'none', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon name="heart" size={20} color={saved ? 'var(--red)' : 'var(--ink-2)'} fill={saved} strokeWidth={1.9} />
          </button>
        </div>

        <div style={{ padding: '18px 20px 30px' }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.4, color: 'var(--ink)' }}>
            {recipe.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: 'var(--ink-3)', margin: '8px 0 16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="clock" size={16} color="var(--ink-3)" strokeWidth={1.9} />{recipe.prep} min
            </span>
            <span>Serves {recipe.serves}</span>
            {recipe.tags.map(t => (
              <span key={t} style={vegTag}>{t}</span>
            ))}
          </div>
          <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)' }}>{recipe.blurb}</p>

          <Card pad={6} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, padding: '7px 10px 0' }}>
              Per serving
            </div>
            <Macros macros={recipe.macros} />
          </Card>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 750, color: 'var(--ink)', marginBottom: 10 }}>From your fridge</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recipe.uses.map(u => (
                <span key={u} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '7px 12px', borderRadius: 11 }}>
                  <Icon name="check" size={15} color="var(--green-ink)" strokeWidth={2.4} />{u}
                </span>
              ))}
            </div>
          </div>

          {recipe.missing.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 750, color: 'var(--ink)' }}>You'll also need</span>
                <button onClick={() => onAddMissing(recipe)} style={{ ...ghostBtn, fontSize: 13.5, fontWeight: 700, color: 'var(--green-ink)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="plus" size={15} color="var(--green-ink)" strokeWidth={2.4} />Add to shopping
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recipe.missing.map(m => (
                  <span key={m} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--line)', padding: '7px 12px', borderRadius: 11 }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 15, fontWeight: 750, color: 'var(--ink)', marginBottom: 12 }}>Method</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {recipe.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 13 }}>
                  <div style={{ width: 27, height: 27, borderRadius: 99, background: 'var(--green-soft)', color: 'var(--green-ink)', fontSize: 14, fontWeight: 750, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink)', paddingTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <Btn full size="lg" variant={saved ? 'soft' : 'primary'} icon="heart" onClick={() => onSave(recipe)}>
              {saved ? 'Saved to your recipes' : 'Save recipe'}
            </Btn>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
