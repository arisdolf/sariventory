import { useState } from 'react'
import { api } from '../services/api'
import Terms from '../components/Terms'

function Shell({ title, sub, children }) {
  return (
    <div className="login-wrap">
      <div className="login">
        <div className="logo" style={{ padding: 0 }}>Sari<span>ventory</span></div>
        <h2 className="auth-title">{title}</h2>
        <p className="sub" style={{ marginBottom: 8 }}>{sub}</p>
        {children}
      </div>
    </div>
  )
}
const Field = ({ label, ...props }) => <><label>{label}</label><input {...props} /></>

export default function Login({ onLogin }) {
  const [screen, setScreen] = useState('login')
  const [showTerms, setShowTerms] = useState(false)
  const [f, setF] = useState({ first_name: '', middle_name: '', last_name: '', birthdate: '', email: '', password: '', confirm: '', terms: false })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = key => e => setF(old => ({ ...old, [key]: e.target.value }))

  const signIn = async (email, password) => {
    setErr('')
    setBusy(true)
    try { onLogin(await api('/login', 'POST', { email, password })) }
    catch (e) { setErr(e.message || 'Unable to log in') }
    finally { setBusy(false) }
  }

  const submit = async e => {
    e.preventDefault()
    setErr('')
    if (screen === 'signup') {
      if (f.password !== f.confirm) return setErr('Passwords do not match')
      if (!f.terms) return setErr('Please agree to the Terms and Conditions')
      setBusy(true)
      try {
        const result = await api('/register', 'POST', f)
        onLogin(result)
      } catch (x) { setErr(x.message || 'Unable to create account') }
      finally { setBusy(false) }
    } else {
      await signIn(f.email, f.password)
    }
  }

  if (screen === 'login') return (
    <Shell title="Welcome back" sub="Log in to manage your store.">
      <form onSubmit={submit}>
        <Field label="Email" type="email" required autoComplete="username" autoFocus value={f.email} onChange={set('email')} />
        <Field label="Password" type="password" required autoComplete="current-password" value={f.password} onChange={set('password')} />
        {err && <p className="auth-err">{err}</p>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>{busy ? 'Please wait…' : 'Log in'}</button>
      </form>

      
      <p className="auth-switch">New to the store? <button type="button" className="link" onClick={() => { setErr(''); setScreen('signup') }}>Create an account</button></p>
    </Shell>
  )

  return (
    <Shell title="Create an account" sub="Your account will join the existing Sari Store as a cashier.">
      <form onSubmit={submit}>
        <div className="auth-grid">
          <div><Field label="First name" required autoFocus value={f.first_name} onChange={set('first_name')} /></div>
          <div><Field label="Last name" required value={f.last_name} onChange={set('last_name')} /></div>
        </div>
        <Field label="Middle name (optional)" value={f.middle_name} onChange={set('middle_name')} />
        <Field label="Birthdate" type="date" required max={new Date().toISOString().slice(0, 10)} value={f.birthdate} onChange={set('birthdate')} />
        <Field label="Email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} />
        <Field label="Password (at least 8 characters)" type="password" required minLength={8} autoComplete="new-password" value={f.password} onChange={set('password')} />
        <Field label="Confirm password" type="password" required autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
        <label className="check">
          <input type="checkbox" checked={f.terms} onChange={e => setF(old => ({ ...old, terms: e.target.checked }))} />
          <span>I agree to the <button type="button" className="link" onClick={() => setShowTerms(true)}>Terms and Conditions</button></span>
        </label>
        {err && <p className="auth-err">{err}</p>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy || !f.terms}>{busy ? 'Please wait…' : 'Create account'}</button>
      </form>
      <p className="auth-switch">Already have an account? <button type="button" className="link" onClick={() => { setErr(''); setScreen('login') }}>Log in</button></p>
      {showTerms && <Terms onClose={() => setShowTerms(false)} />}
    </Shell>
  )
}
