import { useState } from 'react';
import { Icon, GoogleG } from '../icons';
import { Btn, ghostBtn } from '../ui';

const STEPS = [
  { icon: 'fridge', title: "Add what's in your fridge",    body: 'Scan a barcode or type it in. ClearMyFridge keeps a calm, clear list of everything you have at home.' },
  { icon: 'bell',   title: 'Get a gentle expiry reminder', body: "Each morning we'll tell you what needs using soon — so good food never gets forgotten at the back of the fridge." },
  { icon: 'bowl',   title: 'Cook with what you have',      body: "Generate three recipes from exactly what's in your fridge, with the nutrition shown up front. No waste, no guesswork." },
];

function Overlay({ children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90, background: 'var(--app-bg)',
      display: 'flex', flexDirection: 'column', animation: 'cmf-fade .3s ease',
    }}>
      {children}
    </div>
  );
}

export default function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0); // 0 = sign-in, 1–3 = intro

  if (step === 0) {
    return (
      <Overlay>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22, background: 'var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            boxShadow: '0 10px 30px rgba(29,158,117,.3)',
          }}>
            <Icon name="leaf" size={40} color="#fff" strokeWidth={1.8} />
          </div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: -0.6, color: 'var(--ink)' }}>ClearMyFridge</h1>
          <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 280 }}>
            See what's in your fridge, what's about to expire, and what to cook with it.
          </p>
        </div>
        <div style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => setStep(1)} style={{
            height: 56, borderRadius: 16, border: '1px solid var(--line)', background: 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 16.5, fontWeight: 650, color: 'var(--ink)',
            boxShadow: '0 1px 2px rgba(20,30,24,.05)',
          }}>
            <GoogleG size={20} /> Continue with Google
          </button>
          <Btn full size="lg" variant="primary" onClick={() => setStep(1)} icon="user">
            Continue with email
          </Btn>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
            Free to use, supported by ads. By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </Overlay>
    );
  }

  const s = STEPS[step - 1];
  return (
    <Overlay>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {STEPS.map((_, i) => (
            <span key={i} style={{
              width: i === step - 1 ? 22 : 7, height: 7, borderRadius: 99,
              background: i === step - 1 ? 'var(--green)' : 'var(--line)',
              transition: 'width .25s, background .25s',
            }} />
          ))}
        </div>
        <button onClick={onDone} style={{ ...ghostBtn, fontSize: 15, color: 'var(--ink-3)' }}>Skip</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 36px', textAlign: 'center' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 30, background: 'var(--green-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28,
        }}>
          <Icon name={s.icon} size={48} color="var(--green-ink)" strokeWidth={1.6} />
        </div>
        <h2 style={{ margin: 0, fontSize: 25, fontWeight: 800, letterSpacing: -0.4, color: 'var(--ink)', maxWidth: 290 }}>
          {s.title}
        </h2>
        <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 300 }}>
          {s.body}
        </p>
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        <Btn full size="lg" variant="primary" onClick={() => step < 3 ? setStep(step + 1) : onDone()}>
          {step < 3 ? 'Next' : 'Get started'}
        </Btn>
      </div>
    </Overlay>
  );
}
