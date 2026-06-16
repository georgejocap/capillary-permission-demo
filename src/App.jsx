import { useState, useRef, useEffect } from 'react'
import './App.css'

// ─── Seed data ────────────────────────────────────────────────────────────────

const MODULES = {
  // Data Management > Entities
  'Behavioural Events':       { color:'#6366f1', nav:'Data Management › Entities', perms:['View','Create','Edit','Delete'], desc:'Define custom event schemas and publish to Loyalty & Engage+' },
  'Webhooks':                 { color:'#8b5cf6', nav:'Data Management › Entities', perms:['View','Create','Delete'],        desc:'Inbound webhook integrations for event data ingestion' },
  'Cards':                    { color:'#0ea5e9', nav:'Data Management › Entities', perms:['View','Create','Edit','Delete'], desc:'Card series, generated cards and global card settings' },
  'Product Inventory':        { color:'#64748b', nav:'Data Management › Entities', perms:['View','Create','Edit','Delete'], desc:'Brands, categories, colors, attributes, sizes, styles' },
  // Settings > Org Settings
  'Communication & Gateway':  { color:'#14b8a6', nav:'Settings › Org Settings',   perms:['View','Create','Edit','Delete'], desc:'Configure domains, gateway mapping, gateways, OU sender IDs' },
  'OAuth / API Management':   { color:'#f59e0b', nav:'Settings › Org Settings',   perms:['View','Create','Edit','Delete'], desc:'API clients, access groups, resources and permissions' },
  'Milestone / Target Groups':{ color:'#f97316', nav:'Settings › Org Settings',   perms:['View','Create','Edit','Delete'], desc:'Milestone and target group configuration' },
  'Manage Partners':          { color:'#ef4444', nav:'Settings › Org Settings',   perms:['View','Create','Edit','Delete'], desc:'Partner entity list, create, edit, delete' },
  'Liability Owners':         { color:'#10b981', nav:'Settings › Org Settings',   perms:['View','Create','Edit','Delete'], desc:'Loyalty liability owner management' },
  // Channels
  'Creatives':                { color:'#ec4899', nav:'Channels › Creatives',      perms:['View','Create','Edit','Delete'], desc:'SMS, email and push notification templates' },
  // Audiences (new top-level nav)
  'Audiences':                { color:'#7c3aed', nav:'Audiences',                  perms:['View','Create','Edit','Delete'], desc:'Audience groups and org user segmentation' },
}

// Permission sets per module for standard sets
const dataManagerModules = ['Behavioural Events','Webhooks','Cards','Product Inventory','Communication & Gateway','Milestone / Target Groups','Manage Partners','Liability Owners']
const dataManagerP = Object.fromEntries(dataManagerModules.map(m => [m, [...MODULES[m].perms]]))

const dataImportP = {
  'Behavioural Events':       ['View'],
  'Webhooks':                 ['View'],
  'Cards':                    ['View'],
  'Product Inventory':        ['View','Create','Edit','Delete'],
  'Milestone / Target Groups':['View'],
  'Manage Partners':          ['View'],
}

const PC = {
  View:   { bg:'#eff6ff', tx:'#1d4ed8', br:'#bfdbfe' },
  Create: { bg:'#f0fdf4', tx:'#15803d', br:'#bbf7d0' },
  Edit:   { bg:'#fffbeb', tx:'#b45309', br:'#fde68a' },
  Delete: { bg:'#fef2f2', tx:'#dc2626', br:'#fecaca' },
}

const INIT_SETS = [
  // ── Standard sets ──────────────────────────────────────────────────────────
  {
    id:1, name:'Org Settings - Data Manager',
    desc:'Full access to all org settings modules. All new permissions included — existing users unaffected.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026', super:true,
    perms: dataManagerP
  },
  {
    id:2, name:'Data Import',
    desc:'View access across org settings modules. Full CRUD on Product Inventory for data import workflows.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms: dataImportP
  },
  {
    id:3, name:'API Access Configuration Admin',
    desc:'Full access to OAuth / API Management — clients, access groups, resources and permissions.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms:{ 'OAuth / API Management':['View','Create','Edit','Delete'] }
  },
  {
    id:4, name:'API Access Configuration Viewer',
    desc:'Read-only access to OAuth / API Management.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms:{ 'OAuth / API Management':['View'] }
  },
  {
    id:5, name:'Engage+ Authorize',
    desc:'Full access to Engage+ including creative templates.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms:{ 'Creatives':['View','Create','Edit','Delete'] }
  },
  {
    id:6, name:'Engage+ Activate',
    desc:'Create and edit campaigns, journeys and creative templates. No delete.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms:{ 'Creatives':['View','Create','Edit'] }
  },
  {
    id:7, name:'Engage+ Explore',
    desc:'View-only access to Engage+ modules including creative templates.',
    type:'Standard', by:'Capillary', on:'Jan 15, 2026',
    perms:{ 'Creatives':['View'] }
  },
  {
    id:8, name:'Audiences',
    desc:'Create and manage audience groups and org user segmentation. New dedicated set for the Audiences module.',
    type:'Standard', by:'Capillary', on:'Jun 16, 2026',
    perms:{ 'Audiences':['View','Create','Edit','Delete'] }
  },
  // ── Custom sets ────────────────────────────────────────────────────────────
  {
    id:9,  name:'BE — View',
    desc:'Read-only access to Behavioural Events and Webhooks.',
    type:'Custom', by:'George Johnson', on:'Jun 10, 2026',
    perms:{ 'Behavioural Events':['View'], 'Webhooks':['View'] }
  },
  {
    id:10, name:'BE — Manager',
    desc:'Create and edit events and webhooks. No delete.',
    type:'Custom', by:'George Johnson', on:'Jun 10, 2026',
    perms:{ 'Behavioural Events':['View','Create','Edit'], 'Webhooks':['View','Create'] }
  },
  {
    id:11, name:'Cards — View',
    desc:'Read-only access to Cards (card series and generated cards).',
    type:'Custom', by:'George Johnson', on:'Jun 10, 2026',
    perms:{ 'Cards':['View'] }
  },
  {
    id:12, name:'Cards — Manager',
    desc:'Create and edit card series. No delete access.',
    type:'Custom', by:'George Johnson', on:'Jun 10, 2026',
    perms:{ 'Cards':['View','Create','Edit'] }
  },
  {
    id:13, name:'Comms — View',
    desc:'Read-only access to Communication & Gateway configuration.',
    type:'Custom', by:'George Johnson', on:'Jun 16, 2026',
    perms:{ 'Communication & Gateway':['View'] }
  },
  {
    id:14, name:'OAuth — View',
    desc:'Read-only access to API clients and access groups.',
    type:'Custom', by:'George Johnson', on:'Jun 11, 2026',
    perms:{ 'OAuth / API Management':['View'] }
  },
]

const INIT_USERS = [
  { id:1, name:'Rick Sanchez',  email:'rick.sanchez@adultswim.com',    type:'Organization owner', status:'Active',      lastActive:'Aug 21, 2023 09:23 AM', sets:[] },
  { id:2, name:'Morty Smith',   email:'morty.smith@adultswim.com',     type:'Admin',              status:'Pending',     lastActive:'—',                     sets:['Org Settings - Data Manager'] },
  { id:3, name:'Beth Smith',    email:'beth.smith@adultswim.com',      type:'Standard user',      status:'Active',      lastActive:'Jul 08, 2023 02:26 PM', sets:['BE — View'] },
  { id:4, name:'Jerry Smith',   email:'jerry.smith@adultswim.com',     type:'Standard user',      status:'Active',      lastActive:'Jun 29, 2023 12:10 PM', sets:['Cards — View'] },
  { id:5, name:'Summer Smith',  email:'summer.smith@adultswim.com',    type:'Standard user',      status:'Deactivated', lastActive:'Mar 15, 2023 08:00 AM', sets:[] },
  { id:6, name:'Squanchy',      email:'squanchy@capillarytech.com',    type:'Standard user',      status:'Active',      lastActive:'Jun 10, 2026 11:00 AM', sets:['BE — Manager','Cards — Manager'] },
  { id:7, name:'Amogh Rane',    email:'amogh.rane@capillarytech.com',  type:'Standard user',      status:'Active',      lastActive:'Jun 11, 2026 09:00 AM', sets:['API Access Configuration Admin'] },
  { id:8, name:'Priya Nair',    email:'priya.nair@capillarytech.com',  type:'Standard user',      status:'Active',      lastActive:'Jun 14, 2026 03:20 PM', sets:['Data Import'] },
  { id:9, name:'Harsh Verma',   email:'harsh.verma@capillarytech.com', type:'Standard user',      status:'Active',      lastActive:'Jun 16, 2026 10:00 AM', sets:['Audiences','Engage+ Explore'] },
]

const AUDIT_LOGS = [
  { id:1,  date:'Jun 16, 2026 10:05 AM', action:'Create', desc:'New standard permission set created: Audiences', entity:'Audiences', entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:2,  date:'Jun 16, 2026 10:02 AM', action:'Edit',   desc:'Org Settings - Data Manager updated: Behavioural Events, Webhooks, Cards, Product Inventory, Communication & Gateway, Milestone / Target Groups, Manage Partners, Liability Owners added', entity:'Org Settings - Data Manager', entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:3,  date:'Jun 16, 2026 09:58 AM', action:'Edit',   desc:'Data Import updated: Behavioural Events (View), Webhooks (View), Cards (View), Product Inventory (full), Target Groups (View), Partners (View) added', entity:'Data Import', entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:4,  date:'Jun 16, 2026 09:55 AM', action:'Create', desc:'Audiences permission set assigned to Harsh Verma', entity:'Harsh Verma', entityType:'User', by:'George Johnson', email:'george.johnson@capillarytech.com' },
  { id:5,  date:'Jun 11, 2026 3:42 PM',  action:'Create', desc:'New permission set created: API Access Configuration Admin', entity:'API Access Configuration Admin', entityType:'Permission set', by:'George Johnson', email:'george.johnson@capillarytech.com' },
  { id:6,  date:'Jun 10, 2026 11:20 AM', action:'Edit',   desc:'Permission set updated: BE — Manager', entity:'BE — Manager', entityType:'Permission set', by:'George Johnson', email:'george.johnson@capillarytech.com' },
  { id:7,  date:'Jun 10, 2026 11:05 AM', action:'Create', desc:'New permission set created: Cards — Manager', entity:'Cards — Manager', entityType:'Permission set', by:'George Johnson', email:'george.johnson@capillarytech.com' },
  { id:8,  date:'Mar 09, 2026 1:10 PM',  action:'Logout', desc:'User logged out', entity:'—', entityType:'—', by:'Rick Sanchez', email:'rick.sanchez@adultswim.com' },
  { id:9,  date:'Feb 19, 2026 11:28 AM', action:'Approval', desc:'Permission set approved and assigned to user', entity:'BE — View', entityType:'Permission set', by:'Morty Smith', email:'morty.smith@adultswim.com' },
  { id:10, date:'Aug 21, 2023 9:23 AM',  action:'Create', desc:'Organization created', entity:'Big Basket Prod', entityType:'Organization', by:'Rick Sanchez', email:'rick.sanchez@adultswim.com' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PBadge({ type }) {
  const c = PC[type]
  return <span style={{ background:c.bg, color:c.tx, border:`1px solid ${c.br}`, borderRadius:4, padding:'2px 9px', fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>{type}</span>
}

function StatusDot({ status }) {
  const c = status==='Active'?'#16a34a':status==='Pending'?'#d97706':'#9ca3af'
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:13, color:c, fontWeight:500 }}>
    <span style={{ width:7, height:7, borderRadius:'50%', background:c, display:'inline-block' }} />{status}
  </span>
}

function ActionBadge({ action }) {
  const m = { Create:{bg:'#f0fdf4',tx:'#15803d'}, Edit:{bg:'#fffbeb',tx:'#b45309'}, Delete:{bg:'#fef2f2',tx:'#dc2626'}, Login:{bg:'#eff6ff',tx:'#1d4ed8'}, Logout:{bg:'#f9fafb',tx:'#6b7280'}, Approval:{bg:'#faf5ff',tx:'#7c3aed'}, Export:{bg:'#fff7ed',tx:'#c2410c'} }
  const c = m[action]||{bg:'#f3f4f6',tx:'#374151'}
  return <span style={{ background:c.bg, color:c.tx, borderRadius:4, padding:'2px 8px', fontSize:12, fontWeight:600 }}>{action}</span>
}

function initials(name) { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }
function avatarColor(name) { const h=['#6366f1','#0ea5e9','#f59e0b','#10b981','#ef4444','#ec4899','#f97316']; return h[name.charCodeAt(0)%h.length] }

// ─── Permission set drawer ────────────────────────────────────────────────────

function SetDrawer({ set, onClose, allSets }) {
  const [edit, setEdit] = useState(false)
  const [lp, setLp] = useState(JSON.parse(JSON.stringify(set.perms)))
  const toggle = (mod,p) => setLp(prev => { const c=prev[mod]||[]; return {...prev,[mod]:c.includes(p)?c.filter(x=>x!==p):[...c,p]} })
  const visibleMods = set.super ? Object.keys(MODULES) : Object.keys(set.perms)
  const userCount = INIT_USERS.filter(u=>u.sets.includes(set.name)).length

  return (
    <div style={{ position:'fixed', right:0, top:0, bottom:0, width:540, background:'#fff', boxShadow:'-4px 0 32px rgba(0,0,0,0.13)', display:'flex', flexDirection:'column', zIndex:200 }}>
      <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ flex:1, marginRight:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <span style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{set.name}</span>
              <span style={{ background:set.type==='Standard'?'#f0f9ff':'#f5f3ff', color:set.type==='Standard'?'#0369a1':'#7c3aed', border:`1px solid ${set.type==='Standard'?'#bae6fd':'#ddd6fe'}`, borderRadius:4, padding:'1px 8px', fontSize:11, fontWeight:600 }}>{set.type}</span>
            </div>
            <div style={{ fontSize:13, color:'#6b7280', lineHeight:1.5 }}>{set.desc}</div>
            <div style={{ fontSize:12, color:'#9ca3af', marginTop:5, display:'flex', gap:16 }}>
              <span>👥 {userCount} user{userCount!==1?'s':''}</span>
              <span>Updated by {set.by} · {set.on}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:20, padding:4 }}>✕</button>
        </div>
        {set.super && <div style={{ marginTop:12, padding:'9px 12px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:7, fontSize:12, color:'#15803d' }}>✅ Includes ALL new granular permissions. Current users keep full access.</div>}
        {!set.super && (
          <div style={{ marginTop:12, display:'flex', gap:8 }}>
            <button onClick={()=>setEdit(!edit)} style={{ padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:500, cursor:'pointer', background:edit?'#111827':'#fff', color:edit?'#fff':'#374151', border:edit?'none':'1px solid #d1d5db' }}>{edit?'Cancel':'✏️ Edit'}</button>
            {edit && <button onClick={()=>setEdit(false)} style={{ padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:600, cursor:'pointer', background:'#16a34a', color:'#fff', border:'none' }}>Save changes</button>}
          </div>
        )}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
        <div style={{ fontSize:12, color:'#9ca3af', marginBottom:12, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>
          {set.super ? 'All modules' : `${visibleMods.length} module${visibleMods.length!==1?'s':''} with access`}
        </div>
        {visibleMods.map(mod => {
          const assigned = (edit?lp:set.perms)[mod]||[]
          const allModPerms = MODULES[mod].perms
          return (
            <div key={mod} style={{ marginBottom:10, border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
              <div style={{ padding:'10px 14px', background:'#fafafa', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:MODULES[mod].color, flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{mod}</span>
                <span style={{ fontSize:11, color:'#9ca3af', marginLeft:'auto' }}>{MODULES[mod].desc}</span>
              </div>
              <div style={{ padding:'10px 14px', display:'flex', gap:8, flexWrap:'wrap', borderTop:'1px solid #f3f4f6' }}>
                {edit ? allModPerms.map(p => {
                  const on=assigned.includes(p); const c=PC[p]
                  return <button key={p} onClick={()=>toggle(mod,p)} style={{ padding:'4px 11px', borderRadius:5, fontSize:12, fontWeight:600, cursor:'pointer', background:on?c.bg:'#f9fafb', color:on?c.tx:'#9ca3af', border:`1.5px solid ${on?c.br:'#e5e7eb'}` }}>{on?'✓ ':''}{p}</button>
                }) : assigned.map(p => <PBadge key={p} type={p} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── User drawer ──────────────────────────────────────────────────────────────

function UserDrawer({ user, onClose, allSets, onUpdate }) {
  const [editSets, setEditSets] = useState(false)
  const [selSets, setSelSets] = useState([...user.sets])
  const toggleSet = s => setSelSets(prev => prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])

  return (
    <div style={{ position:'fixed', right:0, top:0, bottom:0, width:480, background:'#fff', boxShadow:'-4px 0 32px rgba(0,0,0,0.13)', display:'flex', flexDirection:'column', zIndex:200 }}>
      <div style={{ padding:'20px 24px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:avatarColor(user.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff' }}>{initials(user.name)}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{user.name}</div>
            <div style={{ fontSize:13, color:'#6b7280' }}>{user.email}</div>
            <StatusDot status={user.status} />
          </div>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:20, padding:4 }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        {/* Profile */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Profile</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['User type', user.type],['Last active', user.lastActive],['Status', user.status],['Email', user.email]].map(([l,v])=>(
              <div key={l} style={{ padding:'10px 14px', background:'#f9fafb', borderRadius:8 }}>
                <div style={{ fontSize:11, color:'#9ca3af', marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:500, color:'#111827' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission sets */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontSize:12, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Permission sets</div>
            {user.type!=='Organization owner' && (
              <button onClick={()=>setEditSets(!editSets)} style={{ fontSize:12, color:'#6366f1', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>{editSets?'Cancel':'Edit'}</button>
            )}
          </div>
          {user.type==='Organization owner' ? (
            <div style={{ padding:'10px 14px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:8, fontSize:13, color:'#b45309' }}>Organization owners have full access to everything. Permission sets don't apply.</div>
          ) : editSets ? (
            <div>
              {allSets.map(s => {
                const on = selSets.includes(s.name)
                return (
                  <div key={s.id} onClick={()=>toggleSet(s.name)} style={{ padding:'10px 14px', border:`1.5px solid ${on?'#6366f1':'#e5e7eb'}`, borderRadius:8, marginBottom:8, cursor:'pointer', background:on?'#f5f3ff':'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{s.name}</div>
                      <div style={{ fontSize:11, color:'#6b7280' }}>{Object.keys(s.perms).length} modules</div>
                    </div>
                    <span style={{ width:18, height:18, borderRadius:4, border:`2px solid ${on?'#6366f1':'#d1d5db'}`, background:on?'#6366f1':'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{on?'✓':''}</span>
                  </div>
                )
              })}
              <button onClick={()=>{ onUpdate(user.id, selSets); setEditSets(false) }} style={{ width:'100%', marginTop:8, padding:'10px', background:'#111827', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Save changes</button>
            </div>
          ) : (
            <div>
              {selSets.length===0 ? (
                <div style={{ padding:'14px', background:'#f9fafb', borderRadius:8, fontSize:13, color:'#9ca3af', textAlign:'center' }}>No permission sets assigned</div>
              ) : selSets.map(name => {
                const s = allSets.find(x=>x.name===name)
                if(!s) return null
                const mods = Object.keys(s.perms)
                return (
                  <div key={name} style={{ padding:'10px 14px', border:'1px solid #e5e7eb', borderRadius:8, marginBottom:8 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:4 }}>{name}</div>
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                      {mods.slice(0,3).map(m=><span key={m} style={{ background:'#f3f4f6', color:'#374151', borderRadius:4, padding:'1px 7px', fontSize:11 }}>{m}</span>)}
                      {mods.length>3&&<span style={{ background:'#f3f4f6', color:'#6b7280', borderRadius:4, padding:'1px 7px', fontSize:11 }}>+{mods.length-3}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add user modal ───────────────────────────────────────────────────────────

function AddUserModal({ onClose, allSets, onAdd }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', mobile:'', type:'Standard user' })
  const [selSets, setSelSets] = useState([])
  const toggleSet = s => setSelSets(prev => prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])
  const valid = form.firstName.trim() && form.email.includes('@')

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
      <div style={{ background:'#fff', borderRadius:12, width:560, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>Add new user</div>
            <div style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>Step {step} of 2 — {step===1?'User details':'Assign permission sets'}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:20 }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {step===1 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['First name *','firstName','e.g. Beth'],['Last name','lastName','e.g. Smith']].map(([l,k,p])=>(
                  <div key={k}>
                    <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>{l}</label>
                    <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={p}
                      style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Email address *</label>
                <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="e.g. beth.smith@brand.com" type="email"
                  style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Mobile number</label>
                <input value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} placeholder="+91 9876543210"
                  style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:8 }}>User type</label>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['Standard user','Admin','Organization owner'].map(t=>(
                    <div key={t} onClick={()=>setForm({...form,type:t})} style={{ padding:'11px 14px', border:`1.5px solid ${form.type===t?'#6366f1':'#e5e7eb'}`, borderRadius:8, cursor:'pointer', background:form.type===t?'#f5f3ff':'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{t}</div>
                        <div style={{ fontSize:12, color:'#6b7280' }}>{ t==='Standard user'?'Restricted access, assigned via permission sets':t==='Admin'?'Can manage standard users and assign permissions':'Full access to all org settings and users' }</div>
                      </div>
                      <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${form.type===t?'#6366f1':'#d1d5db'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {form.type===t && <div style={{ width:8, height:8, borderRadius:'50%', background:'#6366f1' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {form.type==='Organization owner' ? (
                <div style={{ padding:'16px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, marginBottom:16, fontSize:13, color:'#b45309' }}>
                  Organization owners have full access. Permission sets are not applicable.
                </div>
              ) : (
                <>
                  <div style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>
                    Select permission sets for <strong style={{color:'#111827'}}>{form.firstName} {form.lastName}</strong>. You can change these later.
                    {selSets.length>0 && <strong style={{color:'#6366f1'}}> ({selSets.length} selected)</strong>}
                  </div>
                  {allSets.map(s => {
                    const on = selSets.includes(s.name)
                    const mods = Object.keys(s.perms)
                    return (
                      <div key={s.id} onClick={()=>toggleSet(s.name)} style={{ padding:'12px 14px', border:`1.5px solid ${on?'#6366f1':'#e5e7eb'}`, borderRadius:8, marginBottom:10, cursor:'pointer', background:on?'#f5f3ff':'#fff' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                              <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{s.name}</span>
                              <span style={{ background:s.type==='Standard'?'#f0f9ff':'#f5f3ff', color:s.type==='Standard'?'#0369a1':'#7c3aed', borderRadius:4, padding:'1px 7px', fontSize:10, fontWeight:600 }}>{s.type}</span>
                            </div>
                            <div style={{ fontSize:12, color:'#6b7280', marginBottom:6 }}>{s.desc}</div>
                            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                              {mods.slice(0,3).map(m=><span key={m} style={{ background:'#f3f4f6', color:'#374151', borderRadius:4, padding:'1px 7px', fontSize:11 }}>{m}</span>)}
                              {mods.length>3&&<span style={{ background:'#f3f4f6', color:'#6b7280', borderRadius:4, padding:'1px 7px', fontSize:11 }}>+{mods.length-3}</span>}
                            </div>
                          </div>
                          <span style={{ width:20, height:20, borderRadius:4, border:`2px solid ${on?'#6366f1':'#d1d5db'}`, background:on?'#6366f1':'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0, marginLeft:12 }}>{on?'✓':''}</span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between' }}>
          <button onClick={step===1?onClose:()=>setStep(1)} style={{ padding:'9px 18px', borderRadius:8, fontSize:14, cursor:'pointer', background:'#fff', color:'#374151', border:'1px solid #d1d5db', fontWeight:500 }}>{step===1?'Cancel':'← Back'}</button>
          <button disabled={step===1&&!valid} onClick={()=>{ if(step===1){setStep(2)}else{onAdd({...form,sets:selSets});onClose()} }}
            style={{ padding:'9px 20px', borderRadius:8, fontSize:14, cursor:'pointer', background:step===1&&!valid?'#e5e7eb':'#111827', color:step===1&&!valid?'#9ca3af':'#fff', border:'none', fontWeight:600 }}>
            {step===1?'Next →':'Add user'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── New permission set modal ─────────────────────────────────────────────────

function NewSetModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [sel, setSel] = useState({})
  const [step, setStep] = useState(1)
  const toggle = (m,p) => setSel(prev => { const c=prev[m]||[]; return {...prev,[m]:c.includes(p)?c.filter(x=>x!==p):[...c,p]} })
  const total = Object.values(sel).reduce((s,a)=>s+a.length,0)
  const assigned = Object.keys(sel).filter(m=>sel[m].length>0)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
      <div style={{ background:'#fff', borderRadius:12, width:660, maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>New permission set</div>
            <div style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>Step {step} of 2 — {step===1?'Basic info':`Choose permissions${total>0?` · ${total} selected`:''}`}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:20 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {step===1 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Permission set name *</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. BE Viewer, Card Config Manager"
                  style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Description</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What is this permission set for?" rows={3}
                  style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none', resize:'none' }} />
              </div>
            </div>
          ) : (
            <div>
              {assigned.length>0 && <div style={{ marginBottom:16, padding:'10px 14px', background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:8, fontSize:13, color:'#7c3aed' }}>{assigned.length} module{assigned.length!==1?'s':''} · {total} permissions selected</div>}
              {Object.keys(MODULES).map(mod => {
                const a=sel[mod]||[]
                return (
                  <div key={mod} style={{ marginBottom:10, border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
                    <div style={{ padding:'9px 14px', background:'#fafafa', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:MODULES[mod].color }} />
                      <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{mod}</span>
                      <span style={{ fontSize:11, color:'#9ca3af', marginLeft:'auto' }}>{MODULES[mod].desc}</span>
                    </div>
                    <div style={{ padding:'10px 14px', display:'flex', gap:8, flexWrap:'wrap' }}>
                      {MODULES[mod].perms.map(p => {
                        const on=a.includes(p); const c=PC[p]
                        return <button key={p} onClick={()=>toggle(mod,p)} style={{ padding:'5px 12px', borderRadius:5, fontSize:12, fontWeight:600, cursor:'pointer', background:on?c.bg:'#fff', color:on?c.tx:'#9ca3af', border:`1.5px solid ${on?c.br:'#e5e7eb'}` }}>{on?'✓ ':'+ '}{p}</button>
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between' }}>
          <button onClick={step===1?onClose:()=>setStep(1)} style={{ padding:'9px 18px', borderRadius:8, fontSize:14, cursor:'pointer', background:'#fff', color:'#374151', border:'1px solid #d1d5db', fontWeight:500 }}>{step===1?'Cancel':'← Back'}</button>
          <button disabled={step===1&&!name.trim()} onClick={()=>step===1?setStep(2):(onAdd({name,desc,perms:Object.fromEntries(Object.entries(sel).filter(([,v])=>v.length>0))}),onClose())}
            style={{ padding:'9px 20px', borderRadius:8, fontSize:14, cursor:'pointer', background:step===1&&!name.trim()?'#e5e7eb':'#111827', color:step===1&&!name.trim()?'#9ca3af':'#fff', border:'none', fontWeight:600 }}>
            {step===1?'Next →':'Create permission set'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function UsersTab({ users, setUsers, allSets }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchType = typeFilter==='All' || u.type===typeFilter
    const matchStatus = statusFilter==='All' || u.status===statusFilter
    return matchSearch && matchType && matchStatus
  })

  const counts = { active: users.filter(u=>u.status==='Active').length, pending: users.filter(u=>u.status==='Pending').length, deactivated: users.filter(u=>u.status==='Deactivated').length }

  const updateUserSets = (uid, sets) => {
    setUsers(prev => prev.map(u => u.id===uid ? {...u, sets} : u))
    setSelectedUser(prev => prev?.id===uid ? {...prev, sets} : prev)
  }

  const addUser = (data) => {
    setUsers(prev => [...prev, { id: Date.now(), name:`${data.firstName} ${data.lastName}`, email:data.email, type:data.type, status:'Pending', lastActive:'—', sets:data.sets }])
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display:'flex', gap:24, marginBottom:20 }}>
        {[['Active users',counts.active,'#16a34a'],['Invite pending',counts.pending,'#d97706'],['Deactivated',counts.deactivated,'#9ca3af'],['Total users',users.length,'#111827']].map(([l,v,c])=>(
          <div key={l} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:c }} />
            <span style={{ fontSize:13, color:'#6b7280' }}>{l}</span>
            <span style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users (name or email)..."
            style={{ width:'100%', padding:'8px 12px 8px 34px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, outline:'none' }} />
        </div>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, outline:'none', cursor:'pointer', background:'#fff' }}>
          <option value="All">All types</option>
          {['Standard user','Admin','Organization owner'].map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, outline:'none', cursor:'pointer', background:'#fff' }}>
          <option value="All">All status</option>
          {['Active','Pending','Deactivated'].map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={()=>setShowAdd(true)} style={{ padding:'8px 18px', background:'#111827', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>+ New user</button>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 80px', padding:'10px 20px', background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
          {['Name / Email','User type','Last active / Status',''].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:'#6b7280' }}>{h}</span>)}
        </div>
        {filtered.map((u,i)=>(
          <div key={u.id} onClick={()=>setSelectedUser(u===selectedUser?null:u)}
            style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 80px', padding:'13px 20px', alignItems:'center', borderBottom:i<filtered.length-1?'1px solid #f3f4f6':'none', cursor:'pointer', background:selectedUser?.id===u.id?'#f5f3ff':'#fff', transition:'background 0.1s' }}
            onMouseEnter={e=>{ if(selectedUser?.id!==u.id) e.currentTarget.style.background='#fafafa' }}
            onMouseLeave={e=>{ e.currentTarget.style.background = selectedUser?.id===u.id?'#f5f3ff':'#fff' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:avatarColor(u.name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>{initials(u.name)}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>{u.name}</div>
                <div style={{ fontSize:12, color:'#6b7280' }}>{u.email}</div>
              </div>
            </div>
            <span style={{ fontSize:13, color:'#374151' }}>{u.type}</span>
            <div>
              <div style={{ fontSize:12, color:'#374151', marginBottom:3 }}>{u.lastActive}</div>
              <StatusDot status={u.status} />
            </div>
            <span style={{ fontSize:13, color:'#6366f1', fontWeight:500 }}>View →</span>
          </div>
        ))}
        {filtered.length===0 && <div style={{ padding:'40px', textAlign:'center', color:'#9ca3af', fontSize:14 }}>No users found</div>}
      </div>
      <div style={{ marginTop:10, fontSize:12, color:'#9ca3af' }}>Showing {filtered.length} of {users.length} users</div>

      {selectedUser && (
        <>
          <div onClick={()=>setSelectedUser(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:199 }} />
          <UserDrawer user={selectedUser} onClose={()=>setSelectedUser(null)} allSets={allSets} onUpdate={updateUserSets} />
        </>
      )}
      {showAdd && <AddUserModal onClose={()=>setShowAdd(false)} allSets={allSets} onAdd={addUser} />}
    </div>
  )
}

function AuditTab() {
  const [search, setSearch] = useState('')
  const filtered = AUDIT_LOGS.filter(l => !search || l.desc.toLowerCase().includes(search.toLowerCase()) || l.by.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search audit logs..."
            style={{ padding:'8px 12px 8px 34px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, width:300, outline:'none' }} />
        </div>
        <button style={{ padding:'8px 16px', background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151' }}>↑ Export logs</button>
      </div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr 200px 180px', padding:'10px 20px', background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
          {['Date & time','Activity','Entity','Performed by'].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:'#6b7280' }}>{h}</span>)}
        </div>
        {filtered.map((l,i)=>(
          <div key={l.id} style={{ display:'grid', gridTemplateColumns:'160px 1fr 200px 180px', padding:'13px 20px', alignItems:'start', borderBottom:i<filtered.length-1?'1px solid #f3f4f6':'none' }}>
            <span style={{ fontSize:12, color:'#6b7280' }}>{l.date}</span>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <ActionBadge action={l.action} />
              </div>
              <div style={{ fontSize:13, color:'#374151' }}>{l.desc}</div>
            </div>
            <div>
              {l.entity!=='—' && <div style={{ fontSize:13, fontWeight:500, color:'#111827' }}>{l.entity}</div>}
              {l.entityType!=='—' && <div style={{ fontSize:11, color:'#9ca3af' }}>{l.entityType}</div>}
            </div>
            <div>
              <div style={{ fontSize:13, color:'#374151', fontWeight:500 }}>{l.by}</div>
              <div style={{ fontSize:11, color:'#9ca3af' }}>{l.email}</div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{ padding:'40px', textAlign:'center', color:'#9ca3af' }}>No logs found</div>}
      </div>
    </div>
  )
}

function PermSetsTab({ sets, setSets }) {
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = sets.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.desc.toLowerCase().includes(search.toLowerCase()))

  const addSet = (data) => {
    setSets(prev=>[...prev,{ id:Date.now(), name:data.name, desc:data.desc||'Custom permission set', type:'Custom', by:'George Johnson', on:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), perms:data.perms }])
  }

  const deleteSet = (id) => {
    setSets(prev=>prev.filter(s=>s.id!==id))
    if(selected?.id===id) setSelected(null)
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search permission sets..."
            style={{ padding:'8px 12px 8px 34px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, width:280, outline:'none' }} />
        </div>
        <button onClick={()=>setShowNew(true)} style={{ padding:'8px 18px', background:'#111827', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>+ New permission set</button>
      </div>
      <div style={{ padding:'11px 16px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, marginBottom:16, fontSize:13, color:'#1e40af' }}>
        <strong>How this works:</strong> Standard sets (Org Settings - Data Manager, Data Import, Engage+, API Access Config, Audiences) are updated with all new module permissions — existing users keep their current access. Create custom sets for specific, limited access.
      </div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 240px 100px 80px 150px 100px', padding:'10px 20px', background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
          {['Permission set','Modules covered','Type','Users','Last updated',''].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:'#6b7280' }}>{h}</span>)}
        </div>
        {filtered.map((s,i)=>{
          const mods=Object.keys(s.perms); const userCount=INIT_USERS.filter(u=>u.sets.includes(s.name)).length
          return (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 240px 100px 80px 150px 100px', padding:'14px 20px', alignItems:'center', borderBottom:i<filtered.length-1?'1px solid #f3f4f6':'none', background:selected?.id===s.id?'#f5f3ff':'#fff', cursor:'pointer' }}
              onMouseEnter={e=>{ if(selected?.id!==s.id) e.currentTarget.style.background='#fafafa' }}
              onMouseLeave={e=>{ e.currentTarget.style.background=selected?.id===s.id?'#f5f3ff':'#fff' }}>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)}>
                <div style={{ fontSize:14, fontWeight:600, color:'#111827', display:'flex', alignItems:'center', gap:6 }}>{s.super&&'🔑 '}{s.name}</div>
                <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>{s.desc}</div>
              </div>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {mods.slice(0,2).map(m=><span key={m} style={{ background:'#f3f4f6', color:'#374151', borderRadius:4, padding:'2px 7px', fontSize:11, fontWeight:500 }}>{m}</span>)}
                {mods.length>2&&<span style={{ background:'#f3f4f6', color:'#6b7280', borderRadius:4, padding:'2px 7px', fontSize:11 }}>+{mods.length-2}</span>}
              </div>
              <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ background:s.type==='Standard'?'#f0f9ff':'#f5f3ff', color:s.type==='Standard'?'#0369a1':'#7c3aed', border:`1px solid ${s.type==='Standard'?'#bae6fd':'#ddd6fe'}`, borderRadius:4, padding:'2px 8px', fontSize:11, fontWeight:600, width:'fit-content' }}>{s.type}</span>
              <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{userCount}</span>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)}>
                <div style={{ fontSize:12, color:'#374151' }}>{s.on}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{s.by}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ fontSize:13, color:'#6366f1', fontWeight:500, cursor:'pointer' }}>View</span>
                {s.type==='Custom' && <span onClick={e=>{e.stopPropagation();deleteSet(s.id)}} style={{ fontSize:13, color:'#ef4444', fontWeight:500, cursor:'pointer' }}>Delete</span>}
              </div>
            </div>
          )
        })}
        {filtered.length===0&&<div style={{ padding:'40px', textAlign:'center', color:'#9ca3af' }}>No permission sets found</div>}
      </div>
      <div style={{ marginTop:10, fontSize:12, color:'#9ca3af' }}>Showing {filtered.length} of {sets.length} permission sets</div>
      {selected&&(<><div onClick={()=>setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:199 }}/><SetDrawer set={selected} onClose={()=>setSelected(null)} allSets={sets}/></>)}
      {showNew&&<NewSetModal onClose={()=>setShowNew(false)} onAdd={addSet}/>}
    </div>
  )
}

// ─── User Management page ─────────────────────────────────────────────────────

function UserMgmtPage({ onBack }) {
  const [tab, setTab] = useState('Users')
  const [users, setUsers] = useState(INIT_USERS)
  const [sets, setSets] = useState(INIT_SETS)
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom:20, fontSize:13, color:'#6b7280', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>← Back to home</button>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827' }}>User Management</h1>
          <p style={{ fontSize:14, color:'#6b7280', marginTop:3 }}>Manage users, audit activity and configure permission sets</p>
        </div>
      </div>
      <div style={{ display:'flex', borderBottom:'1px solid #e5e7eb', marginBottom:24 }}>
        {['Users','Audit logs','Permission sets'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 20px', background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:tab===t?600:400, color:tab===t?'#111827':'#6b7280', borderBottom:tab===t?'2px solid #111827':'2px solid transparent', marginBottom:-1 }}>{t}</button>
        ))}
      </div>
      {tab==='Users'&&<UsersTab users={users} setUsers={setUsers} allSets={sets}/>}
      {tab==='Audit logs'&&<AuditTab/>}
      {tab==='Permission sets'&&<PermSetsTab sets={sets} setSets={setSets}/>}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV=[
  {id:'aira',   icon:'✦',  label:'aiRA',        sub:[]},
  {id:'loyalty',icon:'🏷',  label:'Loyalty',     sub:['Programs','Promotions']},
  {id:'engage', icon:'📣',  label:'Engage',      sub:['Campaigns','Journeys']},
  {id:'rewards',icon:'🎁',  label:'Rewards',     sub:['Coupons','Cart Promotions','Gift Vouchers','Badges','Rewards Catalog']},
  {id:'aud',    icon:'👥',  label:'Audiences',   sub:[]},
  {id:'chan',   icon:'❄️',  label:'Channels',    sub:['Creatives','Channel Setup']},
  {id:'mc',     icon:'🛡',  label:'Member Care', sub:[]},
  {id:'ins',    icon:'📊',  label:'Insights',    sub:['Reports','Library','Segments']},
]
const NAV2=[
  {id:'dm',  icon:'🗂',  label:'Data Management', sub:['Entities','Dataflows','Imports','Exports','Event Notifications']},
  {id:'ext', icon:'<>', label:'Extensions',      sub:['API Extensions','UI Extensions','Dev Console','Custom Apps']},
]
const NAV3=[{id:'set',icon:'⚙️',label:'Settings',sub:[]}]

function Sidebar({ expanded, setExpanded, active, setActive }) {
  const [hover,setHover]=useState(null)
  const Item=({item})=>{
    const isActive=active===item.id; const isH=hover===item.id&&!expanded
    return(
      <div style={{position:'relative'}} onMouseEnter={()=>setHover(item.id)} onMouseLeave={()=>setHover(null)}>
        <div onClick={()=>setActive(item.id)} style={{display:'flex',alignItems:'center',gap:12,padding:expanded?'9px 16px':'9px 0',justifyContent:expanded?'flex-start':'center',cursor:'pointer',borderRadius:6,margin:'1px 6px',background:isActive?'rgba(255,255,255,0.12)':'transparent'}}>
          <span style={{fontSize:15,width:22,textAlign:'center',flexShrink:0,opacity:isActive?1:0.65}}>{item.icon}</span>
          {expanded&&<span style={{fontSize:14,color:isActive?'#fff':'#cbd5e1',fontWeight:isActive?600:400,whiteSpace:'nowrap'}}>{item.label}</span>}
          {expanded&&item.sub.length>0&&<span style={{marginLeft:'auto',fontSize:11,color:'#475569'}}>›</span>}
        </div>
        {isH&&!expanded&&(
          <div style={{position:'absolute',left:56,top:-4,background:'#1e293b',borderRadius:8,minWidth:180,zIndex:999,boxShadow:'0 8px 24px rgba(0,0,0,0.4)',overflow:'hidden'}}>
            <div style={{padding:'8px 16px 6px',fontSize:12,color:'#64748b',fontWeight:500,borderBottom:item.sub.length>0?'1px solid #334155':'none'}}>{item.label}</div>
            {item.sub.map(s=><div key={s} style={{padding:'8px 16px',fontSize:14,color:'#e2e8f0',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{s}</div>)}
          </div>
        )}
        {expanded&&isActive&&item.sub.length>0&&(
          <div style={{marginLeft:36,borderLeft:'2px solid #334155'}}>
            {item.sub.map(s=><div key={s} style={{padding:'7px 16px',fontSize:14,color:'#94a3b8',cursor:'pointer'}}>{s}</div>)}
          </div>
        )}
      </div>
    )
  }
  return(
    <div style={{width:expanded?240:68,background:'#0f172a',display:'flex',flexDirection:'column',height:'100vh',flexShrink:0,transition:'width 0.2s ease',zIndex:10}}>
      <div style={{padding:expanded?'14px 16px':'14px 0',display:'flex',alignItems:'center',gap:10,justifyContent:expanded?'flex-start':'center',borderBottom:'1px solid #1e293b'}}>
        <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#f97316,#ec4899,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>✦</div>
        {expanded&&<span style={{fontSize:15,fontWeight:700,color:'#fff',letterSpacing:0.3}}>Capillary</span>}
      </div>
      <div style={{flex:1,overflowY:'auto',paddingTop:8,paddingBottom:8}}>
        {NAV.map(i=><Item key={i.id} item={i}/>)}
        <div style={{height:1,background:'#1e293b',margin:'8px 12px'}}/>
        {NAV2.map(i=><Item key={i.id} item={i}/>)}
        <div style={{height:1,background:'#1e293b',margin:'8px 12px'}}/>
        {NAV3.map(i=><Item key={i.id} item={i}/>)}
      </div>
      <div style={{borderTop:'1px solid #1e293b',padding:'10px 6px'}}>
        <div onClick={()=>setExpanded(!expanded)} style={{display:'flex',alignItems:'center',gap:10,padding:expanded?'8px 12px':'8px 0',justifyContent:expanded?'flex-start':'center',cursor:'pointer',borderRadius:6,color:'#64748b',fontSize:13}}>
          <span style={{fontSize:16}}>{expanded?'⊟':'⊞'}</span>
          {expanded&&<span>Collapse panel</span>}
        </div>
      </div>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [expanded,setExpanded]=useState(false)
  const [active,setActive]=useState('aira')
  const [page,setPage]=useState('home')
  const [showProfile,setShowProfile]=useState(false)

  return(
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      <Sidebar expanded={expanded} setExpanded={setExpanded} active={active} setActive={setActive}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Top bar */}
        <div style={{height:52,background:'#fff',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',padding:'0 24px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
            <span style={{fontSize:15,fontWeight:600,color:'#111827'}}>Big Basket Prod</span>
            <span style={{color:'#9ca3af',fontSize:12}}>⌄</span>
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
            <button style={{width:32,height:32,border:'none',background:'transparent',cursor:'pointer',fontSize:17,color:'#6b7280'}}>✦</button>
            <div style={{width:1,height:24,background:'#e5e7eb'}}/>
            <div style={{position:'relative'}}>
              <button onClick={()=>setShowProfile(!showProfile)} style={{width:34,height:34,borderRadius:'50%',background:'#f3f4f6',border:'1px solid #e5e7eb',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>👤</button>
              {showProfile&&(
                <>
                  <div onClick={()=>setShowProfile(false)} style={{position:'fixed',inset:0,zIndex:49}}/>
                  <div style={{position:'absolute',right:0,top:42,background:'#fff',border:'1px solid #e5e7eb',borderRadius:10,width:220,boxShadow:'0 8px 24px rgba(0,0,0,0.12)',zIndex:50,overflow:'hidden'}}>
                    <div style={{padding:'12px 16px',borderBottom:'1px solid #f3f4f6'}}>
                      <div style={{fontSize:14,fontWeight:600,color:'#111827'}}>George Johnson</div>
                      <div style={{fontSize:12,color:'#6b7280'}}>george.johnson@capillarytech.com</div>
                    </div>
                    {[['👥 Manage users',()=>{setPage('usermgmt');setShowProfile(false)}],['📄 Documentation',null],['🎓 Capillary Academy',null],['↪ Logout',null]].map(([label,fn])=>(
                      <div key={label} onClick={fn||undefined} style={{padding:'10px 16px',fontSize:14,color:'#374151',cursor:fn?'pointer':'default'}} onMouseEnter={e=>{if(fn)e.currentTarget.style.background='#f9fafb'}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>{label}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:'auto',padding:32,background:'#fff'}}>
          {page==='home'&&(
            <div>
              <h2 style={{fontSize:20,fontWeight:600,color:'#111827',marginBottom:4}}>Good afternoon, George. What's next?</h2>
              <p style={{fontSize:14,color:'#9ca3af',marginBottom:32}}>Click the profile icon → <strong style={{color:'#6366f1'}}>Manage users</strong> to open the full User Management demo.</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,maxWidth:700}}>
                {[['📊 Analytics','Ask about performance and customer trends'],['🔨 Build','Create promotions, campaigns and journeys'],['📖 Guide','Ask anything about Capillary products']].map(([t,d])=>(
                  <div key={t} style={{padding:'20px 18px',border:'1px solid #e5e7eb',borderRadius:10,cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                    <div style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:4}}>{t}</div>
                    <div style={{fontSize:13,color:'#6b7280'}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page==='usermgmt'&&<UserMgmtPage onBack={()=>setPage('home')}/>}
        </div>
      </div>
    </div>
  )
}
