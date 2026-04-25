import { useState, useEffect } from 'react'
import { BarChart2, List, Settings } from 'lucide-react'
import { api } from './api'
import DashboardPage from './pages/DashboardPage'
import TradeLogPage  from './pages/TradeLogPage'
import UploadPage    from './pages/UploadPage'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: BarChart2 },
  { id: 'trades',    label: 'Trade Log',  icon: List      },
  { id: 'upload',    label: 'Data Input', icon: Settings  },
]

export default function App() {
  const [page,     setPage]     = useState('upload')
  const [summary,  setSummary]  = useState(null)

  // Lifted state — persists when navigating away from Data Input
  const [meta,     setMeta]     = useState(null)   // file info after upload
  const [pips,     setPips]     = useState('20')   // strategy params
  const [tp,       setTp]       = useState('30')

  // Check backend on mount — restore state if results already exist
  useEffect(() => {
    api.status().then(s => {
      if (s.has_results) {
        api.summary().then(data => {
          setSummary(data)
          setPage('dashboard')
        }).catch(() => {})
      }
    }).catch(() => {})
  }, [])

  const handleRunComplete = (summaryData) => {
    setSummary(summaryData)
    setPage('dashboard')
  }

  return (
    <div className="app-shell">

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="ticker">US30</div>
          <div className="sub">Backtest Terminal</div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => setPage(id)}
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <main className="main-content">
        <div className="page-header">
          <span className="page-title">
            {page === 'dashboard' && 'Dashboard  /  Performance & Analytics'}
            {page === 'trades'    && 'Trade Log  /  Full History'}
            {page === 'upload'    && 'Data Input  /  Upload & Configure'}
          </span>
        </div>

        {page === 'dashboard' && <DashboardPage summary={summary} />}
        {page === 'trades'    && <TradeLogPage  summary={summary} />}
        {page === 'upload'    && (
          <UploadPage
            onRunComplete={handleRunComplete}
            meta={meta}
            setMeta={setMeta}
            pips={pips}
            setPips={setPips}
            tp={tp}
            setTp={setTp}
            hasPreviousResults={summary !== null}
          />
        )}
      </main>
    </div>
  )
}
