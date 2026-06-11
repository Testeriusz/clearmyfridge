import { useState } from 'react'
import { supabase } from '../supabaseClient'

const GREEN      = '#1D9E75'
const GREEN_SOFT = '#E8F5F0'
const GREEN_INK  = '#0E6B4F'
const LINE       = '#E8EAE6'
const INK        = '#161C19'
const INK_2      = '#4B5754'
const INK_3      = '#8A9490'
const RED        = '#E53935'
const RED_INK    = '#B71C1C'
const SURFACE    = '#FFFFFF'

function Field({ icon, type = 'text', value, onChange, placeholder, autoComplete, trailing, invalid }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11, height: 56, padding: '0 14px',
      background: SURFACE, borderRadius: 16,
      border: `1px solid ${invalid ? RED : focus ? GREEN : LINE}`,
      boxShadow: focus ? `0 0 0 3px ${GREEN_SOFT}` : '0 1px 2px rgba(20,30,24,.04)',
      transition: 'border-color .15s, box-shadow .15s',
    }}>
      <FieldIcon name={icon} color={invalid ? RED : focus ? GREEN_INK : INK_3} />
      <input
        type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'inherit', fontSize: 16, fontWeight: 550, color: INK,
        }}
      />
      {trailing}
    </div>
  )
}

function FieldIcon({ name, color }) {
  const s = { width: 20, height: 20, strokeWidth: 1.8, stroke: color, fill: 'none', flexShrink: 0 }
  if (name === 'mail') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>
  )
  if (name === 'lock') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  )
  return null
}

function EyeIcon({ off }) {
  const s = { width: 20, height: 20, strokeWidth: 1.7, stroke: INK_3, fill: 'none' }
  if (off) return (
    <svg viewBox="0 0 24 24" style={s}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  )
  return (
    <svg viewBox="0 0 24 24" style={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width={32} height={32} strokeWidth={1.8} stroke="#fff" fill="none">
      <path d="M12 22s8-4 8-12c0-4-4-8-8-8S4 6 4 10c0 8 8 12 8 12z"/>
      <path d="M12 22V10"/>
    </svg>
  )
}

function GoogleG() {
  return (
    <svg width={20} height={20} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.314 0-9.822-3.415-11.425-8.205l-6.494 5.007C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

function SegTabs({ value, onChange }) {
  const tabs = [{ v: 'signin', l: 'Sign in' }, { v: 'signup', l: 'Create account' }]
  return (
    <div style={{ display: 'flex', background: '#F0F2EF', border: `1px solid ${LINE}`, borderRadius: 13, padding: 4, gap: 4 }}>
      {tabs.map(t => {
        const active = t.v === value
        return (
          <button key={t.v} onClick={() => onChange(t.v)} style={{
            flex: 1, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: active ? SURFACE : 'transparent',
            color: active ? INK : INK_3,
            fontFamily: 'inherit', fontSize: 14.5, fontWeight: 650,
            boxShadow: active ? '0 1px 2px rgba(20,30,24,.08)' : 'none',
            transition: 'background .15s, color .15s',
          }}>
            {t.l}
          </button>
        )
      })}
    </div>
  )
}

export default function Login() {
  const [mode, setMode]           = useState('signin')
  const [email, setEmail]         = useState('')
  const [pw, setPw]               = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [touched, setTouched]     = useState(false)
  const [busy, setBusy]           = useState(null)
  const [error, setError]         = useState(null)
  const [resetSent, setResetSent] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const pwOk    = pw.length >= 8
  const formOk  = emailOk && pwOk

  async function handleGoogle() {
    if (busy) return
    setError(null)
    setBusy('google')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) { setError(error.message); setBusy(null) }
  }

  async function handleSubmit() {
    setTouched(true)
    if (!formOk || busy) return
    setBusy('email')
    setError(null)
    const { error } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password: pw })
      : await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) { setError(error.message); setBusy(null) }
  }

  async function handleForgot() {
    setTouched(true)
    if (!emailOk || busy) return
    setBusy('email')
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    setBusy(null)
    if (error) setError(error.message)
    else setResetSent(true)
  }

  function switchMode(v) { setMode(v); setTouched(false); setError(null) }

  if (mode === 'forgot') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '0 28px', background: '#F6F7F4' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(29,158,117,.3)' }}>
              <LeafIcon />
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: INK }}>Reset password</h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: INK_2 }}>We'll send a link to your email.</p>
          </div>
          <div style={{ background: SURFACE, borderRadius: 24, boxShadow: '0 1px 3px rgba(20,30,24,.06)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {resetSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📧</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: INK, margin: 0 }}>Check your email</p>
                <p style={{ fontSize: 14, color: INK_2, marginTop: 6 }}>Reset link sent to <strong>{email}</strong></p>
              </div>
            ) : (
              <>
                <Field icon="mail" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" invalid={touched && !emailOk} />
                {touched && !emailOk && <p style={{ fontSize: 12.5, color: RED_INK, margin: '-6px 0 0', paddingLeft: 4 }}>Enter a valid email address</p>}
                {error && <p style={{ fontSize: 13, color: RED_INK, background: '#FEF2F2', borderRadius: 10, padding: '8px 12px', margin: 0 }}>{error}</p>}
                <button onClick={handleForgot} disabled={!!busy} style={{ height: 56, borderRadius: 17, background: GREEN, color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 17, fontWeight: 650, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(16,107,78,.25), 0 6px 16px rgba(29,158,117,.22)' }}>
                  {busy ? 'Sending…' : 'Send reset link'}
                </button>
              </>
            )}
            <button onClick={() => { setMode('signin'); setTouched(false); setError(null); setResetSent(false) }} style={{ background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 650, color: GREEN_INK, cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}>
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '0 28px', background: '#F6F7F4' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(29,158,117,.3)' }}>
            <LeafIcon />
          </div>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, letterSpacing: -0.5, color: INK }}>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 15.5, color: INK_2 }}>
            {mode === 'signin' ? 'Sign in to pick up where you left off.' : 'Track your fridge and waste less food.'}
          </p>
        </div>

        <div style={{ background: SURFACE, borderRadius: 24, boxShadow: '0 1px 3px rgba(20,30,24,.06)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SegTabs value={mode} onChange={switchMode} />

          <button onClick={handleGoogle} disabled={!!busy} style={{
            height: 56, borderRadius: 16, border: `1px solid ${LINE}`, background: SURFACE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11,
            cursor: busy ? 'default' : 'pointer', opacity: busy && busy !== 'google' ? 0.5 : 1,
            fontFamily: 'inherit', fontSize: 16.5, fontWeight: 650, color: INK,
            boxShadow: '0 1px 2px rgba(20,30,24,.05)',
          }}>
            {busy === 'google'
              ? <span style={{ width: 19, height: 19, borderRadius: 99, border: `2.5px solid ${LINE}`, borderTopColor: GREEN, display: 'inline-block', animation: 'cmf-spin 0.7s linear infinite' }} />
              : <GoogleG />}
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, height: 1, background: LINE }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: INK_3 }}>or with email</span>
            <span style={{ flex: 1, height: 1, background: LINE }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field icon="mail" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" invalid={touched && !emailOk} />
            <Field
              icon="lock" type={showPw ? 'text' : 'password'} value={pw} onChange={setPw}
              placeholder={mode === 'signup' ? 'Create a password (8+ chars)' : 'Password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              invalid={touched && !pwOk}
              trailing={
                <button onClick={() => setShowPw(s => !s)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <EyeIcon off={showPw} />
                </button>
              }
            />
            <div style={{ minHeight: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, fontWeight: 550, color: RED_INK }}>
                {touched && !emailOk ? 'Enter a valid email address'
                  : touched && !pwOk ? 'Password must be at least 8 characters'
                  : ''}
              </span>
              {mode === 'signin' && (
                <button onClick={() => switchMode('forgot')} style={{ border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 650, color: GREEN_INK, cursor: 'pointer', padding: '2px 0' }}>
                  Forgot password?
                </button>
              )}
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: RED_INK, background: '#FEF2F2', borderRadius: 10, padding: '8px 12px', margin: 0 }}>{error}</p>}

          <button onClick={handleSubmit} disabled={busy === 'email'} style={{
            height: 56, borderRadius: 17, background: GREEN, color: '#fff', border: 'none',
            fontFamily: 'inherit', fontSize: 17, fontWeight: 650,
            cursor: busy === 'email' ? 'default' : 'pointer', opacity: busy === 'email' ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(16,107,78,.25), 0 6px 16px rgba(29,158,117,.22)',
          }}>
            {busy === 'email'
              ? <span style={{ width: 19, height: 19, borderRadius: 99, border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'cmf-spin 0.7s linear infinite' }} />
              : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: 12, color: INK_3, textAlign: 'center', lineHeight: 1.55 }}>
          By continuing you agree to our{' '}
          <span style={{ color: INK_2, fontWeight: 600 }}>Terms</span> and{' '}
          <span style={{ color: INK_2, fontWeight: 600 }}>Privacy Policy</span>.
        </p>
      </div>
      <style>{`@keyframes cmf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
