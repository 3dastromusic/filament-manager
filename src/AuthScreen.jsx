import { useState } from "react";
import api from "./api";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    try {
      let data;
      if (mode === "login") {
        data = await api.login(username.trim(), password);
      } else {
        data = await api.signup(username.trim(), password, email.trim(), displayName.trim());
      }
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  const S = {
    page: { minHeight:"100vh", background:"#0c0f14", color:"#c9d1d9", fontFamily:"'IBM Plex Sans','Segoe UI',system-ui,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    card: { background:"#111520", border:"1px solid #1e2636", borderRadius:14, padding:32, width:"100%", maxWidth:400, boxShadow:"0 20px 60px rgba(0,0,0,0.5)" },
    title: { fontSize:22, fontWeight:700, color:"#e2e8f0", display:"flex", alignItems:"center", gap:10, marginBottom:4 },
    subtitle: { fontSize:12, color:"#64748b", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.5px", marginBottom:24 },
    label: { display:"block", fontSize:11, fontWeight:600, color:"#64748b", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'JetBrains Mono',monospace" },
    input: { width:"100%", padding:"11px 12px", background:"#0c0f14", border:"1px solid #1e2636", borderRadius:7, color:"#e2e8f0", fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:14, transition:"border 0.2s" },
    button: (disabled) => ({ width:"100%", padding:"12px 20px", background: disabled ? "#1e3a5f" : "#3b82f6", color:"#fff", border:"none", borderRadius:8, fontWeight:600, fontSize:14, cursor: disabled ? "wait" : "pointer", fontFamily:"inherit", marginTop:8, opacity: disabled ? 0.7 : 1 }),
    error: { background:"#7f1d1d33", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"10px 12px", borderRadius:7, fontSize:13, marginBottom:14 },
    switchLink: { textAlign:"center", marginTop:18, fontSize:13, color:"#64748b" },
    link: { color:"#3b82f6", cursor:"pointer", fontWeight:600, background:"none", border:"none", fontFamily:"inherit", fontSize:13, padding:0 },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}><span style={{fontSize:26}}>◈</span> Filament Manager</h1>
        <p style={S.subtitle}>{mode === "login" ? "Sign in to your account" : "Create a new account"}</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={submit}>
          <label style={S.label}>Username</label>
          <input style={S.input} type="text" value={username} onChange={e => setUsername(e.target.value)}
            autoComplete="username" required autoFocus
            onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />

          {mode === "signup" && (
            <>
              <label style={S.label}>Display Name (optional)</label>
              <input style={S.input} type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="How your name appears in the app"
                onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />

              <label style={S.label}>Email (optional)</label>
              <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />
            </>
          )}

          <label style={S.label}>Password</label>
          <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"} required
            onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />

          {mode === "signup" && (
            <>
              <label style={S.label}>Confirm Password</label>
              <input style={S.input} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password" required
                onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />
            </>
          )}

          <button type="submit" style={S.button(loading)} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={S.switchLink}>
          {mode === "login" ? (
            <>Don't have an account? <button style={S.link} onClick={() => { setError(""); setMode("signup"); }}>Sign up</button></>
          ) : (
            <>Already have an account? <button style={S.link} onClick={() => { setError(""); setMode("login"); }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
