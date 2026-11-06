
import { useState } from 'react'
import { api } from '../services/api'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../services/staticDemo'

function Shell({children}) {
 return <div className="login-wrap"><div className="login">
  <div className="logo" style={{padding:0}}>Sari<span>ventory</span></div>
  <h2 className="auth-title">Welcome back</h2>
  <p className="sub" style={{marginBottom:8}}>Log in to manage your store.</p>
  {children}
 </div></div>
}
export default function Login({onLogin}) {
 const [email,setEmail]=useState('')
 const [password,setPassword]=useState('')
 const [error,setError]=useState('')
 const [busy,setBusy]=useState(false)
 const submit=async e=>{
  e.preventDefault();setError('');setBusy(true)
  try{onLogin(await api('/login','POST',{email,password}))}
  catch(x){setError(x.message)}
  finally{setBusy(false)}
 }
 return <Shell>
  <form onSubmit={submit}>
   <label>Email</label><input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/>
   <label>Password</label><input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/>
   {error&&<p className="auth-err">{error}</p>}
   <button className="btn" style={{width:'100%',marginTop:18}} disabled={busy}>{busy?'Please wait…':'Log in'}</button>
  </form>
  <div className="card" style={{marginTop:18}}>
   <b>Demo accounts</b>
   <p style={{fontSize:13,color:'var(--mute)',margin:'6px 0 10px'}}>Select an account to fill the login form. You still need to press Log in.</p>
   <div style={{display:'grid',gap:6}}>
    {DEMO_ACCOUNTS.map(a=><button type="button" className="btn ghost sm" key={a.id} onClick={()=>{setEmail(a.email);setPassword(DEMO_PASSWORD);setError('')}} style={{textAlign:'left',display:'flex',justifyContent:'space-between'}}>
     <span>{a.name}</span><span>{a.roleLabel}</span>
    </button>)}
   </div>
   <p style={{fontSize:13,margin:'12px 0 0'}}>Password for all accounts: <b>{DEMO_PASSWORD}</b></p>
  </div>
 </Shell>
}
