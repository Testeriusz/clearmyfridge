export default function OnboardingScreen({ onDone }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90, background: 'var(--app-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, gap: 24,
    }}>
      <div style={{ fontSize: 22, fontWeight: 750, color: 'var(--ink)' }}>Welcome to ClearMyFridge</div>
      <div style={{ fontSize: 16, color: 'var(--ink-2)', textAlign: 'center', lineHeight: 1.5 }}>
        Onboarding — coming soon
      </div>
      <button
        onClick={onDone}
        style={{
          marginTop: 8, height: 52, padding: '0 32px', borderRadius: 16,
          background: 'var(--green)', color: '#fff', border: 'none',
          fontFamily: 'inherit', fontSize: 16.5, fontWeight: 650, cursor: 'pointer',
        }}
      >
        Get started
      </button>
    </div>
  );
}
