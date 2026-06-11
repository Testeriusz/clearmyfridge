import { useState, useMemo } from 'react';
import { Icon } from '../icons';
import { Btn, SegTabs, ghostBtn } from '../ui';

const GOAL_OPTIONS = [
  { key: 'lose',     icon: 'flame',    title: 'Lose weight',     body: 'A gentle calorie deficit',       adj: -0.18 },
  { key: 'maintain', icon: 'heart',    title: 'Maintain weight', body: 'Stay where you are',              adj: 0 },
  { key: 'muscle',   icon: 'dumbbell', title: 'Build muscle',    body: 'Lean gains, higher protein',      adj: 0.12 },
  { key: 'healthy',  icon: 'leaf',     title: 'Eat healthier',   body: 'Better food, no calorie maths',   adj: null },
];

const ACTIVITY = [
  { value: 'low',    label: 'Low',    mult: 1.35 },
  { value: 'medium', label: 'Medium', mult: 1.55 },
  { value: 'high',   label: 'High',   mult: 1.75 },
];

// macro splits (% of kcal) by goal
const MACRO_SPLIT = {
  lose:     { protein: 0.35, fat: 0.30, carbs: 0.35 },
  maintain: { protein: 0.25, fat: 0.30, carbs: 0.45 },
  muscle:   { protein: 0.35, fat: 0.25, carbs: 0.40 },
  healthy:  { protein: 0.25, fat: 0.30, carbs: 0.45 },
};

function MetricInput({ label, value, onChange, unit, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--ink-3)', marginBottom: 6, letterSpacing: 0.1 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, height: 50, padding: '0 13px',
        background: 'var(--surface)', borderRadius: 14,
        border: `1px solid ${focus ? 'var(--green)' : 'var(--line)'}`,
        boxShadow: focus ? '0 0 0 3px var(--green-soft)' : '0 1px 2px rgba(20,30,24,.04)',
        transition: 'border-color .15s, box-shadow .15s',
      }}>
        <input
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'inherit', fontSize: 17, fontWeight: 650, color: 'var(--ink)',
          }}
        />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)', flexShrink: 0 }}>{unit}</span>
      </div>
    </div>
  );
}

export default function GoalsScreen({ onContinue, onSkip }) {
  const [goal,     setGoal]     = useState(null);
  const [sex,      setSex]      = useState('female');
  const [age,      setAge]      = useState('');
  const [height,   setHeight]   = useState('');
  const [weight,   setWeight]   = useState('');
  const [activity, setActivity] = useState('medium');

  const needsMetrics = goal && goal !== 'healthy';
  const metricsReady = age && height && weight;

  const target = useMemo(() => {
    if (!needsMetrics || !metricsReady) return null;
    const a = +age, h = +height, w = +weight;
    const bmr  = 10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161);
    const mult = ACTIVITY.find(x => x.value === activity).mult;
    const adj  = GOAL_OPTIONS.find(g => g.key === goal).adj;
    return Math.round((bmr * mult * (1 + adj)) / 10) * 10;
  }, [needsMetrics, metricsReady, age, height, weight, sex, activity, goal]);

  const canContinue = goal && (goal === 'healthy' || metricsReady);

  const handleContinue = () => {
    if (!canContinue) return;
    const kcal = target ?? 2000;
    const split = MACRO_SPLIT[goal];
    const protein = Math.round(kcal * split.protein / 4 / 5) * 5;
    const fat     = Math.round(kcal * split.fat     / 9 / 5) * 5;
    const carbs   = Math.round(kcal * split.carbs   / 4 / 5) * 5;
    onContinue({ goal, kcal, protein, fat, carbs });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90, background: 'var(--app-bg)',
      display: 'flex', flexDirection: 'column', animation: 'cmf-fade .3s ease',
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '56px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11, background: 'var(--green-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="target" size={19} color="var(--green-ink)" strokeWidth={1.8} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--green-ink)', letterSpacing: 0.2 }}>YOUR GOAL</span>
        </div>
        <button onClick={onSkip} style={{ ...ghostBtn, fontSize: 15, color: 'var(--ink-3)' }}>Skip</button>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 12px' }}>
        <h2 style={{ margin: 0, fontSize: 25, fontWeight: 800, letterSpacing: -0.4, color: 'var(--ink)' }}>
          What brings you here?
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: 15.5, lineHeight: 1.5, color: 'var(--ink-2)' }}>
          We'll tune recipe suggestions and macro targets to match. You can change this anytime in Settings.
        </p>

        {/* goal cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          {GOAL_OPTIONS.map(g => {
            const on = goal === g.key;
            return (
              <button key={g.key} onClick={() => setGoal(g.key)} style={{
                display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
                padding: 14, borderRadius: 18, cursor: 'pointer',
                background: on ? '#E4F2EB' : 'var(--surface)',
                border: `1.5px solid ${on ? 'var(--green)' : 'var(--line)'}`,
                boxShadow: on ? '0 0 0 3px var(--green-soft)' : '0 1px 2px rgba(20,30,24,.04)',
                transition: 'background .15s, border-color .15s, box-shadow .15s',
                WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: on ? 'var(--green)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s',
                }}>
                  <Icon name={g.icon} size={24} color={on ? '#fff' : 'var(--ink-2)'} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16.5, fontWeight: 750, color: 'var(--ink)' }}>{g.title}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', marginTop: 1 }}>{g.body}</div>
                </div>
                <div style={{
                  width: 23, height: 23, borderRadius: 99, flexShrink: 0,
                  border: `2px solid ${on ? 'var(--green)' : 'var(--line)'}`,
                  background: on ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {on && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* metrics — only for weight-related goals */}
        {needsMetrics && (
          <div style={{ marginTop: 22, animation: 'cmf-fade .3s ease' }}>
            <div style={{ fontSize: 13.5, fontWeight: 750, color: 'var(--ink-2)', marginBottom: 12, letterSpacing: 0.1 }}>
              A few numbers for your daily target
            </div>

            <div style={{ marginBottom: 14 }}>
              <SegTabs
                value={sex}
                onChange={setSex}
                tabs={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <MetricInput label="Age"    value={age}    onChange={setAge}    unit="yrs" placeholder="—" />
              <MetricInput label="Height" value={height} onChange={setHeight} unit="cm"  placeholder="—" />
              <MetricInput label="Weight" value={weight} onChange={setWeight} unit="kg"  placeholder="—" />
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 650, color: 'var(--ink-3)', marginBottom: 6, letterSpacing: 0.1 }}>
                Activity level
              </div>
              <SegTabs value={activity} onChange={setActivity} tabs={ACTIVITY} />
            </div>

            {/* live target card */}
            <div style={{
              marginTop: 16, padding: '16px 18px', borderRadius: 18,
              background: target ? 'var(--ink)' : 'var(--surface-2)',
              border: target ? 'none' : '1px dashed var(--line)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'background .2s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                background: target ? 'rgba(255,255,255,.12)' : 'var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="flame" size={23} color={target ? '#fff' : 'var(--ink-3)'} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: target ? 'rgba(255,255,255,.7)' : 'var(--ink-3)', letterSpacing: 0.2 }}>
                  ESTIMATED DAILY TARGET
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: target ? '#fff' : 'var(--ink-3)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                  {target ? `${target.toLocaleString()} kcal` : 'Fill in the numbers'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div style={{ padding: '12px 24px 38px', flexShrink: 0, background: 'var(--app-bg)', borderTop: '1px solid var(--line)' }}>
        <Btn full size="lg" variant="primary" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Btn>
      </div>
    </div>
  );
}
