import { useState, useEffect, useCallback } from "react";
import api from "./api";
import { BAMBU_PRESETS, BAMBU_COLORS } from "./presets";
import AuthScreen from "./AuthScreen";

const MATERIALS = ["PLA","PLA+","PETG","ABS","ASA","TPU","Nylon","PC","HIPS","PVA","CF-PLA","CF-PETG","Wood PLA","Silk PLA","Other"];
const STATUSES = ["In Use","Unopened","Empty","Dried","Bad/Damaged"];
const DIAMETERS = ["1.75","2.85"];

const defaultFilament = {
  brand:"", material:"PLA", color:"", diameter:"1.75",
  spool_weight:1000, remaining:1000, cost:"",
  purchase_date:"", opened_date:"", storage:"",
  temp_bed:"", temp_nozzle:"", notes:"", status:"Unopened"
};

const defaultLog = {
  date: new Date().toISOString().split("T")[0],
  project:"", material:"PLA", filament_id:"",
  weight_used:"", print_time:"", success:"Yes", notes:""
};

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

export default function App() {
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width < 900;

  const [tab, setTab] = useState("inventory");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [printLog, setPrintLog] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({...defaultFilament});
  const [logForm, setLogForm] = useState({...defaultLog});
  const [editingId, setEditingId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [filterMaterial, setFilterMaterial] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [users, setUsers] = useState([]);
  const [resetPasswordFor, setResetPasswordFor] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const applyPreset = (presetName) => {
    setSelectedPreset(presetName);
    if (!presetName) return;
    const preset = BAMBU_PRESETS.find(p => p.name === presetName);
    if (!preset) return;
    setForm(f => ({
      ...f,
      brand: "Bambu Lab",
      material: preset.material,
      diameter: preset.diameter,
      spool_weight: preset.spool_weight,
      remaining: preset.spool_weight,
      cost: preset.cost,
      temp_bed: preset.temp_bed,
      temp_nozzle: preset.temp_nozzle,
      notes: f.notes || `Bambu Lab ${preset.name}`,
    }));
    showToast(`Loaded ${preset.name} preset`);
  };

  const loadData = useCallback(async () => {
    try {
      const [filaments, logs, statsData] = await Promise.all([
        api.getFilaments(), api.getLogs(), api.getStats(),
      ]);
      setInventory(filaments);
      setPrintLog(logs);
      setStats(statsData);
    } catch (e) {
      if (e.status === 401) {
        setUser(null);
        return;
      }
      console.error("Failed to load data:", e);
      showToast("Failed to load data from server", "error");
    }
    setLoaded(true);
  }, []);

  // Check session on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await api.me();
        if (data.user) setUser(data.user);
      } catch (e) {
        console.error("Auth check failed:", e);
      }
      setAuthChecked(true);
    })();
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (user) loadData();
    else setLoaded(false);
  }, [user, loadData]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      if (e.status === 401) { setUser(null); return; }
      showToast(e.message || "Failed to load users", "error");
    }
  }, []);

  // Load users list when an admin opens the Admin tab
  useEffect(() => {
    if (user?.is_admin && tab === "admin") loadUsers();
  }, [user, tab, loadUsers]);

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) {}
    setUser(null);
    setInventory([]);
    setPrintLog([]);
    setStats(null);
    setTab("inventory");
    setEditingId(null);
    setForm({...defaultFilament});
    setUsers([]);
  };

  const toggleUserAdmin = async (u) => {
    try {
      await api.setUserAdmin(u.id, !u.is_admin);
      showToast(`${u.username} ${u.is_admin ? "demoted" : "promoted to admin"}`);
      await loadUsers();
    } catch (e) { showToast(e.message || "Update failed", "error"); }
  };

  const deleteUserAccount = async (id) => {
    try { await api.deleteUser(id); showToast("User deleted"); await loadUsers(); }
    catch (e) { showToast(e.message || "Delete failed", "error"); }
    setConfirmDelete(null);
  };

  const submitResetPassword = async () => {
    if (!resetPasswordFor) return;
    if (newPassword.length < 8) { showToast("Password must be at least 8 characters", "error"); return; }
    try {
      await api.resetUserPassword(resetPasswordFor.id, newPassword);
      showToast(`Password reset for ${resetPasswordFor.username}`);
      setResetPasswordFor(null);
      setNewPassword("");
    } catch (e) { showToast(e.message || "Reset failed", "error"); }
  };

  const showToast = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 2600);
  };

  const handleFormChange = (field, val) => setForm(f => ({...f, [field]: val}));
  const handleLogChange = (field, val) => setLogForm(f => ({...f, [field]: val}));

  const addOrUpdateFilament = async () => {
    if (!form.brand.trim() || !form.color.trim()) {
      showToast("Brand and Color are required", "error"); return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        await api.updateFilament(editingId, form);
        setEditingId(null);
        showToast("Spool updated!");
      } else {
        await api.createFilament(form);
        showToast("Spool added!");
      }
      setForm({...defaultFilament});
      setSelectedPreset("");
      setTab("inventory");
      await loadData();
    } catch (e) { showToast("Save failed - check your connection", "error"); }
    setSaving(false);
  };

  const editFilament = (item) => {
    setForm({
      brand: item.brand, material: item.material, color: item.color,
      diameter: item.diameter, spool_weight: item.spool_weight,
      remaining: item.remaining, cost: item.cost || "",
      purchase_date: item.purchase_date || "", opened_date: item.opened_date || "",
      storage: item.storage || "", temp_bed: item.temp_bed || "",
      temp_nozzle: item.temp_nozzle || "", notes: item.notes || "", status: item.status,
    });
    setEditingId(item.id);
    setTab("add");
  };

  const deleteFilament = async (id) => {
    try { await api.deleteFilament(id); showToast("Spool deleted"); await loadData(); }
    catch (e) { showToast("Delete failed", "error"); }
    setConfirmDelete(null);
  };

  const addPrintLog = async () => {
    if (!logForm.project.trim()) { showToast("Project name required", "error"); return; }
    setSaving(true);
    try {
      await api.createLog(logForm);
      showToast("Print logged!");
      setLogForm({...defaultLog, date: new Date().toISOString().split("T")[0]});
      await loadData();
    } catch (e) { showToast("Save failed", "error"); }
    setSaving(false);
  };

  const deletePrintLog = async (id) => {
    try { await api.deleteLog(id); showToast("Log entry removed"); await loadData(); }
    catch (e) { showToast("Delete failed", "error"); }
  };

  const exportCSV = (data, filename, headers) => {
    const csv = [headers.join(","), ...data.map(r => headers.map(h => {
      const v = r[h] ?? "";
      return typeof v === "string" && v.includes(",") ? `"${v}"` : v;
    }).join(","))].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  };

  const exportInventory = () => {
    exportCSV(inventory, "filament_inventory.csv", ["brand","material","color","diameter","spool_weight","remaining","cost","purchase_date","opened_date","storage","temp_bed","temp_nozzle","notes","status"]);
    showToast("Inventory exported!");
  };

  const exportPrintLog = () => {
    exportCSV(printLog, "print_log.csv", ["date","project","material","filament_id","weight_used","print_time","success","notes"]);
    showToast("Print log exported!");
  };

  // Stats
  const totalSpools = stats?.totals?.total_spools || 0;
  const inUse = stats?.totals?.in_use || 0;
  const unopened = stats?.totals?.unopened || 0;
  const totalInvestment = stats?.totals?.total_investment || 0;
  const totalRemaining = stats?.totals?.total_remaining || 0;
  const totalCapacity = stats?.totals?.total_capacity || 0;
  const pctRemaining = totalCapacity > 0 ? (totalRemaining / totalCapacity * 100) : 0;
  const materialCounts = stats?.materialBreakdown || [];
  const lowStock = stats?.lowStock || [];

  let filtered = inventory.filter(i => {
    if (filterMaterial !== "All" && i.material !== filterMaterial) return false;
    if (filterStatus !== "All" && i.status !== filterStatus) return false;
    return true;
  });
  if (sortField) {
    filtered.sort((a,b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const statusColor = (s) => {
    if (s === "In Use") return "#22c55e";
    if (s === "Unopened") return "#3b82f6";
    if (s === "Empty") return "#94a3b8";
    if (s === "Dried") return "#f59e0b";
    return "#ef4444";
  };

  const pctColor = (pct) => {
    if (pct > 60) return "#22c55e";
    if (pct > 25) return "#f59e0b";
    return "#ef4444";
  };

  if (!authChecked) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0c0f14",color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>Loading...</div>
  );

  if (!user) {
    return <AuthScreen onAuthenticated={(u) => setUser(u)} />;
  }

  if (!loaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0c0f14",color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>Loading...</div>
  );

  const formGrid = (cols) => ({
    display:"grid", gap: isMobile ? 14 : 12,
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : `repeat(${cols}, 1fr)`,
  });

  const S = {
    app: { minHeight:"100vh", background:"#0c0f14", color:"#c9d1d9", fontFamily:"'IBM Plex Sans','Segoe UI',system-ui,sans-serif", position:"relative" },
    header: { background:"linear-gradient(135deg,#111520 0%,#161b28 100%)", borderBottom:"1px solid #1e2636", padding: isMobile ? "16px 16px 0" : "20px 24px 0" },
    title: { fontSize: isMobile ? 18 : 22, fontWeight:700, color:"#e2e8f0", margin:0, letterSpacing:"-0.5px", display:"flex",alignItems:"center",gap:8 },
    subtitle: { fontSize: isMobile ? 10 : 12, color:"#64748b", marginTop:2, fontFamily:"'JetBrains Mono',monospace" },
    tabs: { display:"flex", gap:0, marginTop:12, overflowX:"auto", WebkitOverflowScrolling:"touch" },
    tab: (active) => ({
      padding: isMobile ? "10px 14px" : "10px 20px", fontSize: isMobile ? 12 : 13,
      fontWeight:600, cursor:"pointer", border:"none",
      borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
      background:"transparent", color: active ? "#e2e8f0" : "#64748b",
      fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0,
    }),
    content: { padding: isMobile ? "16px" : "24px", maxWidth:1200, margin:"0 auto" },
    card: { background:"#111520", border:"1px solid #1e2636", borderRadius:10, padding: isMobile ? 16 : 20, marginBottom:16 },
    label: { display:"block", fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'JetBrains Mono',monospace" },
    input: { width:"100%", padding: isMobile ? "11px 12px" : "9px 12px", background:"#0c0f14", border:"1px solid #1e2636", borderRadius:6, color:"#e2e8f0", fontSize: isMobile ? 16 : 14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" },
    select: { width:"100%", padding: isMobile ? "11px 12px" : "9px 12px", background:"#0c0f14", border:"1px solid #1e2636", borderRadius:6, color:"#e2e8f0", fontSize: isMobile ? 16 : 14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", cursor:"pointer" },
    btnPrimary: (disabled) => ({ padding: isMobile ? "12px 20px" : "10px 24px", background: disabled ? "#1e3a5f" : "#3b82f6", color:"#fff", border:"none", borderRadius:7, fontWeight:600, fontSize:14, cursor: disabled ? "wait" : "pointer", fontFamily:"inherit", opacity: disabled ? 0.7 : 1, width: isMobile ? "100%" : "auto" }),
    btnDanger: { padding:"8px 14px", background:"transparent", color:"#f87171", border:"1px solid #7f1d1d", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"inherit" },
    btnGhost: { padding:"8px 14px", background:"transparent", color:"#94a3b8", border:"1px solid #1e2636", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"inherit" },
    statBox: { background:"#111520", border:"1px solid #1e2636", borderRadius:10, padding: isMobile ? "14px 12px" : "16px 20px", textAlign:"center" },
    statNum: { fontSize: isMobile ? 22 : 28, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" },
    statLabel: { fontSize: isMobile ? 10 : 11, color:"#64748b", marginTop:2, textTransform:"uppercase", letterSpacing:"0.5px" },
    toast: (type) => ({
      position:"fixed", top:16, left: isMobile ? 16 : "auto", right: isMobile ? 16 : 20,
      padding:"12px 20px", borderRadius:8, zIndex:9999,
      background: type==="error" ? "#7f1d1d" : "#14532d", color: type==="error" ? "#fca5a5" : "#86efac",
      border: `1px solid ${type==="error" ? "#991b1b" : "#166534"}`,
      fontSize:13, fontWeight:600, fontFamily:"inherit", animation:"slideIn 0.3s ease", boxShadow:"0 8px 24px rgba(0,0,0,0.4)"
    }),
    badge: (color) => ({
      display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
      background: color+"18", color: color, border:`1px solid ${color}33`
    }),
    th: { padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase",
      letterSpacing:"0.8px", fontFamily:"'JetBrains Mono',monospace", textAlign:"left",
      borderBottom:"1px solid #1e2636", cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" },
    td: { padding:"10px 14px", fontSize:13, borderBottom:"1px solid #1e263622", whiteSpace:"nowrap" },
    emptyState: { textAlign:"center", padding: isMobile ? "40px 16px" : "60px 20px", color:"#475569" },
  };

  const InputField = ({label, field, obj, onChange, type="text", placeholder=""}) => (
    <div>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={obj[field]||""} placeholder={placeholder}
        onChange={e => onChange(field, type==="number" ? (e.target.value==="" ? "" : Number(e.target.value)) : e.target.value)}
        onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />
    </div>
  );

  const SelectField = ({label, field, obj, onChange, options}) => (
    <div>
      <label style={S.label}>{label}</label>
      <select style={S.select} value={obj[field]} onChange={e => onChange(field, e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const SortIcon = ({field}) => {
    if (sortField !== field) return <span style={{opacity:0.3,marginLeft:4}}>↕</span>;
    return <span style={{marginLeft:4,color:"#3b82f6"}}>{sortDir==="asc"?"↑":"↓"}</span>;
  };

  // Mobile card for inventory
  const FilamentCard = ({ item }) => {
    const pct = item.spool_weight > 0 ? (item.remaining / item.spool_weight * 100) : 0;
    const isExpanded = expandedCard === item.id;
    return (
      <div style={{...S.card, padding:0, marginBottom:10, overflow:"hidden"}}
        onClick={() => setExpandedCard(isExpanded ? null : item.id)}>
        <div style={{padding:"14px 16px", display:"flex", alignItems:"center", gap:12}}>
          <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid #1e2636",background:item.color.toLowerCase(),flexShrink:0}} />
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontWeight:600,color:"#e2e8f0",fontSize:14}}>{item.brand}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8"}}>{item.material} {item.diameter}mm</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <span style={{fontSize:13,color:"#c9d1d9"}}>{item.color}</span>
              <span style={S.badge(statusColor(item.status))}>{item.status}</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:600,color:pctColor(pct)}}>{item.remaining}g</div>
            <div style={{fontSize:10,color:"#64748b"}}>{pct.toFixed(0)}%</div>
          </div>
        </div>
        <div style={{height:4,background:"#1e2636"}}><div style={{height:"100%",background:pctColor(pct),width:`${pct}%`}} /></div>
        {isExpanded && (
          <div style={{padding:"12px 16px",background:"#0c0f14",borderTop:"1px solid #1e2636"}} onClick={e => e.stopPropagation()}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12,color:"#94a3b8"}}>
              {item.cost && <div><span style={{color:"#64748b"}}>Cost:</span> ${parseFloat(item.cost).toFixed(2)}</div>}
              {item.storage && <div><span style={{color:"#64748b"}}>Storage:</span> {item.storage}</div>}
              {item.temp_bed && <div><span style={{color:"#64748b"}}>Bed:</span> {item.temp_bed}°C</div>}
              {item.temp_nozzle && <div><span style={{color:"#64748b"}}>Nozzle:</span> {item.temp_nozzle}°C</div>}
              {item.purchase_date && <div><span style={{color:"#64748b"}}>Purchased:</span> {item.purchase_date}</div>}
              {item.opened_date && <div><span style={{color:"#64748b"}}>Opened:</span> {item.opened_date}</div>}
            </div>
            {item.notes && <div style={{fontSize:12,color:"#94a3b8",marginTop:8}}>{item.notes}</div>}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button style={{...S.btnGhost,flex:1,padding:"10px"}} onClick={() => editFilament(item)}>Edit</button>
              <button style={{...S.btnDanger,padding:"10px"}} onClick={() => setConfirmDelete({msg:`Delete ${item.brand} ${item.color}?`, action:()=>deleteFilament(item.id)})}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile card for print logs
  const PrintLogCard = ({ log }) => (
    <div style={{...S.card, marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontWeight:600,color:"#e2e8f0",fontSize:14}}>{log.project}</div>
          <div style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:"#64748b",marginTop:2}}>{log.date}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={S.badge(log.success==="Yes"?"#22c55e":log.success==="Partial"?"#f59e0b":"#ef4444")}>{log.success}</span>
          <button style={{...S.btnDanger,padding:"6px 10px",fontSize:11}} onClick={() => deletePrintLog(log.id)}>✕</button>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginTop:8,fontSize:12,color:"#94a3b8"}}>
        <span>{log.material}</span>
        {log.weight_used && <span>{log.weight_used}g</span>}
        {log.print_time && <span>{log.print_time}h</span>}
      </div>
      {log.notes && <div style={{fontSize:12,color:"#64748b",marginTop:6}}>{log.notes}</div>}
    </div>
  );

  return (
    <div style={S.app}>
      {toast && <div style={S.toast(toast.type)}>{toast.msg}</div>}
      {confirmDelete && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,padding:16}}>
          <div style={{...S.card, maxWidth:380, textAlign:"center",width:"100%"}}>
            <p style={{fontSize:15,color:"#e2e8f0",marginBottom:20}}>{confirmDelete.msg}</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button style={S.btnDanger} onClick={confirmDelete.action}>Yes, Delete</button>
              <button style={S.btnGhost} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {resetPasswordFor && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9998,padding:16}}>
          <div style={{...S.card, maxWidth:380, width:"100%"}}>
            <p style={{fontSize:15,color:"#e2e8f0",marginBottom:6}}>Reset password for <strong>{resetPasswordFor.username}</strong></p>
            <p style={{fontSize:12,color:"#64748b",marginBottom:14}}>This will sign them out of all devices. Share the new password with them out-of-band.</p>
            <label style={S.label}>New Password</label>
            <input style={S.input} type="text" value={newPassword} placeholder="At least 8 characters"
              onChange={e => setNewPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />
            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:16}}>
              <button style={S.btnPrimary(false)} onClick={submitResetPassword}>Reset Password</button>
              <button style={S.btnGhost} onClick={() => { setResetPasswordFor(null); setNewPassword(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.header}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <h1 style={S.title}><span style={{fontSize: isMobile ? 22 : 26}}>◈</span> Filament Manager</h1>
            <p style={S.subtitle}>Welcome back, {user.display_name || user.username}</p>
          </div>
          <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
            {!isMobile && <>
              <button style={{...S.btnGhost,fontSize:11}} onClick={exportInventory}>⬇ Inventory</button>
              <button style={{...S.btnGhost,fontSize:11}} onClick={exportPrintLog}>⬇ Print Log</button>
            </>}
            <button style={{...S.btnGhost,fontSize:11,borderColor:"#7f1d1d",color:"#f87171"}} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
        <div style={S.tabs}>
          {[["dashboard","Dashboard"],["inventory","Inventory"],["add", editingId ? "Edit Spool" : "Add Spool"],["log","Print Log"], ...(user.is_admin ? [["admin","Admin"]] : [])].map(([key,label]) => (
            <button key={key} style={S.tab(tab===key)} onClick={() => { setTab(key); if(key!=="add") setEditingId(null); }}>{label}</button>
          ))}
          {isMobile && <button style={S.tab(false)} onClick={() => { exportInventory(); exportPrintLog(); }}>⬇ Export</button>}
        </div>
      </div>

      <div style={S.content}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <div style={{display:"grid",gap:isMobile?8:12, gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit,minmax(160px,1fr))"}}>
              {[[totalSpools,"Total Spools","#3b82f6"],[inUse,"In Use","#22c55e"],[unopened,"Unopened","#8b5cf6"],
                [`$${totalInvestment.toFixed(2)}`,"Invested","#f59e0b"],[`${totalRemaining.toLocaleString()}g`,"Remaining","#06b6d4"],
                [`${pctRemaining.toFixed(1)}%`,"Overall Stock","#ec4899"]
              ].map(([val,label,color],i) => (
                <div key={i} style={S.statBox}>
                  <div style={{...S.statNum, color}}>{val}</div>
                  <div style={S.statLabel}>{label}</div>
                </div>
              ))}
            </div>
            {totalCapacity > 0 && (
              <div style={{...S.card, marginTop:16}}>
                <div style={S.label}>Overall Filament Level</div>
                <div style={{background:"#1e2636",borderRadius:8,height:28,marginTop:8,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:8,background:`linear-gradient(90deg,${pctColor(pctRemaining)},${pctColor(pctRemaining)}aa)`,width:`${pctRemaining}%`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#fff",textShadow:"0 1px 3px rgba(0,0,0,0.4)"}}>{pctRemaining.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
            {materialCounts.length > 0 && (
              <div style={{...S.card, marginTop:16}}>
                <div style={S.label}>Material Breakdown</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:isMobile?6:10,marginTop:12}}>
                  {materialCounts.map(({material, count}) => (
                    <div key={material} style={{background:"#0c0f14",border:"1px solid #1e2636",borderRadius:8,padding:isMobile?"8px 12px":"10px 16px",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:isMobile?16:20,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#3b82f6"}}>{count}</span>
                      <span style={{fontSize:isMobile?12:13,color:"#94a3b8"}}>{material}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lowStock.length > 0 && (
              <div style={{...S.card, marginTop:16, borderColor:"#7f1d1d"}}>
                <div style={{...S.label, color:"#f87171"}}>⚠ Low Stock</div>
                <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                  {lowStock.map(i => (
                    <div key={i.id} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,flexWrap:"wrap"}}>
                      <span style={{color:"#f87171",fontWeight:600,minWidth:36}}>{i.pct}%</span>
                      <span style={{color:"#e2e8f0"}}>{i.brand} {i.material} - {i.color}</span>
                      <span style={{color:"#64748b"}}>({i.remaining}g left)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* INVENTORY */}
        {tab === "inventory" && (
          <div>
            <div style={{display:"flex",gap:isMobile?8:12,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:isMobile?"1 1 calc(50% - 4px)":"0 0 auto"}}>
                <label style={S.label}>Material</label>
                <select style={{...S.select,width:isMobile?"100%":"140px"}} value={filterMaterial} onChange={e => setFilterMaterial(e.target.value)}>
                  <option>All</option>{MATERIALS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{flex:isMobile?"1 1 calc(50% - 4px)":"0 0 auto"}}>
                <label style={S.label}>Status</label>
                <select style={{...S.select,width:isMobile?"100%":"140px"}} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option>All</option>{STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {!isMobile && <div style={{flex:1}} />}
              <button style={{...S.btnPrimary(false),flex:isMobile?"1 1 100%":"0 0 auto"}}
                onClick={() => { setForm({...defaultFilament}); setEditingId(null); setSelectedPreset(""); setTab("add"); }}>+ Add Spool</button>
            </div>

            {filtered.length === 0 ? (
              <div style={S.emptyState}>
                <div style={{fontSize:48,marginBottom:12}}>◇</div>
                <p style={{fontSize:16,color:"#64748b"}}>No filament spools yet</p>
                <p style={{fontSize:13,color:"#475569"}}>Add your first spool to get started</p>
              </div>
            ) : isMobile ? (
              <div>
                <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                  {[["brand","Brand"],["remaining","Stock"],["cost","Cost"],["status","Status"]].map(([f,label]) => (
                    <button key={f} style={{...S.btnGhost,padding:"6px 10px",fontSize:11,
                      ...(sortField===f?{borderColor:"#3b82f6",color:"#3b82f6"}:{})
                    }} onClick={() => toggleSort(f)}>{label} {sortField===f?(sortDir==="asc"?"↑":"↓"):""}</button>
                  ))}
                </div>
                {filtered.map(item => <FilamentCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #1e2636"}}>
                <table style={{width:"100%",borderCollapse:"collapse",background:"#111520"}}>
                  <thead><tr>
                    {[["brand","Brand"],["material","Type"],["color","Color"],["remaining","Remaining"],["cost","Cost"],["status","Status"],["","Actions"]].map(([f,label]) => (
                      <th key={label} style={S.th} onClick={() => f && toggleSort(f)}>{label}{f && <SortIcon field={f} />}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map(item => {
                      const pct = item.spool_weight > 0 ? (item.remaining / item.spool_weight * 100) : 0;
                      return (
                        <tr key={item.id} onMouseEnter={e => e.currentTarget.style.background="#161b28"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                          <td style={S.td}><span style={{fontWeight:600,color:"#e2e8f0"}}>{item.brand}</span></td>
                          <td style={S.td}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{item.material}</span><span style={{color:"#475569",marginLeft:6,fontSize:11}}>{item.diameter}mm</span></td>
                          <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",border:"2px solid #1e2636",background:item.color.toLowerCase(),flexShrink:0}} />{item.color}</div></td>
                          <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60,height:6,background:"#1e2636",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:pctColor(pct),borderRadius:3,width:`${pct}%`}} /></div><span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:pctColor(pct)}}>{item.remaining}g</span></div></td>
                          <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace"}}>{item.cost ? `$${parseFloat(item.cost).toFixed(2)}` : "-"}</td>
                          <td style={S.td}><span style={S.badge(statusColor(item.status))}>{item.status}</span></td>
                          <td style={S.td}><div style={{display:"flex",gap:6}}><button style={{...S.btnGhost,padding:"4px 10px"}} onClick={() => editFilament(item)}>Edit</button><button style={{...S.btnDanger,padding:"4px 10px"}} onClick={() => setConfirmDelete({msg:`Delete ${item.brand} ${item.color}?`, action:()=>deleteFilament(item.id)})}>✕</button></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT FORM */}
        {tab === "add" && (
          <div style={S.card}>
            <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700,color:"#e2e8f0"}}>{editingId ? "Edit Spool" : "Add New Spool"}</h3>

            {!editingId && (
              <div style={{background:"#0c0f14",border:"1px solid #1e2636",borderRadius:8,padding:14,marginBottom:18}}>
                <label style={{...S.label, color:"#3b82f6", marginBottom:8}}>⚡ Quick Fill - Bambu Lab Catalog</label>
                <select style={S.select} value={selectedPreset} onChange={e => applyPreset(e.target.value)}>
                  <option value="">-- Select a Bambu Lab filament to auto-fill --</option>
                  <optgroup label="PLA Series">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("PLA")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="PETG Series">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("PETG")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="ABS / ASA">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("ABS") || p.name.startsWith("ASA")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="TPU (Flexible)">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("TPU")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="PC (Polycarbonate)">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("PC")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="PA / Nylon">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("PA")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="PET">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("PET-")).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="Support / PVA">
                    {BAMBU_PRESETS.filter(p => p.name.startsWith("Support") || p.name === "PVA").map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </optgroup>
                </select>
                <p style={{fontSize:11,color:"#64748b",marginTop:8,fontFamily:"'JetBrains Mono',monospace"}}>
                  Auto-fills brand, material, diameter, spool weight, cost, and recommended temps. Just enter the color below.
                </p>
              </div>
            )}

            <datalist id="bambu-colors">
              {BAMBU_COLORS.map(c => <option key={c} value={c} />)}
            </datalist>

            <div style={formGrid(3)}>
              <InputField label="Brand *" field="brand" obj={form} onChange={handleFormChange} placeholder="e.g. Hatchbox" />
              <SelectField label="Material" field="material" obj={form} onChange={handleFormChange} options={MATERIALS} />
              <div>
                <label style={S.label}>Color *</label>
                <input style={S.input} type="text" value={form.color||""} placeholder="e.g. Matte Black"
                  list={form.brand === "Bambu Lab" ? "bambu-colors" : undefined}
                  onChange={e => handleFormChange("color", e.target.value)}
                  onFocus={e => e.target.style.borderColor="#3b82f6"} onBlur={e => e.target.style.borderColor="#1e2636"} />
              </div>
            </div>
            <div style={{...formGrid(4), marginTop:12}}>
              <SelectField label="Diameter (mm)" field="diameter" obj={form} onChange={handleFormChange} options={DIAMETERS} />
              <InputField label="Spool Weight (g)" field="spool_weight" obj={form} onChange={handleFormChange} type="number" placeholder="1000" />
              <InputField label="Remaining (g)" field="remaining" obj={form} onChange={handleFormChange} type="number" placeholder="1000" />
              <InputField label="Cost ($)" field="cost" obj={form} onChange={handleFormChange} type="number" placeholder="24.99" />
            </div>
            <div style={{...formGrid(4), marginTop:12}}>
              <InputField label="Purchase Date" field="purchase_date" obj={form} onChange={handleFormChange} type="date" />
              <InputField label="Opened Date" field="opened_date" obj={form} onChange={handleFormChange} type="date" />
              <InputField label="Storage Location" field="storage" obj={form} onChange={handleFormChange} placeholder="e.g. Shelf A" />
              <SelectField label="Status" field="status" obj={form} onChange={handleFormChange} options={STATUSES} />
            </div>
            <div style={{...formGrid(3), marginTop:12}}>
              <InputField label="Bed Temp (°C)" field="temp_bed" obj={form} onChange={handleFormChange} type="number" placeholder="60" />
              <InputField label="Nozzle Temp (°C)" field="temp_nozzle" obj={form} onChange={handleFormChange} type="number" placeholder="210" />
              <InputField label="Notes" field="notes" obj={form} onChange={handleFormChange} placeholder="Any notes..." />
            </div>
            <div style={{marginTop:20,display:"flex",gap:10,flexDirection:isMobile?"column":"row"}}>
              <button style={S.btnPrimary(saving)} onClick={addOrUpdateFilament} disabled={saving}>{saving ? "Saving..." : editingId ? "Update Spool" : "Add Spool"}</button>
              {editingId && <button style={{...S.btnGhost,width:isMobile?"100%":"auto"}} onClick={() => { setEditingId(null); setForm({...defaultFilament}); setTab("inventory"); }}>Cancel Edit</button>}
            </div>
          </div>
        )}

        {/* PRINT LOG */}
        {tab === "log" && (
          <div>
            <div style={S.card}>
              <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700,color:"#e2e8f0"}}>Log a Print</h3>
              <div style={formGrid(4)}>
                <InputField label="Date" field="date" obj={logForm} onChange={handleLogChange} type="date" />
                <InputField label="Project Name *" field="project" obj={logForm} onChange={handleLogChange} placeholder="e.g. Benchy" />
                <SelectField label="Material" field="material" obj={logForm} onChange={handleLogChange} options={MATERIALS} />
                <div>
                  <label style={S.label}>Filament Spool</label>
                  <select style={S.select} value={logForm.filament_id} onChange={e => handleLogChange("filament_id", e.target.value)}>
                    <option value="">-- Select --</option>
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.brand} {i.material} - {i.color}</option>)}
                  </select>
                </div>
              </div>
              <div style={{...formGrid(4), marginTop:12}}>
                <InputField label="Weight Used (g)" field="weight_used" obj={logForm} onChange={handleLogChange} type="number" placeholder="50" />
                <InputField label="Print Time (hrs)" field="print_time" obj={logForm} onChange={handleLogChange} type="number" placeholder="2.5" />
                <SelectField label="Success?" field="success" obj={logForm} onChange={handleLogChange} options={["Yes","No","Partial"]} />
                <InputField label="Notes" field="notes" obj={logForm} onChange={handleLogChange} placeholder="Any notes..." />
              </div>
              <button style={{...S.btnPrimary(saving), marginTop:16}} onClick={addPrintLog} disabled={saving}>{saving ? "Saving..." : "Log Print"}</button>
            </div>
            {printLog.length === 0 ? (
              <div style={S.emptyState}><div style={{fontSize:48,marginBottom:12}}>◇</div><p style={{fontSize:16,color:"#64748b"}}>No prints logged yet</p></div>
            ) : isMobile ? (
              <div style={{marginTop:16}}>{printLog.map(log => <PrintLogCard key={log.id} log={log} />)}</div>
            ) : (
              <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #1e2636",marginTop:16}}>
                <table style={{width:"100%",borderCollapse:"collapse",background:"#111520"}}>
                  <thead><tr>{["Date","Project","Material","Weight","Time","Result","Notes",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {printLog.map(log => (
                      <tr key={log.id} onMouseEnter={e => e.currentTarget.style.background="#161b28"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{log.date}</td>
                        <td style={{...S.td,fontWeight:600,color:"#e2e8f0"}}>{log.project}</td>
                        <td style={S.td}>{log.material}</td>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace"}}>{log.weight_used ? `${log.weight_used}g` : "-"}</td>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace"}}>{log.print_time ? `${log.print_time}h` : "-"}</td>
                        <td style={S.td}><span style={S.badge(log.success==="Yes"?"#22c55e":log.success==="Partial"?"#f59e0b":"#ef4444")}>{log.success}</span></td>
                        <td style={{...S.td,color:"#94a3b8",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"}}>{log.notes||"-"}</td>
                        <td style={S.td}><button style={{...S.btnDanger,padding:"4px 10px"}} onClick={() => deletePrintLog(log.id)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADMIN */}
        {tab === "admin" && user.is_admin && (
          <div>
            <div style={{...S.card, marginBottom:16}}>
              <h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:"#e2e8f0"}}>User Management</h3>
              <p style={{margin:0,fontSize:12,color:"#64748b"}}>Manage who has access to this Filament Manager. Deleting a user removes all of their filaments and print logs.</p>
            </div>
            {users.length === 0 ? (
              <div style={S.emptyState}><div style={{fontSize:48,marginBottom:12}}>◇</div><p style={{fontSize:16,color:"#64748b"}}>No users loaded</p></div>
            ) : isMobile ? (
              <div>
                {users.map(u => (
                  <div key={u.id} style={{...S.card, padding:14, marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontWeight:600,color:"#e2e8f0",fontSize:14}}>{u.username}</span>
                          {u.is_admin ? <span style={S.badge("#8b5cf6")}>Admin</span> : null}
                          {u.id === user.id ? <span style={S.badge("#3b82f6")}>You</span> : null}
                        </div>
                        {u.display_name && u.display_name !== u.username && <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{u.display_name}</div>}
                        {u.email && <div style={{fontSize:12,color:"#64748b",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{u.email}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:12,marginTop:8,fontSize:12,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>
                      <span>{u.filament_count} spools</span>
                      <span>{u.print_count} prints</span>
                      <span style={{color:"#64748b"}}>{u.created_at?.split(" ")[0]}</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                      <button style={S.btnGhost} onClick={() => toggleUserAdmin(u)} disabled={u.id === user.id && u.is_admin}>{u.is_admin ? "Remove Admin" : "Make Admin"}</button>
                      <button style={S.btnGhost} onClick={() => { setResetPasswordFor(u); setNewPassword(""); }}>Reset PW</button>
                      {u.id !== user.id && (
                        <button style={S.btnDanger} onClick={() => setConfirmDelete({msg:`Delete user "${u.username}" and all of their filaments and print logs?`, action:()=>deleteUserAccount(u.id)})}>Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #1e2636"}}>
                <table style={{width:"100%",borderCollapse:"collapse",background:"#111520"}}>
                  <thead><tr>{["User","Email","Created","Spools","Prints","Role",""].map(h => <th key={h} style={{...S.th,cursor:"default"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} onMouseEnter={e => e.currentTarget.style.background="#161b28"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <td style={{...S.td,fontWeight:600,color:"#e2e8f0"}}>
                          {u.username}
                          {u.id === user.id && <span style={{...S.badge("#3b82f6"),marginLeft:8}}>You</span>}
                          {u.display_name && u.display_name !== u.username && <div style={{fontSize:11,fontWeight:400,color:"#94a3b8",marginTop:2}}>{u.display_name}</div>}
                        </td>
                        <td style={{...S.td,color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{u.email || "-"}</td>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{u.created_at?.split(" ")[0]}</td>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace"}}>{u.filament_count}</td>
                        <td style={{...S.td,fontFamily:"'JetBrains Mono',monospace"}}>{u.print_count}</td>
                        <td style={S.td}>{u.is_admin ? <span style={S.badge("#8b5cf6")}>Admin</span> : <span style={{color:"#64748b",fontSize:12}}>User</span>}</td>
                        <td style={S.td}>
                          <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                            <button style={{...S.btnGhost,padding:"4px 10px"}} onClick={() => toggleUserAdmin(u)} disabled={u.id === user.id && u.is_admin}>{u.is_admin ? "Demote" : "Promote"}</button>
                            <button style={{...S.btnGhost,padding:"4px 10px"}} onClick={() => { setResetPasswordFor(u); setNewPassword(""); }}>Reset PW</button>
                            {u.id !== user.id && (
                              <button style={{...S.btnDanger,padding:"4px 10px"}} onClick={() => setConfirmDelete({msg:`Delete user "${u.username}" and all of their filaments and print logs?`, action:()=>deleteUserAccount(u.id)})}>✕</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
