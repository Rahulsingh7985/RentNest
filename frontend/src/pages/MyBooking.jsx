import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingDataContext } from '../Context/BookingContext'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
.card-enter { animation: fadeSlideUp 0.4s ease both; }`

/* ── helpers ── */
const fmt = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const fmtDay = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' })
}
const calcNights = (from, to) => {
  if (!from || !to) return null
  const n = Math.round((new Date(to) - new Date(from)) / 86_400_000)
  return n > 0 ? n : null
}
const getAvgRating = (ratings) => {
  if (!ratings?.length) return null
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
}
const getStatus = (checkIn, checkOut) => {
  const now = new Date(), ci = new Date(checkIn), co = new Date(checkOut)
  if (co < now)     return { label: 'Completed', bar: 'bg-slate-400',  pill: 'bg-slate-100 text-slate-500' }
  if (ci <= now)    return { label: 'Active',    bar: 'bg-amber-400',  pill: 'bg-amber-50 text-amber-600'  }
  return                   { label: 'Upcoming',  bar: 'bg-lime-600',   pill: 'bg-lime-50 text-lime-700'    }
}

/* ══════════════════════════════════════════
   BOOKING CARD — boarding-pass style
══════════════════════════════════════════ */
function BookingCard({ booking, index }) {
  const navigate = useNavigate()
  const listing  = booking.listing || {}
  const status   = getStatus(booking.checkIn, booking.checkOut)
  const nights   = calcNights(booking.checkIn, booking.checkOut)
  const rating   = getAvgRating(listing.ratings)

  return (
    <div
      className="card-enter group bg-white rounded-2xl overflow-hidden cursor-pointer
                 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{
        animationDelay: `${index * 80}ms`,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      // onClick={() => navigate(`/viewcard/${listing._id}`)}
    >
      {/* coloured status bar */}
      <div className={`h-1 w-full ${status.bar}`} />

      {/* ── card body ── */}
      <div className="flex flex-1">

        {/* LEFT – image */}
        <div className="relative w-[38%] flex-shrink-0 overflow-hidden bg-slate-200">
          {listing.image1
            ? <img
                src={listing.image1}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            : <div className="w-full h-full bg-slate-300" />
          }
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* rating */}
          {rating && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1
                            bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold
                            px-2.5 py-1 rounded-full shadow-sm">
              <span className="text-amber-400">★</span> {rating}
            </div>
          )}

          {/* category */}
          {listing.category && (
            <div className="absolute bottom-2.5 left-2.5 text-[10px] font-600 text-white capitalize
                            bg-white/20 backdrop-blur border border-white/30
                            px-2.5 py-0.5 rounded-full tracking-wide">
              {listing.category}
            </div>
          )}
        </div>

        {/* PERFORATED DIVIDER */}
        <div className="relative flex-shrink-0 w-px"
             style={{ background: 'repeating-linear-gradient(to bottom, #e2e8f0 0px, #e2e8f0 6px, transparent 6px, transparent 12px)' }}>
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200" />
        </div>

        {/* RIGHT – details */}
        <div className="flex-1 flex flex-col gap-3 p-4 min-w-0">

          {/* title + status pill */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-slate-900 font-bold text-[15px] leading-snug truncate"
                  style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
                {listing.title || 'Property'}
              </h3>
              <p className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5 truncate">
                <span className="text-lime-600 text-xs">◎</span>
                {listing.landMark}{listing.city ? `, ${listing.city}` : ''}
              </p>
            </div>
            <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider
                              px-2.5 py-1 rounded-full ${status.pill}`}>
              {status.label}
            </span>
          </div>

          {/* thin rule */}
          <div className="h-px bg-slate-100" />

          {/* ── Airport-style date strip ── */}
          <div className="flex items-center gap-2">

            {/* check-in */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Check-in</p>
              <p className="text-slate-900 font-extrabold text-sm leading-none">{fmt(booking.checkIn)}</p>
              <p className="text-slate-400 text-[10px] mt-1">{fmtDay(booking.checkIn)}</p>
            </div>

            {/* nights bubble + arrow */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-700 to-lime-400
                              flex items-center justify-center text-white font-extrabold text-sm
                              shadow-md shadow-lime-200">
                {nights ?? '—'}
              </div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                {nights === 1 ? 'night' : 'nights'}
              </span>
            </div>

            {/* dashed line + arrow */}
            <div className="flex-shrink-0 flex items-center gap-0.5">
              <div className="w-5 border-t-2 border-dashed border-lime-200" />
              <span className="text-lime-500 text-[10px]">▶</span>
            </div>

            {/* check-out */}
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Check-out</p>
              <p className="text-slate-900 font-extrabold text-sm leading-none">{fmt(booking.checkOut)}</p>
              <p className="text-slate-400 text-[10px] mt-1">{fmtDay(booking.checkOut)}</p>
            </div>
          </div>

          {/* thin rule */}
          <div className="h-px bg-slate-100" />

          {/* ── Footer: price + button ── */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Paid</p>
              <p className="text-lime-700 font-extrabold text-lg leading-none">
                ₹{Number(booking.totalRent || 0).toLocaleString('en-IN')}
              </p>
              {nights && listing.rent && (
                <p className="text-slate-400 text-[10px] mt-1">
                  ₹{Number(listing.rent).toLocaleString('en-IN')}/night
                </p>
              )}
            </div>

            {/* host info */}
            {booking.host?.email && (
              <div className="text-center hidden sm:block">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Host</p>
                <p className="text-[11px] text-slate-600 font-semibold max-w-[80px] truncate">
                  {booking.host.name || booking.host.email}
                </p>
              </div>
            )}

            <button
              onClick={e => { e.stopPropagation(); navigate(`/viewcard/${listing._id}`) }}
              className="text-xs font-bold text-lime-700 border border-lime-200 bg-lime-50
                         hover:bg-lime-700 hover:text-white hover:border-lime-700
                         px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0"
            >
              View →
            </button>
          </div>
        </div>
      </div>

      {/* ── Booking ID footer strip ── */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-2
                      flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Booking ID</span>
        <span className="text-[10px] font-mono text-slate-400 tracking-wide">
          {booking._id?.slice(-12).toUpperCase() || '—'}
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   SECTION WRAPPER
══════════════════════════════════════════ */
function Section({ title, emoji, count, children }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-slate-800 text-2xl font-semibold"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
          {title}
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full ml-1">
          {count}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {children}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
function MyBooking() {
  const navigate = useNavigate()
  const { myBookings, getMyBookings } = useContext(bookingDataContext)

  useEffect(() => { getMyBookings() }, [])

  const now       = new Date()
  const active    = myBookings.filter(b => new Date(b.checkIn) <= now && new Date(b.checkOut) >= now)
  const upcoming  = myBookings.filter(b => new Date(b.checkIn) > now)
  const completed = myBookings.filter(b => new Date(b.checkOut) < now)

  return (
    <>
      <style>{FONTS}</style>

      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* back */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-500 hover:text-lime-700 font-semibold
                         text-sm transition-colors group bg-none border-none cursor-pointer"
            >
              Home
            </button>

            {/* stat pills */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full">
                {active.length} Active
              </span>
              <span className="text-[11px] font-bold bg-lime-50 text-lime-700 px-3 py-1.5 rounded-full">
                {upcoming.length} Upcoming
              </span>
              <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
                {completed.length} Completed
              </span>
            </div>
          </div>
        </header>

        {/* ── Page hero ── */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-7">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-lime-600 mb-2">
            Your trips
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl text-slate-900"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
              My Bookings
            </h1>
            {myBookings.length > 0 && (
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-700 to-lime-400
                               flex items-center justify-center text-white text-sm font-extrabold
                               shadow-md shadow-lime-200 mt-1">
                {myBookings.length}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-2">
            All your reservations — dates, status & details in one place.
          </p>
        </div>

        {/* ── Empty state ── */}
        {myBookings.length === 0 && (
          <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-lime-50 border-2 border-lime-100
                            flex items-center justify-center text-4xl mb-5">
              🏡
            </div>
            <h2 className="text-slate-800 text-2xl mb-2"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
              No bookings yet
            </h2>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              Explore stays and make your first reservation!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-lime-700 to-lime-500 text-white font-bold
                         text-sm px-7 py-3 rounded-2xl shadow-md shadow-lime-200
                         hover:shadow-lg hover:from-lime-800 hover:to-lime-600 transition-all duration-200"
            >
              Explore Stays
            </button>
          </div>
        )}

        {/* ── Sections ── */}
        <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-12">
          {active.length > 0 && (
            <Section title="Active Stays" emoji="🟡" count={active.length}>
              {active.map((b, i) => <BookingCard key={b._id} booking={b} index={i} />)}
            </Section>
          )}
          {upcoming.length > 0 && (
            <Section title="Upcoming" emoji="🗓️" count={upcoming.length}>
              {upcoming.map((b, i) => <BookingCard key={b._id} booking={b} index={i} />)}
            </Section>
          )}
          {completed.length > 0 && (
            <Section title="Past Stays" emoji="✅" count={completed.length}>
              {completed.map((b, i) => <BookingCard key={b._id} booking={b} index={i} />)}
            </Section>
          )}
        </div>
      </div>
    </>
  )
}

export default MyBooking