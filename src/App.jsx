import { useState } from 'react'
import './App.css'

// ─── DS TOKENS ────────────────────────────────────────────────────────────────
const DS = {
  green7:    '#42B040',
  green8:    '#1F9A1D',
  green1:    '#ECF7EC',
  neutral1:  '#FAFBFC',
  neutral2:  '#F4F5F7',
  neutral3:  '#EBECF0',
  neutral4:  '#DFE2E7',
  neutral5:  '#B3BAC5',
  neutral6:  '#97A0AF',
  neutral7:  '#7A869A',
  neutral8:  '#5E6C84',
  neutral9:  '#42526E',
  neutral10: '#253858',
  neutral11: '#091E42',
  red6:      '#E83135',
  blue9:     '#2466EA',
  blue1:     '#EBF3FF',
  orange7:   '#F87D23',
  orange1:   '#FFF4EC',
  navBg:     '#0D1B35',
  navDarker: '#0B1628',
  white:     '#FFFFFF',
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const MODULES = {
  'Behavioural Events':         { color:'#6366f1', nav:'Data Management', perms:['View','Create','Edit','Delete'], desc:'Event schemas, attributes, sources and destinations' },
  'Webhooks':                   { color:'#8b5cf6', nav:'Data Management', perms:['View','Create','Delete'],        desc:'Webhook configurations and till code management. No Edit action.' },
  'Card Configuration':         { color:'#0ea5e9', nav:'Data Management', perms:['View','Create','Edit','Delete'], desc:'Card series, generated cards and global card settings' },
  'Product / Location Entities':{ color:'#64748b', nav:'Data Management', perms:['View','Create','Edit','Delete'], desc:'Brands, categories, stores, concepts, tills, attributes' },
  'Communication & Gateway':    { color:'#14b8a6', nav:'Settings',        perms:['View','Create','Edit','Delete'], desc:'Domains, gateway mapping, gateways and OU sender IDs (PHP / xaja)' },
  'OAuth / API Management':     { color:'#f59e0b', nav:'Settings',        perms:['View','Create','Edit','Delete'], desc:'API clients, access groups, resources and permissions' },
  'Target Groups / Milestones': { color:'#f97316', nav:'Data Management', perms:['View','Create','Edit','Delete'], desc:'Target group and milestone configuration' },
  'Manage Partners':            { color:'#ef4444', nav:'Data Management', perms:['View','Create','Edit','Delete'], desc:'Partner entity list and details' },
  'Manage Liability Owners':    { color:'#10b981', nav:'Settings',        perms:['View','Create','Edit'],          desc:'Loyalty liability owner management. Delete TBD.' },
  'Creatives':                  { color:'#ec4899', nav:'Channels & content', perms:['View','Create','Edit'],      desc:'SMS, email and push notification templates' },
  'Audiences':                  { color:'#7c3aed', nav:'Audiences',       perms:['View','Create','Edit','Delete'], desc:'Audience groups and org user segmentation' },
  'Campaigns':                  { color:'#0284c7', nav:'Engage',          perms:['View','Create','Edit','Approval'], desc:'Campaign creation, editing and approval workflows' },
  'Journeys':                   { color:'#0369a1', nav:'Engage',          perms:['View','Create','Edit','Approval'], desc:'Journey builder and activation' },
}

// PRODUCT_TREE_EXISTING — original Capillary permission UI product structure
const PRODUCT_TREE_EXISTING = [
  {
    id:'engage', label:'engage+',
    rows:[
      { key:'Campaign',   children:['Workflow','Messages','Incentive','Audience','Report','Creatives','Config'] },
      { key:'Incentives', children:['Badges','Coupons','Cart Promotions','Gift Vouchers','Rewards Catalog'] },
    ]
  },
  {
    id:'loyalty', label:'loyalty+',
    rows:[
      { key:'Basic',          children:[] },
      { key:'Program',        children:[] },
      { key:'Promotion',      children:[] },
      { key:'New Promotions', children:[] },
      { key:'Milestones',     children:[] },
      { key:'Streaks',        children:[] },
    ]
  },
  {
    id:'mc', label:'member care',
    rows:[
      { key:'Customer', children:['Customer Profile','Customer PII','Customer Retro Transaction','Customer Cards','Customer Goodwill','Customer Group'] },
      { key:'Requests', children:['Requests Goodwill Points','Requests Goodwill Coupons','Requests ID Change','Requests ID Reallocation/Merge','Requests PII Deletion','Requests Cards','Requests Retro Transaction','Requests Transaction'] },
      { key:'Group',    children:['Group Goodwill','Group Transactions'] },
      { key:'Sessions',        children:[] },
      { key:'Settings',        children:[] },
      { key:'Search Criteria', children:[] },
    ]
  },
  {
    id:'conn', label:'connect+',
    rows:[
      { key:'Dataflows', children:[] },
    ]
  },
  {
    id:'ins', label:'insights+',
    rows:[
      { key:'Reports',  children:[] },
      { key:'Segments', children:[] },
      { key:'Export',   children:[] },
      { key:'Settings', children:[] },
    ]
  },
]

// PRODUCT_TREE_NEW — aligned to new Capillary navigation order
const PRODUCT_TREE = [
  {
    id:'loyalty', label:'Loyalty',
    rows:[
      { key:'Basic',          children:[] },
      { key:'Program',        children:[] },
      { key:'Promotion',      children:[] },
      { key:'New Promotions', children:[] },
      { key:'Milestones',     children:[] },
      { key:'Streaks',        children:[] },
    ]
  },
  {
    id:'engage', label:'Engage',
    rows:[
      { key:'Campaign', children:['Workflow','Messages','Incentive','Audience','Report','Creatives','Config'] },
    ]
  },
  {
    id:'rewards', label:'Rewards',
    rows:[
      { key:'Badges',          children:[] },
      { key:'Coupons',         children:[] },
      { key:'Cart Promotions', children:[] },
      { key:'Gift Vouchers',   children:[] },
      { key:'Rewards Catalog', children:[] },
    ]
  },
  {
    id:'mc', label:'Member Care',
    rows:[
      { key:'Customer', children:['Customer Profile','Customer PII','Customer Retro Transaction','Customer Cards','Customer Goodwill','Customer Group'] },
      { key:'Requests', children:['Requests Goodwill Points','Requests Goodwill Coupons','Requests ID Change','Requests ID Reallocation/Merge','Requests PII Deletion','Requests Cards','Requests Retro Transaction','Requests Transaction'] },
      { key:'Group',    children:['Group Goodwill','Group Transactions'] },
      { key:'Sessions',        children:[] },
      { key:'Search Criteria', children:[] },
    ]
  },
  {
    id:'ins', label:'Insights',
    rows:[
      { key:'Reports',  children:[] },
      { key:'Segments', children:[] },
      { key:'Export',   children:[] },
    ]
  },
  {
    id:'dm', label:'Data Management',
    rows:[
      { key:'Dataflows', children:[] },
    ]
  },
]

const ALL_PERMS = ['View','Create','Edit','Delete','Approval']
const MODULE_PERMS = {
  // Engage+ — Campaign sub-modules (from docs)
  'Campaign':                         ['View','Create','Edit','Approval'],
  'Workflow':                         ['View','Create','Approval'],
  'Messages':                         ['Create','Approval'],
  'Incentive':                        ['View','Create','Approval'],
  'Audience':                         ['View'],
  'Report':                           ['View'],
  'Creatives':                        ['View'],
  'Config':                           ['Edit'],
  // Engage+ — Incentives sub-modules
  'Incentives':                       ['View','Create','Edit','Delete'],
  'Badges':                           ['View','Create','Edit','Delete'],
  'Coupons':                          ['View','Create','Edit','Delete'],
  'Cart Promotions':                  ['View','Create','Edit','Delete'],
  'Gift Vouchers':                    ['View','Create','Edit','Delete'],
  'Rewards Catalog':                  ['View'],
  // Loyalty+
  'Basic':                            ['View'],
  'Program':                          ['View','Create'],
  'Promotion':                        ['View','Create'],
  'New Promotions':                   ['View','Create','Edit','Delete','Approval'],
  'Milestones':                       ['View','Create','Edit','Delete'],
  'Streaks':                          ['View','Create','Edit','Delete'],
  // Member Care — Customer sub-modules
  'Customer':                         ['View','Create','Edit','Delete','Approval'],
  'Customer Profile':                 ['View','Create','Edit','Delete'],
  'Customer PII':                     ['View','Create','Approval'],
  'Customer Retro Transaction':       ['View','Create','Approval'],
  'Customer Cards':                   ['Create'],
  'Customer Goodwill':                ['View'],
  'Customer Group':                   ['View'],
  // Member Care — Requests sub-modules
  'Requests':                         ['View','Create','Approval'],
  'Requests Goodwill Points':         ['View','Create','Approval'],
  'Requests Goodwill Coupons':        ['View','Create','Approval'],
  'Requests ID Change':               ['View','Create','Approval'],
  'Requests ID Reallocation/Merge':   ['View'],
  'Requests PII Deletion':            [],
  'Requests Cards':                   [],
  'Requests Retro Transaction':       [],
  'Requests Transaction':             ['View','Create','Edit','Delete','Approval'],
  // Member Care — Group sub-modules
  'Group':                            ['View','Create','Approval'],
  'Group Goodwill':                   ['View','Create','Approval'],
  'Group Transactions':               [],
  // Member Care — flat modules
  'Sessions':                         ['View','Create','Edit','Delete'],
  'Search Criteria':                  ['View','Create','Edit','Delete'],
  // Connect+
  'Dataflows':                        ['View','Create','Edit','Delete'],
  // Insights+
  'Reports':                          ['View','Create'],
  'Segments':                         ['View','Create'],
  'Export':                           ['View','Create'],
}

const dataManagerP = {
  'Behavioural Events':['View','Create','Edit','Delete'],
  'Webhooks':['View','Create','Delete'],
  'Card Configuration':['View','Create','Edit','Delete'],
  'Product / Location Entities':['View','Create','Edit','Delete'],
  'Communication & Gateway':['View','Create','Edit','Delete'],
  'Target Groups / Milestones':['View','Create','Edit','Delete'],
  'Manage Partners':['View','Create','Edit','Delete'],
  'Manage Liability Owners':['View','Create','Edit'],
}
const dataImportP = {
  'Behavioural Events':['View'],
  'Webhooks':['View'],
  'Card Configuration':['View'],
  'Product / Location Entities':['View','Create','Edit','Delete'],
  'Target Groups / Milestones':['View'],
  'Manage Partners':['View'],
}
const engageAuthorizeP = { 'Campaigns':['View','Create','Edit','Approval'], 'Journeys':['View','Create','Edit','Approval'], 'Creatives':['View','Create','Edit'] }
const engageActivateP  = { 'Campaigns':['View','Create','Edit'], 'Journeys':['View','Create','Edit'], 'Creatives':['View','Create','Edit'] }
const engageExploreP   = { 'Campaigns':['View'], 'Journeys':['View'], 'Creatives':['View'] }

const PC = {
  View:     { bg:'#EBF3FF', tx:'#2466EA', br:'#BEDBFF' },
  Create:   { bg:'#ECF7EC', tx:'#1F9A1D', br:'#B8E6B8' },
  Edit:     { bg:'#FFF4EC', tx:'#C05E00', br:'#FFC491' },
  Delete:   { bg:'#FFEEEE', tx:'#C5292D', br:'#FFC9CA' },
  Approval: { bg:'#F3EEFF', tx:'#6C35D4', br:'#DCCEFF' },
}

const INIT_SETS = [
  { id:1,  name:'Org Settings - Data Manager', desc:'Full access to all Data Management org settings modules.', type:'Standard', by:'Capillary', on:'Jun 20, 2026', perms:dataManagerP },
  { id:2,  name:'Data Import', desc:'View access across org settings. Full CRUD on Product Inventory.', type:'Standard', by:'Capillary', on:'Jun 20, 2026', perms:dataImportP },
  { id:3,  name:'API Access Configuration Admin', desc:'Full access to OAuth / API Management.', type:'Standard', by:'Capillary', on:'Jun 27, 2026', perms:{ 'OAuth / API Management':['View','Create','Edit','Delete'] } },
  { id:4,  name:'API Access Configuration Viewer', desc:'Read-only access to OAuth / API Management.', type:'Standard', by:'Capillary', on:'Jun 27, 2026', perms:{ 'OAuth / API Management':['View'] } },
  { id:5,  name:'Engage+ Authorize', desc:'Full access to Engage+ including campaigns, journeys and creatives.', type:'Standard', by:'Capillary', on:'Jul 11, 2026', perms:engageAuthorizeP },
  { id:6,  name:'Engage+ Activate', desc:'Create and edit campaigns, journeys and creatives. No approval.', type:'Standard', by:'Capillary', on:'Jul 11, 2026', perms:engageActivateP },
  { id:7,  name:'Engage+ Explore', desc:'View-only access to campaigns, journeys and creatives.', type:'Standard', by:'Capillary', on:'Jul 11, 2026', perms:engageExploreP },
  { id:8,  name:'Audiences', desc:'Full access to Audience Groups.', type:'Standard', by:'Capillary', on:'Jul 4, 2026', perms:{ 'Audiences':['View','Create','Edit','Delete'] } },
  { id:9,  name:'BE — View', desc:'Read-only access to Behavioural Events and Webhooks.', type:'Custom', by:'George Johnson', on:'Jun 10, 2026', perms:{ 'Behavioural Events':['View'], 'Webhooks':['View'] } },
  { id:10, name:'BE — Manager', desc:'Create and edit events and webhooks. No delete.', type:'Custom', by:'George Johnson', on:'Jun 10, 2026', perms:{ 'Behavioural Events':['View','Create','Edit'], 'Webhooks':['View','Create'] } },
  { id:11, name:'Cards — View', desc:'Read-only access to card series and generated cards.', type:'Custom', by:'George Johnson', on:'Jun 10, 2026', perms:{ 'Card Configuration':['View'] } },
  { id:12, name:'Cards — Manager', desc:'Create and edit card series. No delete.', type:'Custom', by:'George Johnson', on:'Jun 10, 2026', perms:{ 'Card Configuration':['View','Create','Edit'] } },
  { id:13, name:'Comms — View', desc:'Read-only access to Communication & Gateway.', type:'Custom', by:'George Johnson', on:'Jun 27, 2026', perms:{ 'Communication & Gateway':['View'] } },
  { id:14, name:'OAuth — View', desc:'Read-only access to API clients and access groups.', type:'Custom', by:'George Johnson', on:'Jun 27, 2026', perms:{ 'OAuth / API Management':['View'] } },
]

const INIT_USERS = [
  { id:1,  name:'Rick Sanchez',    email:'rick.sanchez@adultswim.com',        type:'Organization owner', status:'Active',      lastActive:'Aug 21, 2023 09:23 AM', sets:[] },
  { id:2,  name:'Morty Smith',     email:'morty.smith@adultswim.com',         type:'Admin',              status:'Pending',     lastActive:'—',                     sets:['Org Settings - Data Manager'] },
  { id:3,  name:'Beth Smith',      email:'beth.smith@adultswim.com',          type:'Standard user',      status:'Active',      lastActive:'Jul 08, 2023 02:26 PM', sets:['BE — View'] },
  { id:4,  name:'Jerry Smith',     email:'jerry.smith@adultswim.com',         type:'Standard user',      status:'Active',      lastActive:'Jun 29, 2023 12:10 PM', sets:['Cards — View'] },
  { id:5,  name:'Summer Smith',    email:'summer.smith@adultswim.com',        type:'Standard user',      status:'Deactivated', lastActive:'Mar 15, 2023 08:00 AM', sets:[] },
  { id:6,  name:'Squanchy',        email:'squanchy@capillarytech.com',        type:'Standard user',      status:'Active',      lastActive:'Jun 10, 2026 11:00 AM', sets:['BE — Manager','Cards — Manager'] },
  { id:7,  name:'Amogh Rane',      email:'amogh.rane@capillarytech.com',      type:'Standard user',      status:'Active',      lastActive:'Jun 11, 2026 09:00 AM', sets:['API Access Configuration Admin'] },
  { id:8,  name:'Priya Nair',      email:'priya.nair@capillarytech.com',      type:'Standard user',      status:'Active',      lastActive:'Jun 14, 2026 03:20 PM', sets:['Data Import'] },
  { id:9,  name:'Harsh Verma',     email:'harsh.verma@capillarytech.com',     type:'Standard user',      status:'Active',      lastActive:'Jun 16, 2026 10:00 AM', sets:['Audiences','Engage+ Explore'] },
  { id:10, name:'Arham Siddiqui',  email:'arham.siddiqui@capillarytech.com',  type:'Standard user',      status:'Active',      lastActive:'Jun 17, 2026 09:00 AM', sets:['Org Settings - Data Manager'] },
]

const AUDIT_LOGS = [
  { id:1, date:'Jun 16, 2026 10:05 AM', action:'Create',   desc:'New standard permission set created: Audiences',                             entity:'Audiences',                entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:2, date:'Jun 16, 2026 10:02 AM', action:'Edit',     desc:'Org Settings - Data Manager updated: 8 new modules added',                    entity:'Org Settings - Data Manager', entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:3, date:'Jun 16, 2026 09:58 AM', action:'Edit',     desc:'Data Import updated: modules added for Behavioural Events, Cards, Products',  entity:'Data Import',              entityType:'Permission set', by:'Capillary System Admin', email:'system@capillarytech.com' },
  { id:4, date:'Jun 16, 2026 09:55 AM', action:'Create',   desc:'Audiences permission set assigned to Harsh Verma',                            entity:'Harsh Verma',              entityType:'User',           by:'George Johnson',          email:'george.johnson@capillarytech.com' },
  { id:5, date:'Jun 11, 2026  3:42 PM', action:'Create',   desc:'New permission set created: API Access Configuration Admin',                   entity:'API Access Conf. Admin',   entityType:'Permission set', by:'George Johnson',          email:'george.johnson@capillarytech.com' },
  { id:6, date:'Jun 10, 2026 11:20 AM', action:'Edit',     desc:'Permission set updated: BE — Manager',                                         entity:'BE — Manager',             entityType:'Permission set', by:'George Johnson',          email:'george.johnson@capillarytech.com' },
  { id:7, date:'Jun 10, 2026 11:05 AM', action:'Create',   desc:'New permission set created: Cards — Manager',                                  entity:'Cards — Manager',          entityType:'Permission set', by:'George Johnson',          email:'george.johnson@capillarytech.com' },
  { id:8, date:'Mar 09, 2026  1:10 PM', action:'Logout',   desc:'User logged out',                                                              entity:'—',                        entityType:'—',              by:'Rick Sanchez',            email:'rick.sanchez@adultswim.com' },
  { id:9, date:'Feb 19, 2026 11:28 AM', action:'Approval', desc:'Permission set approved and assigned to user',                                 entity:'BE — View',                entityType:'Permission set', by:'Morty Smith',             email:'morty.smith@adultswim.com' },
  { id:10,date:'Aug 21, 2023  9:23 AM', action:'Create',   desc:'Organization created',                                                         entity:'Big Basket Prod',          entityType:'Organization',   by:'Rick Sanchez',            email:'rick.sanchez@adultswim.com' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function PBadge({ type }) {
  const c = PC[type]
  return <span style={{ background:c.bg, color:c.tx, border:`1px solid ${c.br}`, borderRadius:4, padding:'2px 9px', fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>{type}</span>
}
function StatusChip({ status }) {
  const s = { Active:{bg:'#ECF7EC',tx:'#1F9A1D',dot:'#42B040'}, Pending:{bg:'#FFF4EC',tx:'#C05E00',dot:'#F87D23'}, Deactivated:{bg:'#F4F5F7',tx:'#7A869A',dot:'#B3BAC5'} }[status]||{}
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, color:s.tx, fontWeight:500, background:s.bg, borderRadius:12, padding:'2px 8px' }}>
    <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot, display:'inline-block' }}/>{status}
  </span>
}
function ActionBadge({ action }) {
  const m = { Create:{bg:'#ECF7EC',tx:'#1F9A1D'}, Edit:{bg:'#FFF4EC',tx:'#C05E00'}, Delete:{bg:'#FFEEEE',tx:'#C5292D'}, Login:{bg:'#EBF3FF',tx:'#2466EA'}, Logout:{bg:'#F4F5F7',tx:'#7A869A'}, Approval:{bg:'#F3EEFF',tx:'#6C35D4'}, Export:{bg:'#FFF4EC',tx:'#C05E00'} }
  const c = m[action]||{bg:'#F4F5F7',tx:'#253858'}
  return <span style={{ background:c.bg, color:c.tx, borderRadius:4, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{action}</span>
}
function initials(name) { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }
function avatarBg(name) { const h=['#2466EA','#42B040','#F87D23','#6C35D4','#E83135','#0E7490']; return h[name.charCodeAt(0)%h.length] }
function Avatar({ name, size=34 }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:avatarBg(name), display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:700, color:'#fff', flexShrink:0 }}>{initials(name)}</div>
}

// ─── Nav Icons (SVG inline) ────────────────────────────────────────────────────
const ICONS = {
  home:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  aira:      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4.5H14l-3.75 2.75 1.5 4.5L8 11 4.25 13.75l1.5-4.5L2 6.5h4.5L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  loyalty:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5C6 1.5 2.5 2.5 2.5 5.5c0 3 5.5 7.5 5.5 7.5s5.5-4.5 5.5-7.5C13.5 2.5 10 1.5 8 3.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  engage:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 6h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  rewards:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="7.5" width="13" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 7.5V6a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 7.5v7M5.5 7.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  audiences: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 14c0-3 2-4.5 4.5-4.5s4.5 1.5 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 14c0-2 1-3.5 2-3.5s2.5 1.5 2.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  channels:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A6.5 6.5 0 1 1 1.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M1.5 3.5V8h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  memcare:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 14c0-3 2-4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M11 9l1.5 1.5L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  insights:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 12L5 8l3 3 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  datamgmt:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4.5" rx="5.5" ry="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 8c0 1.38 2.46 2.5 5.5 2.5S13.5 9.38 13.5 8" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 11.5c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 4.5v7M13.5 4.5v7" stroke="currentColor" strokeWidth="1.4"/></svg>,
  extensions:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 2H3a1 1 0 00-1 1v4h2a2 2 0 010 4H2v4a1 1 0 001 1h4v-2a2 2 0 014 0v2h4a1 1 0 001-1v-4h-2a2 2 0 010-4h2V3a1 1 0 00-1-1h-4v2a2 2 0 01-4 0V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  settings:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 11a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  collapse:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  expand:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevron:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 6l2 2 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── NAV STRUCTURE (matches Figma exactly) ────────────────────────────────────
const NAV_TOP = [
  { id:'home',    icon:ICONS.home,       label:'Home',             sub:[] },
  { id:'aira',    icon:ICONS.aira,       label:'aiRA',             sub:[] },
  { id:'loyalty', icon:ICONS.loyalty,    label:'Loyalty',          sub:['Programs','Promotions'] },
  { id:'engage',  icon:ICONS.engage,     label:'Engage',           sub:['Campaigns','Journeys'] },
  { id:'rewards', icon:ICONS.rewards,    label:'Rewards',          sub:['Coupons','Cart Promotions','Gift Vouchers','Badges','Rewards Catalog'] },
  { id:'aud',     icon:ICONS.audiences,  label:'Audiences',        sub:['Audience Groups','Org User Lists'] },
  { id:'chan',    icon:ICONS.channels,   label:'Channels & content', sub:['Creatives','Channel Setup'] },
  { id:'mc',      icon:ICONS.memcare,    label:'Member Care',      sub:[] },
  { id:'ins',     icon:ICONS.insights,   label:'Insights',         sub:['Reports','Chart Library','Segments'] },
]
const NAV_MID = [
  { id:'dm',  icon:ICONS.datamgmt,   label:'Data Management', sub:['Behavioural Events','Webhooks','Card Configuration','Entities','Dataflows','Imports'] },
  { id:'ext', icon:ICONS.extensions, label:'Extensions',      sub:['Vulcan','Neo','Dev Console'] },
]
const NAV_BOT = [
  { id:'set', icon:ICONS.settings,   label:'Settings',        sub:['Org Setup','Communication & Gateway','OAuth / API Management','Partners','Liability Owners','Security & Audit'] },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ expanded, setExpanded, activeId, setActiveId }) {
  const [hovered, setHovered] = useState(null)

  const NavItem = ({ item }) => {
    const isActive = activeId === item.id
    const isHov = hovered === item.id && !expanded
    return (
      <div style={{ position:'relative' }} onMouseEnter={()=>setHovered(item.id)} onMouseLeave={()=>setHovered(null)}>
        <div
          onClick={()=>setActiveId(item.id)}
          style={{
            display:'flex', alignItems:'center', gap:10,
            padding: expanded ? '8px 12px 8px 16px' : '8px 0',
            justifyContent: expanded ? 'flex-start' : 'center',
            cursor:'pointer', margin:'1px 6px', borderRadius:6,
            position:'relative',
            background: isActive ? 'rgba(66,176,64,0.12)' : 'transparent',
            borderLeft: isActive ? `2px solid ${DS.green7}` : '2px solid transparent',
            marginLeft: isActive ? 4 : 6,
          }}>
          <span style={{ color: isActive ? DS.green7 : 'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', flexShrink:0 }}>{item.icon}</span>
          {expanded && <span style={{ fontSize:13, color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: isActive ? 600 : 400, whiteSpace:'nowrap', flex:1 }}>{item.label}</span>}
          {expanded && item.sub.length > 0 && (
            <span style={{ color:'rgba(255,255,255,0.3)', display:'flex', transform: isActive ? 'rotate(180deg)' : 'none', transition:'transform 0.15s' }}>{ICONS.chevron}</span>
          )}
        </div>

        {/* Hover fly-out (collapsed only) */}
        {isHov && !expanded && (
          <div style={{ position:'absolute', left:52, top:-4, background:'#1e2d4d', borderRadius:8, minWidth:200, zIndex:999, boxShadow:'0 8px 24px rgba(0,0,0,0.4)', overflow:'hidden', padding:'4px 0' }}>
            <div style={{ padding:'8px 16px 6px', fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, borderBottom: item.sub.length ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>{item.label}</div>
            {item.sub.map(s=>(
              <div key={s} style={{ padding:'7px 16px', fontSize:13, color:'rgba(255,255,255,0.7)', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{s}</div>
            ))}
          </div>
        )}

        {/* Expanded sub-items */}
        {expanded && isActive && item.sub.length > 0 && (
          <div style={{ marginLeft:42, marginRight:6, borderLeft:'1px solid rgba(255,255,255,0.1)', paddingBottom:4 }}>
            {item.sub.map(s=>(
              <div key={s} style={{ padding:'6px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.8)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>{s}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ width: expanded ? 240 : 56, background: DS.navBg, display:'flex', flexDirection:'column', height:'100vh', flexShrink:0, transition:'width 0.2s ease', zIndex:10, overflow:'hidden' }}>
      {/* Logo */}
      <div style={{ height:56, display:'flex', alignItems:'center', justifyContent: expanded ? 'flex-start' : 'center', padding: expanded ? '0 16px' : '0', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#f97316,#ec4899,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l1.5 4H13L9.5 8.5l1.5 4L7 10.5 3.5 12.5l1.5-4L1.5 6H6L7 2z" fill="white"/></svg>
        </div>
        {expanded && <span style={{ fontSize:14, fontWeight:700, color:'#fff', marginLeft:10, letterSpacing:0.2 }}>Capillary</span>}
      </div>

      {/* Nav items */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'8px 0' }}>
        {NAV_TOP.map(i=><NavItem key={i.id} item={i}/>)}
        <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'8px 12px' }}/>
        {NAV_MID.map(i=><NavItem key={i.id} item={i}/>)}
        <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'8px 12px' }}/>
        {NAV_BOT.map(i=><NavItem key={i.id} item={i}/>)}
      </div>

      {/* Collapse toggle */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'8px 6px', flexShrink:0 }}>
        <div onClick={()=>setExpanded(!expanded)}
          style={{ display:'flex', alignItems:'center', gap:10, padding: expanded ? '7px 12px' : '7px 0', justifyContent: expanded ? 'flex-start' : 'center', cursor:'pointer', borderRadius:6, color:'rgba(255,255,255,0.35)', fontSize:13 }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          {expanded ? ICONS.collapse : ICONS.expand}
          {expanded && <span>Collapse panel</span>}
        </div>
      </div>
    </div>
  )
}

// ─── Set sidepane ─────────────────────────────────────────────────────────────
function SetDrawer({ set, onClose }) {
  const [edit, setEdit] = useState(false)
  const [lp, setLp] = useState(JSON.parse(JSON.stringify(set.perms)))
  const toggle = (mod,p) => setLp(prev => { const c=prev[mod]||[]; return {...prev,[mod]:c.includes(p)?c.filter(x=>x!==p):[...c,p]} })
  const mods = Object.keys(set.perms)
  const userCount = INIT_USERS.filter(u=>u.sets.includes(set.name)).length

  return (
    <div style={{ position:'fixed', right:0, top:0, bottom:0, width:540, background:DS.white, boxShadow:'-4px 0 32px rgba(9,30,66,0.18)', display:'flex', flexDirection:'column', zIndex:200 }}>
      <div style={{ padding:'20px 24px 16px', borderBottom:`1px solid ${DS.neutral3}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ flex:1, marginRight:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <span style={{ fontSize:16, fontWeight:500, color:DS.neutral11 }}>{set.name}</span>
              <span style={{ background:set.type==='Standard'?DS.blue1:'#F3EEFF', color:set.type==='Standard'?DS.blue9:'#6C35D4', border:`1px solid ${set.type==='Standard'?'#BEDBFF':'#DCCEFF'}`, borderRadius:4, padding:'1px 8px', fontSize:11, fontWeight:600 }}>{set.type}</span>
            </div>
            <div style={{ fontSize:13, color:DS.neutral7, lineHeight:1.5 }}>{set.desc}</div>
            <div style={{ fontSize:12, color:DS.neutral6, marginTop:6, display:'flex', gap:16 }}>
              <span>{userCount} user{userCount!==1?'s':''}</span>
              <span>Updated by {set.by} · {set.on}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:DS.neutral6, fontSize:18, lineHeight:1 }}>✕</button>
        </div>
        {!set.super && (
          <div style={{ marginTop:12, display:'flex', gap:8 }}>
            <button onClick={()=>setEdit(!edit)} style={{ padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:500, cursor:'pointer', background:edit?DS.neutral11:DS.white, color:edit?DS.white:DS.neutral9, border:`1px solid ${DS.neutral3}` }}>{edit?'Cancel':'Edit'}</button>
            {edit && <button onClick={()=>setEdit(false)} style={{ padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:600, cursor:'pointer', background:DS.green7, color:'#fff', border:'none' }}>Save changes</button>}
          </div>
        )}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
        <div style={{ fontSize:11, color:DS.neutral6, marginBottom:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{mods.length} module{mods.length!==1?'s':''} with access</div>
        {mods.map(mod => {
          const assigned = (edit?lp:set.perms)[mod]||[]
          const allModPerms = MODULES[mod]?.perms||[]
          return (
            <div key={mod} style={{ marginBottom:10, border:`1px solid ${DS.neutral3}`, borderRadius:8, overflow:'hidden' }}>
              <div style={{ padding:'10px 14px', background:DS.neutral2, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:MODULES[mod]?.color||DS.neutral5, flexShrink:0 }}/>
                <span style={{ fontSize:13, fontWeight:600, color:DS.neutral11 }}>{mod}</span>
                <span style={{ fontSize:11, color:DS.neutral6, marginLeft:'auto' }}>{MODULES[mod]?.desc}</span>
              </div>
              <div style={{ padding:'10px 14px', display:'flex', gap:6, flexWrap:'wrap', borderTop:`1px solid ${DS.neutral3}` }}>
                {edit ? allModPerms.map(p => {
                  const on=assigned.includes(p); const c=PC[p]
                  return <button key={p} onClick={()=>toggle(mod,p)} style={{ padding:'4px 11px', borderRadius:5, fontSize:12, fontWeight:600, cursor:'pointer', background:on?c.bg:DS.neutral1, color:on?c.tx:DS.neutral6, border:`1.5px solid ${on?c.br:DS.neutral3}` }}>{on?'✓ ':''}{p}</button>
                }) : assigned.map(p=><PBadge key={p} type={p}/>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── User sidepane ────────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, allSets, onUpdate }) {
  const [editSets, setEditSets] = useState(false)
  const [selSets, setSelSets] = useState([...user.sets])
  const toggleSet = s => setSelSets(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])

  return (
    <div style={{ position:'fixed', right:0, top:0, bottom:0, width:480, background:DS.white, boxShadow:'-4px 0 32px rgba(9,30,66,0.18)', display:'flex', flexDirection:'column', zIndex:200 }}>
      <div style={{ padding:'20px 24px', borderBottom:`1px solid ${DS.neutral3}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <Avatar name={user.name} size={48}/>
          <div>
            <div style={{ fontSize:16, fontWeight:500, color:DS.neutral11 }}>{user.name}</div>
            <div style={{ fontSize:13, color:DS.neutral7 }}>{user.email}</div>
            <div style={{ marginTop:4 }}><StatusChip status={user.status}/></div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:DS.neutral6, fontSize:18 }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, color:DS.neutral6, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Profile</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['User type',user.type],['Last active',user.lastActive],['Status',user.status],['Email',user.email]].map(([l,v])=>(
              <div key={l} style={{ padding:'10px 14px', background:DS.neutral1, borderRadius:8, border:`1px solid ${DS.neutral3}` }}>
                <div style={{ fontSize:11, color:DS.neutral6, marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:500, color:DS.neutral10 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontSize:11, color:DS.neutral6, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>Permission sets</div>
            {user.type!=='Organization owner' && (
              <button onClick={()=>setEditSets(!editSets)} style={{ fontSize:12, color:DS.green7, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>{editSets?'Cancel':'Edit'}</button>
            )}
          </div>
          {user.type==='Organization owner' ? (
            <div style={{ padding:'10px 14px', background:'#FFF4EC', border:`1px solid #FFD6A5`, borderRadius:8, fontSize:13, color:'#C05E00' }}>Organization owners have full access. Permission sets don't apply.</div>
          ) : editSets ? (
            <div>
              {allSets.map(s=>{
                const on=selSets.includes(s.name)
                return <div key={s.id} onClick={()=>toggleSet(s.name)} style={{ padding:'10px 14px', border:`1.5px solid ${on?DS.green7:DS.neutral3}`, borderRadius:8, marginBottom:8, cursor:'pointer', background:on?DS.green1:DS.white, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:DS.neutral11 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:DS.neutral7 }}>{Object.keys(s.perms).length} modules</div>
                  </div>
                  <span style={{ width:16, height:16, borderRadius:3, border:`2px solid ${on?DS.green7:DS.neutral4}`, background:on?DS.green7:DS.white, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10 }}>{on?'✓':''}</span>
                </div>
              })}
              <button onClick={()=>{ onUpdate(user.id,selSets); setEditSets(false) }} style={{ width:'100%', marginTop:8, padding:'10px', background:DS.green7, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Save changes</button>
            </div>
          ) : (
            selSets.length===0 ?
              <div style={{ padding:'14px', background:DS.neutral1, borderRadius:8, fontSize:13, color:DS.neutral6, textAlign:'center' }}>No permission sets assigned</div> :
              selSets.map(name=>{
                const s=allSets.find(x=>x.name===name); if(!s) return null
                const mods=Object.keys(s.perms)
                return <div key={name} style={{ padding:'10px 14px', border:`1px solid ${DS.neutral3}`, borderRadius:8, marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:DS.neutral11, marginBottom:4 }}>{name}</div>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {mods.slice(0,3).map(m=><span key={m} style={{ background:DS.neutral2, color:DS.neutral9, borderRadius:4, padding:'1px 7px', fontSize:11 }}>{m}</span>)}
                    {mods.length>3&&<span style={{ background:DS.neutral2, color:DS.neutral7, borderRadius:4, padding:'1px 7px', fontSize:11 }}>+{mods.length-3}</span>}
                  </div>
                </div>
              })
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add user modal ───────────────────────────────────────────────────────────
function AddUserModal({ onClose, allSets, onAdd }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', type:'Standard user' })
  const [selSets, setSelSets] = useState([])
  const [touched, setTouched] = useState({ firstName:false, email:false })
  const toggleSet = s => setSelSets(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])
  const emailOk = form.email.includes('@') && form.email.includes('.')
  const nameOk = form.firstName.trim().length > 0

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(9,30,66,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
      <div style={{ background:DS.white, borderRadius:12, width:540, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 20px 60px rgba(9,30,66,0.25)' }}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${DS.neutral3}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:500, color:DS.neutral11 }}>Add new user</div>
            <div style={{ fontSize:13, color:DS.neutral7, marginTop:2 }}>Step {step} of 2 — {step===1?'User details':'Assign permission sets'}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:DS.neutral6, fontSize:18 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {step===1 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={{ fontSize:14, fontWeight:500, color:DS.neutral11, display:'block', marginBottom:5 }}>First name</label>
                  <input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} onBlur={()=>setTouched(t=>({...t,firstName:true}))} placeholder="e.g. Beth"
                    style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${touched.firstName&&!nameOk?DS.red6:DS.neutral3}`, borderRadius:8, fontSize:14, outline:'none', fontFamily:'inherit' }}/>
                  {touched.firstName&&!nameOk&&<div style={{ fontSize:12, color:DS.red6, marginTop:4 }}>First name is required</div>}
                </div>
                <div>
                  <label style={{ fontSize:14, fontWeight:500, color:DS.neutral11, display:'block', marginBottom:5 }}>Last name <span style={{ fontWeight:400, color:DS.neutral7 }}>(Optional)</span></label>
                  <input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="e.g. Smith"
                    style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:14, outline:'none', fontFamily:'inherit' }}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:14, fontWeight:500, color:DS.neutral11, display:'block', marginBottom:5 }}>Email address</label>
                <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onBlur={()=>setTouched(t=>({...t,email:true}))} placeholder="e.g. beth.smith@brand.com"
                  style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${touched.email&&form.email&&!emailOk?DS.red6:DS.neutral3}`, borderRadius:8, fontSize:14, outline:'none', fontFamily:'inherit' }}/>
                {touched.email&&form.email&&!emailOk&&<div style={{ fontSize:12, color:DS.red6, marginTop:4 }}>Enter a valid email address</div>}
              </div>
              <div>
                <label style={{ fontSize:14, fontWeight:500, color:DS.neutral11, display:'block', marginBottom:8 }}>User type</label>
                {['Standard user','Admin','Organization owner'].map(t=>(
                  <div key={t} onClick={()=>setForm({...form,type:t})} style={{ padding:'11px 14px', border:`1.5px solid ${form.type===t?DS.green7:DS.neutral3}`, borderRadius:8, cursor:'pointer', background:form.type===t?DS.green1:DS.white, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:DS.neutral11 }}>{t}</div>
                      <div style={{ fontSize:12, color:DS.neutral7 }}>{ t==='Standard user'?'Restricted access, assigned via permission sets':t==='Admin'?'Can manage standard users and assign permissions':'Full access to all org settings and users' }</div>
                    </div>
                    <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${form.type===t?DS.green7:DS.neutral4}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {form.type===t&&<div style={{ width:7, height:7, borderRadius:'50%', background:DS.green7 }}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            form.type==='Organization owner' ?
              <div style={{ padding:'16px', background:'#FFF4EC', border:'1px solid #FFD6A5', borderRadius:10, fontSize:13, color:'#C05E00' }}>Organization owners have full access. Permission sets are not applicable.</div> :
              <>
                <div style={{ fontSize:13, color:DS.neutral7, marginBottom:16 }}>Select permission sets for <strong style={{color:DS.neutral11}}>{form.firstName} {form.lastName}</strong>. You can change these later. {selSets.length>0&&<strong style={{color:DS.green7}}>({selSets.length} selected)</strong>}</div>
                {allSets.map(s=>{
                  const on=selSets.includes(s.name)
                  return <div key={s.id} onClick={()=>toggleSet(s.name)} style={{ border:`1.5px solid ${on?DS.green7:DS.neutral3}`, borderRadius:8, marginBottom:10, background:on?DS.green1:DS.white, overflow:'hidden' }}>
                    <div style={{ padding:'12px 14px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:DS.neutral11 }}>{s.name}</span>
                          <span style={{ background:s.type==='Standard'?DS.blue1:'#F3EEFF', color:s.type==='Standard'?DS.blue9:'#6C35D4', borderRadius:4, padding:'1px 7px', fontSize:10, fontWeight:600 }}>{s.type}</span>
                        </div>
                        <div style={{ fontSize:12, color:DS.neutral7 }}>{s.desc}</div>
                      </div>
                      <span style={{ width:16, height:16, borderRadius:3, border:`2px solid ${on?DS.green7:DS.neutral4}`, background:on?DS.green7:DS.white, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:700, flexShrink:0, marginLeft:12 }}>{on?'✓':''}</span>
                    </div>
                  </div>
                })}
              </>
          )}
        </div>
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${DS.neutral3}`, display:'flex', justifyContent:'space-between' }}>
          <button onClick={step===1?onClose:()=>setStep(1)} style={{ padding:'8px 18px', borderRadius:8, fontSize:14, cursor:'pointer', background:DS.white, color:DS.neutral9, border:`1.5px solid ${DS.neutral3}`, fontWeight:500, fontFamily:'inherit' }}>{step===1?'Cancel':'← Back'}</button>
          <button onClick={()=>{ if(step===1){ setTouched({firstName:true,email:true}); if(nameOk&&emailOk) setStep(2) } else { onAdd({...form,sets:selSets}); onClose() } }}
            style={{ padding:'8px 20px', borderRadius:8, fontSize:14, cursor:'pointer', background:DS.green7, color:'#fff', border:'none', fontWeight:600, fontFamily:'inherit' }}>
            {step===1?'Next →':'Add user'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── NEW PERMISSION SET — full-page table-grid (Pattern 1.2) ─────────────────
function NewPermSetPage({ onCancel, onSave, variant='new' }) {
  const [name, setName] = useState('')
  const [nameErr, setNameErr] = useState(false)
  const tree = variant === 'existing' ? PRODUCT_TREE_EXISTING : PRODUCT_TREE
  const [activeProduct, setActiveProduct] = useState(tree[0].id)
  const [sel, setSel] = useState({})
  const [expanded, setExpanded] = useState({})
  const [saved, setSaved] = useState(false)

  const product = tree.find(p => p.id === activeProduct)

  const isChecked = (mod, perm) => (sel[mod]||[]).includes(perm)

  const togglePerm = (mod, perm) => setSel(prev => {
    const c = prev[mod]||[]
    return { ...prev, [mod]: c.includes(perm) ? c.filter(x=>x!==perm) : [...c,perm] }
  })

  // Cascade: toggle a group row checks/unchecks all its children
  const toggleGroupPerm = (row, perm) => {
    const leaves = row.children.length ? row.children : [row.key]
    const allOn = leaves.every(m => isChecked(m, perm))
    setSel(prev => {
      const next = {...prev}
      leaves.forEach(m => {
        const allowed = MODULE_PERMS[m]||[]
        if(!allowed.includes(perm)) return
        const c = next[m]||[]
        next[m] = allOn ? c.filter(x=>x!==perm) : c.includes(perm) ? c : [...c,perm]
      })
      return next
    })
  }

  const groupChecked = (row, perm) => {
    const leaves = row.children.length ? row.children : [row.key]
    return leaves.every(m => isChecked(m, perm))
  }
  const groupIndeterminate = (row, perm) => {
    const leaves = row.children.length ? row.children : [row.key]
    const some = leaves.some(m => isChecked(m, perm))
    const all  = leaves.every(m => isChecked(m, perm))
    return some && !all
  }

  const toggleExpand = key => setExpanded(prev => ({...prev,[key]:!prev[key]}))

  const handleSave = () => {
    if(!name.trim()) { setNameErr(true); return }
    const perms = Object.fromEntries(Object.entries(sel).filter(([,v])=>v.length>0))
    onSave({ name, desc:'', perms })
    setSaved(true)
    setTimeout(()=>onCancel(), 1200)
  }

  const COL = { color:DS.neutral7, fontSize:11, fontWeight:600, textAlign:'center', padding:'6px 4px', textTransform:'uppercase', letterSpacing:'0.04em' }

  const Checkbox = ({ checked, indeterminate, onChange, disabled }) => (
    <div onClick={disabled ? undefined : onChange} style={{ width:16, height:16, borderRadius:3, border:`1.5px solid ${checked?DS.green7:DS.neutral4}`, background:checked?DS.green7:DS.white, display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:disabled?'default':'pointer', flexShrink:0, opacity:disabled?0.35:1, position:'relative' }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6 8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {!checked && indeterminate && <div style={{ width:8, height:2, background:DS.neutral5, borderRadius:1 }}/>}
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Page header */}
      <div style={{ padding:'16px 24px', borderBottom:`1px solid ${DS.neutral3}`, background:DS.white, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:DS.neutral7, display:'flex', alignItems:'center', gap:4, fontSize:13, fontFamily:'inherit', padding:0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{ fontSize:18, fontWeight:500, color:DS.neutral11 }}>Create permission set</div>
            <span style={{ padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600, background: variant==='existing'?DS.orange1:DS.blue1, color: variant==='existing'?DS.orange7:DS.blue9, border:`1px solid ${variant==='existing'?'#FFD4A8':'#BEDBFF'}` }}>{variant==='existing'?'Existing':'New navigation'}</span>
          </div>
          {name && <div style={{ fontSize:12, color:DS.neutral6, marginTop:2, marginLeft:24 }}>Name: {name}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ position:'relative' }}>
            <input value={name} onChange={e=>{ setName(e.target.value); setNameErr(false) }} placeholder="Permission set name"
              style={{ padding:'7px 12px', border:`1.5px solid ${nameErr?DS.red6:DS.neutral3}`, borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit', width:260 }}/>
            {nameErr && <div style={{ position:'absolute', top:'100%', left:0, fontSize:11, color:DS.red6, marginTop:2, whiteSpace:'nowrap' }}>Name is required</div>}
          </div>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:DS.neutral6, fontSize:18, lineHeight:1, padding:4 }}>✕</button>
        </div>
      </div>

      {/* Two-panel body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Left — Products */}
        <div style={{ width:180, borderRight:`1px solid ${DS.neutral3}`, background:DS.white, display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'10px 16px 6px', fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:DS.neutral6 }}>Products</div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {tree.map(p => (
              <div key={p.id} onClick={()=>setActiveProduct(p.id)}
                style={{ padding:'9px 16px', fontSize:13, color: activeProduct===p.id ? DS.blue9 : DS.neutral8, cursor:'pointer', borderLeft:`2px solid ${activeProduct===p.id ? DS.blue9 : 'transparent'}`, background: activeProduct===p.id ? DS.blue1 : 'transparent', fontWeight: activeProduct===p.id ? 500 : 400 }}
                onMouseEnter={e=>{ if(activeProduct!==p.id) e.currentTarget.style.background=DS.neutral1 }}
                onMouseLeave={e=>{ if(activeProduct!==p.id) e.currentTarget.style.background='transparent' }}>
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Permissions table */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:DS.neutral1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px 8px', background:DS.white, borderBottom:`1px solid ${DS.neutral3}`, flexShrink:0 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:DS.neutral6 }}>Permissions</span>
            <span style={{ fontSize:12, color:DS.blue9, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
              Preview permissions
            </span>
          </div>
          <div style={{ padding:'10px 20px 4px', background:DS.white, borderBottom:`1px solid ${DS.neutral3}`, fontSize:15, fontWeight:500, color:DS.neutral11, flexShrink:0 }}>{product?.label}</div>

          <div style={{ flex:1, overflowY:'auto', padding:'0 0 80px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
              <colgroup>
                <col style={{ width:'44%' }}/>
                <col style={{ width:'11.2%' }}/><col style={{ width:'11.2%' }}/><col style={{ width:'11.2%' }}/><col style={{ width:'11.2%' }}/><col style={{ width:'11.2%' }}/>
              </colgroup>
              <thead>
                <tr style={{ background:DS.white }}>
                  <th style={{ ...COL, textAlign:'left', padding:'8px 20px', borderBottom:`1px solid ${DS.neutral3}` }}>Modules</th>
                  {ALL_PERMS.map(p => <th key={p} style={{ ...COL, borderBottom:`1px solid ${DS.neutral3}` }}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {product?.rows.map(row => {
                  const hasChildren = row.children.length > 0
                  const isOpen = expanded[row.key]
                  const rowBg = DS.white
                  return (
                    <>
                      <tr key={row.key} style={{ background:rowBg, cursor: hasChildren ? 'pointer' : 'default' }}>
                        <td style={{ padding:'10px 20px', borderBottom:`1px solid ${DS.neutral3}` }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }} onClick={hasChildren ? ()=>toggleExpand(row.key) : undefined}>
                            {hasChildren && (
                              <span style={{ fontSize:11, color:DS.neutral6, width:14, display:'inline-block', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.15s' }}>›</span>
                            )}
                            {!hasChildren && <span style={{ width:14, display:'inline-block' }}/>}
                            <span style={{ fontSize:13, fontWeight:500, color:DS.neutral11 }}>{row.key}</span>
                          </div>
                        </td>
                        {ALL_PERMS.map(perm => {
                          const allowed = (MODULE_PERMS[row.key]||[]).includes(perm)
                          const chk = hasChildren ? groupChecked(row, perm) : isChecked(row.key, perm)
                          const ind = hasChildren ? groupIndeterminate(row, perm) : false
                          return (
                            <td key={perm} style={{ textAlign:'center', borderBottom:`1px solid ${DS.neutral3}`, padding:'10px 4px' }}>
                              {allowed
                                ? <Checkbox checked={chk} indeterminate={ind} onChange={()=> hasChildren ? toggleGroupPerm(row, perm) : togglePerm(row.key, perm)}/>
                                : <span style={{ color:DS.neutral4, fontSize:12 }}>—</span>
                              }
                            </td>
                          )
                        })}
                      </tr>
                      {hasChildren && isOpen && row.children.map(child => (
                        <tr key={child} style={{ background:DS.neutral1 }}>
                          <td style={{ padding:'8px 20px 8px 42px', borderBottom:`1px solid ${DS.neutral3}`, fontSize:13, color:DS.neutral9 }}>{child}</td>
                          {ALL_PERMS.map(perm => {
                            const allowed = (MODULE_PERMS[child]||[]).includes(perm)
                            const chk = isChecked(child, perm)
                            return (
                              <td key={perm} style={{ textAlign:'center', borderBottom:`1px solid ${DS.neutral3}`, padding:'8px 4px' }}>
                                {allowed
                                  ? <Checkbox checked={chk} onChange={()=>togglePerm(child, perm)}/>
                                  : <span style={{ color:DS.neutral4, fontSize:12 }}>—</span>
                                }
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sticky footer — Pattern 1.3 */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, height:64, background:DS.white, borderTop:`1px solid ${DS.neutral3}`, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'0 32px', gap:12, zIndex:20, boxShadow:'0 -4px 16px rgba(9,30,66,0.06)' }}>
        <button onClick={onCancel} style={{ padding:'8px 18px', borderRadius:8, fontSize:14, cursor:'pointer', background:DS.white, color:DS.neutral9, border:`1.5px solid ${DS.neutral3}`, fontWeight:500, fontFamily:'inherit' }}>Cancel</button>
        <button onClick={handleSave} style={{ padding:'8px 20px', borderRadius:8, fontSize:14, cursor:'pointer', background:saved?DS.green8:DS.green7, color:'#fff', border:'none', fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:7 }}>
          {saved ? '✓ Saved!' : <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Save permission set
          </>}
        </button>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function UsersTab({ users, setUsers, allSets }) {
  const [search, setSearch] = useState('')
  const [typeF, setTypeF] = useState('All')
  const [statusF, setStatusF] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (typeF==='All'||u.type===typeF) && (statusF==='All'||u.status===statusF)
  })
  const counts = { active:users.filter(u=>u.status==='Active').length, pending:users.filter(u=>u.status==='Pending').length, deactivated:users.filter(u=>u.status==='Deactivated').length }
  const updateUserSets = (uid,sets) => { setUsers(prev=>prev.map(u=>u.id===uid?{...u,sets}:u)); setSelectedUser(prev=>prev?.id===uid?{...prev,sets}:prev) }
  const addUser = d => setUsers(prev=>[...prev,{ id:Date.now(), name:`${d.firstName} ${d.lastName}`, email:d.email, type:d.type, status:'Pending', lastActive:'—', sets:d.sets }])

  return (
    <div>
      <div style={{ display:'flex', gap:24, marginBottom:20 }}>
        {[['Active',counts.active,'#42B040'],['Invite pending',counts.pending,'#F87D23'],['Deactivated',counts.deactivated,DS.neutral6],['Total',users.length,DS.neutral11]].map(([l,v,c])=>(
          <div key={l} style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:c }}/>
            <span style={{ fontSize:13, color:DS.neutral7 }}>{l}</span>
            <span style={{ fontSize:16, fontWeight:700, color:DS.neutral11 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:300 }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:DS.neutral6, fontSize:13 }}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
            style={{ width:'100%', padding:'8px 12px 8px 32px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, outline:'none', fontFamily:'inherit' }}/>
        </div>
        <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{ padding:'8px 12px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, outline:'none', cursor:'pointer', background:DS.white, fontFamily:'inherit' }}>
          <option value="All">All types</option>
          {['Standard user','Admin','Organization owner'].map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{ padding:'8px 12px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, outline:'none', cursor:'pointer', background:DS.white, fontFamily:'inherit' }}>
          <option value="All">All status</option>
          {['Active','Pending','Deactivated'].map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={()=>setShowAdd(true)} style={{ padding:'8px 18px', background:DS.green7, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>+ New user</button>
      </div>
      <div style={{ background:DS.white, border:`1px solid ${DS.neutral3}`, borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 70px', padding:'10px 20px', background:DS.neutral2, borderBottom:`1px solid ${DS.neutral3}` }}>
          {['Name / Email','User type','Status',''].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:DS.neutral7, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>)}
        </div>
        {filtered.map((u,i)=>(
          <div key={u.id} onClick={()=>setSelectedUser(u===selectedUser?null:u)}
            style={{ display:'grid', gridTemplateColumns:'1fr 180px 160px 70px', padding:'13px 20px', alignItems:'center', borderBottom:i<filtered.length-1?`1px solid ${DS.neutral3}`:'none', cursor:'pointer', background:selectedUser?.id===u.id?DS.green1:DS.white }}
            onMouseEnter={e=>{ if(selectedUser?.id!==u.id) e.currentTarget.style.background=DS.neutral1 }}
            onMouseLeave={e=>{ e.currentTarget.style.background=selectedUser?.id===u.id?DS.green1:DS.white }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Avatar name={u.name}/>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:DS.neutral11 }}>{u.name}</div>
                <div style={{ fontSize:12, color:DS.neutral7 }}>{u.email}</div>
              </div>
            </div>
            <span style={{ fontSize:13, color:DS.neutral9 }}>{u.type}</span>
            <div>
              <StatusChip status={u.status}/>
              <div style={{ fontSize:11, color:DS.neutral7, marginTop:3 }}>{u.lastActive}</div>
            </div>
            <span style={{ fontSize:13, color:DS.green7, fontWeight:500 }}>View</span>
          </div>
        ))}
        {filtered.length===0&&<div style={{ padding:'40px', textAlign:'center', color:DS.neutral6, fontSize:14 }}>No users found</div>}
      </div>
      <div style={{ marginTop:8, fontSize:12, color:DS.neutral6 }}>Showing {filtered.length} of {users.length} users</div>
      {selectedUser&&(<><div onClick={()=>setSelectedUser(null)} style={{ position:'fixed', inset:0, background:'rgba(9,30,66,0.25)', zIndex:199 }}/><UserDrawer user={selectedUser} onClose={()=>setSelectedUser(null)} allSets={allSets} onUpdate={updateUserSets}/></>)}
      {showAdd&&<AddUserModal onClose={()=>setShowAdd(false)} allSets={allSets} onAdd={addUser}/>}
    </div>
  )
}

function AuditTab() {
  const [search, setSearch] = useState('')
  const filtered = AUDIT_LOGS.filter(l=>!search||l.desc.toLowerCase().includes(search.toLowerCase())||l.by.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:DS.neutral6, fontSize:13 }}>⌕</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search audit logs..."
            style={{ padding:'8px 12px 8px 32px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, width:300, outline:'none', fontFamily:'inherit' }}/>
        </div>
        <button style={{ padding:'8px 16px', background:DS.white, border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', color:DS.neutral9, fontFamily:'inherit' }}>↑ Export logs</button>
      </div>
      <div style={{ background:DS.white, border:`1px solid ${DS.neutral3}`, borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr 200px 180px', padding:'10px 20px', background:DS.neutral2, borderBottom:`1px solid ${DS.neutral3}` }}>
          {['Date & time','Activity','Entity','Performed by'].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:DS.neutral7, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>)}
        </div>
        {filtered.map((l,i)=>(
          <div key={l.id} style={{ display:'grid', gridTemplateColumns:'160px 1fr 200px 180px', padding:'13px 20px', alignItems:'start', borderBottom:i<filtered.length-1?`1px solid ${DS.neutral3}`:'none' }}>
            <span style={{ fontSize:12, color:DS.neutral7 }}>{l.date}</span>
            <div><div style={{ marginBottom:4 }}><ActionBadge action={l.action}/></div><div style={{ fontSize:13, color:DS.neutral9 }}>{l.desc}</div></div>
            <div>{l.entity!=='—'&&<div style={{ fontSize:13, fontWeight:500, color:DS.neutral11 }}>{l.entity}</div>}{l.entityType!=='—'&&<div style={{ fontSize:11, color:DS.neutral6 }}>{l.entityType}</div>}</div>
            <div><div style={{ fontSize:13, color:DS.neutral9, fontWeight:500 }}>{l.by}</div><div style={{ fontSize:11, color:DS.neutral6 }}>{l.email}</div></div>
          </div>
        ))}
        {filtered.length===0&&<div style={{ padding:'40px', textAlign:'center', color:DS.neutral6 }}>No logs found</div>}
      </div>
    </div>
  )
}

function PermSetsTab({ sets, setSets, onNewSet }) {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [variant, setVariant] = useState('existing')
  const filtered = sets.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.desc.toLowerCase().includes(search.toLowerCase()))

  const deleteSet = id => { setSets(prev=>prev.filter(s=>s.id!==id)); if(selected?.id===id) setSelected(null) }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:DS.neutral6, fontSize:13 }}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search permission sets..."
              style={{ padding:'8px 12px 8px 32px', border:`1.5px solid ${DS.neutral3}`, borderRadius:8, fontSize:13, width:240, outline:'none', fontFamily:'inherit' }}/>
          </div>
          {/* Variant toggle */}
          <div style={{ display:'flex', background:DS.neutral2, borderRadius:8, padding:3, gap:2 }}>
            {['existing','new'].map(v=>(
              <button key={v} onClick={()=>setVariant(v)}
                style={{ padding:'5px 14px', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer', border:'none', fontFamily:'inherit',
                  background: variant===v ? DS.white : 'transparent',
                  color: variant===v ? DS.neutral11 : DS.neutral6,
                  boxShadow: variant===v ? '0 1px 3px rgba(9,30,66,0.12)' : 'none' }}>
                {v==='existing' ? 'Existing' : 'New navigation'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>onNewSet(variant)} style={{ padding:'8px 18px', background:DS.green7, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>+ New permission set</button>
      </div>
      <div style={{ padding:'11px 16px', background:DS.blue1, border:`1px solid #BEDBFF`, borderRadius:8, marginBottom:16, fontSize:13, color:'#1A4A9E' }}>
        <strong>How this works:</strong> New permissions are added to existing standard sets before enforcement goes live. Every current user keeps their access. Create custom sets for role-specific access.
      </div>
      <div style={{ background:DS.white, border:`1px solid ${DS.neutral3}`, borderRadius:10, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 240px 100px 70px 150px 100px', padding:'10px 20px', background:DS.neutral2, borderBottom:`1px solid ${DS.neutral3}` }}>
          {['Permission set','Modules covered','Type','Users','Last updated',''].map(h=><span key={h} style={{ fontSize:12, fontWeight:600, color:DS.neutral7, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>)}
        </div>
        {filtered.map((s,i)=>{
          const mods=Object.keys(s.perms); const userCount=INIT_USERS.filter(u=>u.sets.includes(s.name)).length
          return (
            <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 240px 100px 70px 150px 100px', padding:'14px 20px', alignItems:'center', borderBottom:i<filtered.length-1?`1px solid ${DS.neutral3}`:'none', background:selected?.id===s.id?DS.green1:DS.white, cursor:'pointer' }}
              onMouseEnter={e=>{ if(selected?.id!==s.id) e.currentTarget.style.background=DS.neutral1 }}
              onMouseLeave={e=>{ e.currentTarget.style.background=selected?.id===s.id?DS.green1:DS.white }}>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)}>
                <div style={{ fontSize:14, fontWeight:500, color:DS.neutral11 }}>{s.name}</div>
                <div style={{ fontSize:12, color:DS.neutral7, marginTop:2 }}>{s.desc}</div>
              </div>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {mods.slice(0,2).map(m=><span key={m} style={{ background:DS.neutral2, color:DS.neutral9, borderRadius:4, padding:'2px 7px', fontSize:11 }}>{m}</span>)}
                {mods.length>2&&<span style={{ background:DS.neutral2, color:DS.neutral7, borderRadius:4, padding:'2px 7px', fontSize:11 }}>+{mods.length-2}</span>}
              </div>
              <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ background:s.type==='Standard'?DS.blue1:'#F3EEFF', color:s.type==='Standard'?DS.blue9:'#6C35D4', border:`1px solid ${s.type==='Standard'?'#BEDBFF':'#DCCEFF'}`, borderRadius:4, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{s.type}</span>
              <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ fontSize:13, fontWeight:500, color:DS.neutral9 }}>{userCount}</span>
              <div onClick={()=>setSelected(selected?.id===s.id?null:s)}>
                <div style={{ fontSize:12, color:DS.neutral9 }}>{s.on}</div>
                <div style={{ fontSize:11, color:DS.neutral6 }}>{s.by}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{ fontSize:13, color:DS.green7, fontWeight:500, cursor:'pointer' }}>View</span>
                {s.type==='Custom'&&<span onClick={e=>{e.stopPropagation();deleteSet(s.id)}} style={{ fontSize:13, color:DS.red6, fontWeight:500, cursor:'pointer' }}>Delete</span>}
              </div>
            </div>
          )
        })}
        {filtered.length===0&&<div style={{ padding:'40px', textAlign:'center', color:DS.neutral6 }}>No permission sets found</div>}
      </div>
      <div style={{ marginTop:8, fontSize:12, color:DS.neutral6 }}>Showing {filtered.length} of {sets.length} permission sets</div>
      {selected&&(<><div onClick={()=>setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(9,30,66,0.25)', zIndex:199 }}/><SetDrawer set={selected} onClose={()=>setSelected(null)}/></>)}
    </div>
  )
}

// ─── User Management page ─────────────────────────────────────────────────────
function UserMgmtPage({ onBack, initialTab }) {
  const [tab, setTab] = useState(initialTab||'Users')
  const [users, setUsers] = useState(INIT_USERS)
  const [sets, setSets] = useState(INIT_SETS)
  const [showNewSet, setShowNewSet] = useState(false)
  const [newSetVariant, setNewSetVariant] = useState('existing')

  if(showNewSet) return (
    <NewPermSetPage
      variant={newSetVariant}
      onCancel={()=>setShowNewSet(false)}
      onSave={d=>{ setSets(prev=>[...prev,{ id:Date.now(), name:d.name, desc:d.desc||'Custom permission set', type:'Custom', by:'George Johnson', on:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), perms:d.perms }]); setShowNewSet(false) }}
    />
  )

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom:20, fontSize:13, color:DS.neutral7, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'inherit' }}>← Back to home</button>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:500, color:DS.neutral11 }}>Manage users</h1>
        <p style={{ fontSize:14, color:DS.neutral7, marginTop:3 }}>Manage users, audit activity and configure permission sets for your organization.</p>
      </div>
      <div style={{ display:'flex', borderBottom:`1px solid ${DS.neutral3}`, marginBottom:24 }}>
        {['Users','Audit logs','Permission sets'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 20px', background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:tab===t?600:400, color:tab===t?DS.neutral11:DS.neutral7, borderBottom:tab===t?`2px solid ${DS.green7}`:'2px solid transparent', marginBottom:-1, fontFamily:'inherit' }}>{t}</button>
        ))}
      </div>
      {tab==='Users'&&<UsersTab users={users} setUsers={setUsers} allSets={sets}/>}
      {tab==='Audit logs'&&<AuditTab/>}
      {tab==='Permission sets'&&<PermSetsTab sets={sets} setSets={setSets} onNewSet={v=>{ setNewSetVariant(v); setShowNewSet(true) }}/>}
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [navExpanded, setNavExpanded] = useState(true)
  const [activeNavId, setActiveNavId] = useState('home')
  const [page, setPage] = useState('home')
  const [showProfile, setShowProfile] = useState(false)

  const goToUserMgmt = (tab) => { setPage('usermgmt'+(tab?`_${tab}`:'')); setShowProfile(false) }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Roboto', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif" }}>
      <Sidebar expanded={navExpanded} setExpanded={setNavExpanded} activeId={activeNavId} setActiveId={setActiveNavId}/>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Top bar */}
        <div style={{ height:56, background:DS.white, borderBottom:`1px solid ${DS.neutral3}`, display:'flex', alignItems:'center', padding:'0 24px', flexShrink:0, zIndex:5 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
            <span style={{ fontSize:15, fontWeight:600, color:DS.neutral11 }}>Big Basket Prod</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color:DS.neutral6 }}><path d="M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            {/* aiRA */}
            <button style={{ width:32, height:32, border:'none', background:'transparent', cursor:'pointer', color:DS.neutral7, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4.5H14l-3.75 2.75 1.5 4.5L8 11 4.25 13.75l1.5-4.5L2 6.5h4.5L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            </button>
            <div style={{ width:1, height:24, background:DS.neutral3 }}/>
            {/* Profile */}
            <div style={{ position:'relative' }}>
              <button onClick={()=>setShowProfile(!showProfile)} style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#2466EA,#42B040)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>GJ</button>
              {showProfile && (
                <>
                  <div onClick={()=>setShowProfile(false)} style={{ position:'fixed', inset:0, zIndex:49 }}/>
                  <div style={{ position:'absolute', right:0, top:42, background:DS.white, border:`1px solid ${DS.neutral3}`, borderRadius:10, width:240, boxShadow:'0 8px 24px rgba(9,30,66,0.14)', zIndex:50, overflow:'hidden' }}>
                    <div style={{ padding:'12px 16px', borderBottom:`1px solid ${DS.neutral3}`, display:'flex', gap:10, alignItems:'center' }}>
                      <Avatar name="George Johnson" size={32}/>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:DS.neutral11 }}>George Johnson</div>
                        <div style={{ fontSize:11, color:DS.neutral7 }}>george.johnson@capillarytech.com</div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft:'auto', color:DS.neutral6, flexShrink:0 }}><path d="M4 5l2 2 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {[
                      ['Manage users', ()=>goToUserMgmt(), true],
                      ['Documentation', null, false],
                      ['Capillary Academy', null, false],
                      ['Logout', null, false],
                    ].map(([label, fn, highlight])=>(
                      <div key={label} onClick={fn||undefined} style={{ padding:'10px 16px', fontSize:13, color: highlight?DS.neutral11:DS.neutral8, cursor:fn?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'space-between', fontWeight:highlight?500:400 }}
                        onMouseEnter={e=>{ if(fn) e.currentTarget.style.background=DS.neutral1 }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='transparent' }}>
                        <span>{label}</span>
                        {fn && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color:DS.neutral5 }}><path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', background:DS.neutral1 }}>
          {page==='home' && (
            <div style={{ padding:32 }}>
              <div style={{ background:DS.white, borderRadius:12, padding:'40px 32px', maxWidth:640, margin:'0 auto', textAlign:'center', marginBottom:32 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>✦</div>
                <div style={{ fontSize:20, fontWeight:500, color:DS.neutral11, marginBottom:4 }}>Good afternoon, George. What's next?</div>
                <div style={{ fontSize:14, color:DS.neutral7, marginBottom:24 }}>Click the profile icon in the top right, then <strong style={{color:DS.green7}}>Manage users</strong> to open the User Management demo.</div>
                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  {['Pick a starting point','Program health','Trend analysis'].map(t=>(
                    <button key={t} style={{ padding:'8px 16px', border:`1px solid ${DS.neutral3}`, borderRadius:20, background:DS.white, fontSize:13, cursor:'pointer', color:DS.neutral9, fontFamily:'inherit' }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, maxWidth:640, margin:'0 auto' }}>
                {[['Promotions','14'],['Campaigns','5'],['Journeys','3'],['Coupons','14'],['Cart promotions','5'],['Badges','3']].map(([l,v])=>(
                  <div key={l} style={{ background:DS.white, border:`1px solid ${DS.neutral3}`, borderRadius:10, padding:'18px 20px', cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background=DS.neutral1}
                    onMouseLeave={e=>e.currentTarget.style.background=DS.white}>
                    <div style={{ fontSize:12, color:DS.neutral7 }}>{l}</div>
                    <div style={{ fontSize:22, fontWeight:700, color:DS.neutral11, marginTop:4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.startsWith('usermgmt') && (
            <div style={{ padding:32, minHeight:'100%' }}>
              <UserMgmtPage onBack={()=>setPage('home')} initialTab={page.includes('_')?page.split('_')[1]:undefined}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
