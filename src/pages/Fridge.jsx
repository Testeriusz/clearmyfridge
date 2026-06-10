import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const PRIMARY = '#1D9E75'
const UNITS = ['pcs', 'g', 'kg', 'ml', 'L', 'tbsp', 'tsp']
const EMPTY_FORM = { name: '', quantity: '1', unit: 'pcs', expiry_date: '' }

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(dateStr)
  return Math.round((expiry - today) / 86_400_000)
}

function expiryBadge(dateStr) {
  const days = daysUntil(dateStr)
  if (days === null) return null
  if (days < 0)   return { label: 'Expired',        bg: '#fee2e2', color: '#dc2626' }
  if (days === 0) return { label: 'Expires today',  bg: '#fee2e2', color: '#dc2626' }
  if (days <= 3)  return { label: `${days}d left`,  bg: '#fef3c7', color: '#d97706' }
  return           { label: `${days}d left`,         bg: '#d1fae5', color: PRIMARY }
}

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] transition-shadow'

export default function Fridge() {
  const [items, setItems]     = useState([])
  const [form, setForm]       = useState(EMPTY_FORM)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState(null)
  const [listError, setListError] = useState(null)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('fridge_items')
      .select('id, name, quantity, unit, expiry_date')
      .order('expiry_date', { ascending: true, nullsLast: true })
    if (error) setListError(error.message)
    else setItems(data)
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setFormError(null)
    const { error } = await supabase.from('fridge_items').insert({
      name:        form.name.trim(),
      quantity:    parseFloat(form.quantity),
      unit:        form.unit,
      expiry_date: form.expiry_date || null,
    })
    if (error) setFormError(error.message)
    else {
      setForm(EMPTY_FORM)
      await fetchItems()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('fridge_items').delete().eq('id', id)
    if (error) setListError(error.message)
    else setItems(prev => prev.filter(i => i.id !== id))
  }

  const field = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <header style={{ background: PRIMARY }} className="px-5 pt-12 pb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Fridge</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {loading ? '…' : `${items.length} item${items.length !== 1 ? 's' : ''} tracked`}
        </p>
      </header>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-24">

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3"
        >
          <p className="text-sm font-semibold text-gray-700">Add an item</p>

          <input
            className={INPUT}
            type="text"
            placeholder="Item name  (e.g. Milk)"
            value={form.name}
            onChange={field('name')}
            required
          />

          <div className="flex gap-2">
            <input
              className={`${INPUT} w-24`}
              type="number"
              placeholder="Qty"
              min="0.01"
              step="any"
              value={form.quantity}
              onChange={field('quantity')}
              required
            />
            <select
              className={`${INPUT} flex-1 bg-white`}
              value={form.unit}
              onChange={field('unit')}
            >
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 pl-1">Expiry date (optional)</label>
            <input
              className={INPUT}
              type="date"
              value={form.expiry_date}
              onChange={field('expiry_date')}
            />
          </div>

          {formError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{formError}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{ background: PRIMARY }}
            className="w-full text-white font-semibold rounded-xl py-3 text-sm active:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {saving ? 'Adding…' : '+ Add to Fridge'}
          </button>
        </form>

        {/* Item list */}
        {listError && (
          <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{listError}</p>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            <div className="text-4xl mb-3">🥦</div>
            Your fridge is empty — add something above.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
              Contents
            </p>
            {items.map(item => {
              const badge = expiryBadge(item.expiry_date)
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3"
                >
                  {/* Expiry stripe */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: badge ? badge.color : '#e5e7eb' }}
                  />

                  {/* Name + qty */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.quantity} {item.unit}
                    </p>
                  </div>

                  {/* Expiry badge */}
                  {badge && (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 ml-1 p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
