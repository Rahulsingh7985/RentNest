import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { FcCancel } from 'react-icons/fc'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { bookingDataContext } from '../Context/BookingContext'

/* ─── tiny keyframe injection (only once) ─── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(.94); }
    to   { opacity: 1; transform: scale(1);   }
  }
  .card-popup { animation: fadeInScale .18s ease both; }
`

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host, checkOut }) {
  const navigate    = useNavigate()
  const { userData }        = useContext(userDataContext)
  const { handleViewCard }  = useContext(listingDataContext)
  const { cancelBooking }   = useContext(bookingDataContext)

  const [popUp,   setPopUp]   = useState(false)
  const [imgIdx,  setImgIdx]  = useState(0)
  const [showArr, setShowArr] = useState(false)

  /* ── Auto-expire: treat as NOT booked if checkout date has passed ── */
  const isExpired    = checkOut && new Date(checkOut) < new Date()
  const activeBooked = isBooked && !isExpired   // what the UI actually shows

  const images = [image1, image2, image3]

  const handleClick = () => {
    if (popUp) return
    if (userData) handleViewCard(id)
    else navigate('/login')
  }

  const changeImg = (e, dir) => {
    e.stopPropagation()
    setImgIdx(i => (i + dir + 3) % 3)
  }

  /* average rating display */
  const avgRating = Array.isArray(ratings)
    ? ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : '—'
    : ratings ?? '—'

  return (
    <>
      <style>{STYLE}</style>

      <div
        className={`
          relative  w-[340px] max-w-[92vw] rounded-2xl overflow-hidden bg-white
          border border-stone-200/70
          shadow-[0_4px_24px_rgba(80,40,20,0.10)]
          hover:shadow-[0_16px_48px_rgba(80,40,20,0.18)]
          hover:-translate-y-1.5 hover:scale-[1.012]
          transition-all duration-300 ease-[cubic-bezier(.22,.68,0,1.2)]
          cursor-pointer 
        `}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        onClick={!activeBooked ? handleClick : undefined}
      >

        {/* ══════════════════════════════════
            IMAGE CAROUSEL
        ══════════════════════════════════ */}
        <div
          className="relative h-[220px] overflow-hidden bg-stone-100"
          onMouseEnter={() => setShowArr(true)}
          onMouseLeave={() => setShowArr(false)}
        >
          {/* track */}
          <div
            className="flex h-full transition-transform duration-[450ms] ease-[cubic-bezier(.77,0,.175,1)]"
            style={{ width: '300%', transform: `translateX(-${(imgIdx * 100) / 3}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full object-cover flex-shrink-0"
                style={{ width: '33.333%' }}
              />
            ))}
          </div>

          {/* dark gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* prev arrow */}
          <button
            className={`
              absolute left-2.5 top-1/2 -translate-y-1/2 z-10
              w-[30px] h-[30px] rounded-full bg-white/85 border-none
              flex items-center justify-center text-stone-600 text-sm
              shadow-md transition-opacity duration-200
              ${showArr ? 'opacity-100' : 'opacity-0'}
              hover:bg-white
            `}
            onClick={e => changeImg(e, -1)}
          >‹</button>

          {/* next arrow */}
          <button
            className={`
              absolute right-2.5 top-1/2 -translate-y-1/2 z-10
              w-[30px] h-[30px] rounded-full bg-white/85 border-none
              flex items-center justify-center text-stone-600 text-sm
              shadow-md transition-opacity duration-200
              ${showArr ? 'opacity-100' : 'opacity-0'}
              hover:bg-white
            `}
            onClick={e => changeImg(e, 1)}
          >›</button>

          {/* dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i) }}
                className={`
                  h-[7px] rounded-full border border-white/60
                  transition-all duration-300
                  ${i === imgIdx ? 'w-5 bg-white' : 'w-[7px] bg-white/55'}
                `}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            STATUS BADGES
        ══════════════════════════════════ */}

        {/* Booked badge */}
        {activeBooked && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5
                          bg-white backdrop-blur-sm text-emerald-700
                          text-[13px] font-bold px-3 py-[5px] rounded-full
                          shadow-md tracking-[0.3px]">
            <GiConfirmed size={14} /> Booked
          </div>
        )}

        {/* Expired badge — checkout passed */}
        {isBooked && isExpired && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5
                          bg-white/92 backdrop-blur-sm text-slate-500
                          text-[12px] font-bold px-3 py-[5px] rounded-full shadow-md">
            ✓ Stay Completed
          </div>
        )}

        {/* Cancel button — only host can cancel, only if still active */}
        {activeBooked && host === userData?._id && (
          <button
            className="absolute top-[46px] right-3 z-20 flex items-center gap-1.5
                       bg-white/92 backdrop-blur-sm text-red-600
                       text-[12px] font-bold px-3 py-[5px] rounded-full
                       shadow-md border border-red-200/40
                       hover:bg-red-50 transition-colors duration-200"
            onClick={e => { e.stopPropagation(); setPopUp(true) }}
          >
            <FcCancel size={13} /> Cancel
          </button>
        )}

        {/* ══════════════════════════════════
            INFO SECTION
        ══════════════════════════════════ */}
        <div className="px-4 pt-3.5 pb-4 flex flex-col gap-1.5">

          {/* location + rating row */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[12px] font-semibold text-amber-700
                             uppercase tracking-[0.8px] max-w-[75%] truncate">
              <FaMapMarkerAlt size={10} className="text-amber-600 flex-shrink-0" />
              {landMark}, {city}
            </span>
            <span className="flex items-center gap-1 text-[13px] font-bold text-stone-700">
              <FaStar size={12} className="text-amber-400" />
              {avgRating}
            </span>
          </div>

          {/* title */}
          <h3
            className="text-[18px] font-bold text-stone-900 truncate leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h3>

          {/* price */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[21px] font-bold text-amber-700">
              ₹{Number(rent).toLocaleString('en-IN')}
            </span>
            <span className="text-[13px] text-stone-400 font-medium">/ night</span>
          </div>
        </div>

        {/* ══════════════════════════════════
            CANCEL CONFIRM DIALOG
        ══════════════════════════════════ */}
        {popUp && (
          <div
            className="absolute inset-0 z-30 rounded-2xl flex items-center justify-center
                       bg-stone-900/45 backdrop-blur-[3px]"
            onClick={e => e.stopPropagation()}
          >
            <div className="card-popup bg-white rounded-2xl p-7 w-[260px] shadow-2xl
                            flex flex-col items-center gap-4 text-center">
              <span className="text-4xl">🗑️</span>
              <div>
                <p className="text-[19px] font-bold text-stone-800"
                   style={{ fontFamily: "'Playfair Display', serif" }}>
                  Cancel Booking?
                </p>
                <p className="text-[13px] text-stone-500 mt-1">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 w-full">
                <button
                  className="flex-1 py-2.5 rounded-xl border border-stone-200
                             text-stone-600 font-semibold text-[14px]
                             hover:bg-stone-50 transition-colors duration-150"
                  onClick={() => setPopUp(false)}
                >
                  Keep
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-700
                             text-white font-bold text-[14px] shadow-md shadow-red-200
                             hover:opacity-90 transition-opacity duration-150"
                  onClick={() => { cancelBooking(id); setPopUp(false) }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Card



// import React, { useContext } from 'react'
// import { userDataContext } from '../Context/UserContext'
// import { listingDataContext } from '../Context/ListingContext'
// import { useNavigate } from 'react-router-dom'
// import { FaStar } from "react-icons/fa";
// import { GiConfirmed } from "react-icons/gi";
// import { FcCancel } from "react-icons/fc";
// import { useState } from 'react';
// import { bookingDataContext } from '../Context/BookingContext';

// function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host }) {
//     let navigate = useNavigate()
//     let { userData } = useContext(userDataContext)
//     let { handleViewCard } = useContext(listingDataContext)
//     let [popUp, setPopUp] = useState(false)
//     let {cancelBooking}=useContext(bookingDataContext)
//     const handleClick = () => {
//         if (userData) {
//             handleViewCard(id)
//         }
//         else {
//             navigate("/login")
//         }
//     }
//     return (
//         <div className='w-[330px] max-w-[85%] h-[460px] flex items-start justify-start flex-col rounded-lg cursor-pointer relative z-[10] ' onClick={() => !isBooked ? handleClick() : null}>

//             {isBooked && <div className='text-[green] bg-white rounded-lg absolute flex items-center justify-center right-1 top-1 gap-[5px] p-[5px]'><GiConfirmed className='w-[20px] h-[20px] text-[green]' />Booked</div>}
//             {isBooked && host == userData?._id && <div className='text-[red] bg-white rounded-lg absolute flex items-center justify-center right-1 top-[50px] gap-[5px] p-[5px]' onClick={()=>setPopUp(true)} ><FcCancel className='w-[20px] h-[20px]' />Cancel Booking</div>}

//             {popUp && <div className='w-[300px] h-[100px]  bg-[#ffffffdf] absolute top-[110px] left-[13px] rounded-lg ' >
//             <div className='w-[100%] h-[50%] text-[#2e2d2d] flex items-start justify-center rounded-lg overflow-auto text-[20px]  p-[10px]'>Booking Cancel!</div>
//                 <div className='w-[100%] h-[50%] text-[18px] font-semibold flex items-start justify-center gap-[10px] text-[#986b6b]'>Are you sure? <button className='px-[20px] bg-[red] text-[white] rounded-lg hover:bg-slate-600 ' onClick={()=>{cancelBooking(id);setPopUp(false)}}>Yes</button><button className='px-[10px] bg-[red] text-[white] rounded-lg hover:bg-slate-600' onClick={()=>setPopUp(false)}>No</button></div>
//             </div>}
           
//             <div className='w-[100%] h-[67%]  rounded-lg overflow-auto flex '>
//                 <img src={image1} alt="" className='w-[100%] flex-shrink-0' />
//                 <img src={image2} alt="" className='w-[100%] flex-shrink-0' />
//                 <img src={image3} alt="" className='w-[100%] flex-shrink-0' />

//             </div>
//             <div className=' w-[100%] h-[33%] py-[20px] flex flex-col gap-[2px]'>
//                 <div className='flex items-center justify-between text-[18px] '><span className='w-[80%] text-ellipsis overflow-hidden font-semibold text-nowrap text-[#4a3434]'>In {landMark.toUpperCase()},{city.toUpperCase()}</span>
//                     <span className='flex items-center justify-center gap-[5px]'><FaStar className='text-[#eb6262]' />{ratings}</span>
//                 </div>
//                 <span className='text-[15px] w-[80%] text-ellipsis overflow-hidden text-nowrap'>{title.toUpperCase()} </span>
//                 <span className='text-[16px] font-semibold text-[#986b6b]'>₹{rent}/day</span>
//             </div>

//         </div>
//     )
// }

// export default Card 
