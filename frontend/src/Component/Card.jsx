import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { bookingDataContext } from '../Context/BookingContext';

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host }) {
  const navigate = useNavigate()
  const { userData }       = useContext(userDataContext)
  const { handleViewCard } = useContext(listingDataContext)
  const { cancelBooking }  = useContext(bookingDataContext)

  const [popUp, setPopUp]           = useState(false)
  const [imgIdx, setImgIdx]         = useState(0)
  const [showArrows, setShowArrows] = useState(false)

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;600;700&display=swap');
        .card-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .card-sans  { font-family: 'Lato', sans-serif; }

        /* arrow fade — triggered by parent hover, can't do with Tailwind peer/group on sibling */
        .nav-arrow                    { opacity: 0; transition: opacity 0.2s ease; }
        .img-zone:hover .nav-arrow    { opacity: 1; }

        /* dot width animation */
        .dot-pill { transition: width 0.3s ease, background 0.3s ease; }
      `}</style>

      {/* ── Card root ── */}
      <div
        className="
          card-sans relative w-[340px] max-w-[90vw] rounded-2xl overflow-hidden
          bg-white border border-[rgba(180,140,100,0.13)] cursor-pointer
          shadow-[0_4px_24px_rgba(80,40,20,0.10)]
          hover:shadow-[0_16px_48px_rgba(80,40,20,0.18)]
          hover:-translate-y-[6px] hover:scale-[1.012]
          transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(.22,.68,0,1.2)]
        "
        onClick={!isBooked ? handleClick : undefined}
      >

        {/* ══ Image carousel ══ */}
        <div
          className="img-zone relative w-full h-[220px] overflow-hidden bg-[#f0ebe4]"
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          {/* Sliding track */}
          <div
            className="flex h-full"
            style={{
              width: '300%',
              transform: `translateX(-${(imgIdx * 100) / 3}%)`,
              transition: 'transform 0.45s cubic-bezier(.77,0,.175,1)',
            }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${title} photo ${i + 1}`}
                className="h-full object-cover flex-shrink-0"
                style={{ width: '33.333%' }}
              />
            ))}
          </div>

          {/* Prev arrow */}
          <button
            className="
              nav-arrow absolute left-[10px] top-1/2 -translate-y-1/2 z-[4]
              w-[30px] h-[30px] rounded-full bg-white/80 hover:bg-white
              flex items-center justify-center border-none
              text-[#7a4a2a] text-[13px] cursor-pointer
              shadow-[0_2px_8px_rgba(0,0,0,0.12)]
            "
            onClick={(e) => changeImg(e, -1)}
          >&#8592;</button>

          {/* Next arrow */}
          <button
            className="
              nav-arrow absolute right-[10px] top-1/2 -translate-y-1/2 z-[4]
              w-[30px] h-[30px] rounded-full bg-white/80 hover:bg-white
              flex items-center justify-center border-none
              text-[#7a4a2a] text-[13px] cursor-pointer
              shadow-[0_2px_8px_rgba(0,0,0,0.12)]
            "
            onClick={(e) => changeImg(e, 1)}
          >&#8594;</button>

          {/* Dot indicators */}
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex gap-[6px] z-[3]">
            {images.map((_, i) => (
              <div
                key={i}
                className="dot-pill h-[7px] rounded-[4px] border border-white/60 cursor-pointer"
                style={{
                  width:      i === imgIdx ? '20px' : '7px',
                  background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
              />
            ))}
          </div>
        </div>

        {/* ══ Booked badge ══ */}
        {isBooked && (
          <div className="
            absolute top-[12px] right-[12px] z-[5]
            flex items-center gap-[5px]
            bg-white/90 backdrop-blur-md
            text-[#2e7d4f] text-[13px] font-bold tracking-[0.3px]
            rounded-[30px] px-[12px] py-[5px]
            shadow-[0_2px_10px_rgba(0,0,0,0.10)]
          ">
            <GiConfirmed size={15} /> Booked
          </div>
        )}

        {/* ══ Cancel badge ══ */}
        {isBooked && host === userData?._id && (
          <div
            className="
              absolute top-[46px] right-[12px] z-[5]
              flex items-center gap-[5px]
              bg-white/90 backdrop-blur-md hover:bg-[rgba(255,230,230,0.95)]
              text-[#c0392b] text-[12px] font-bold
              rounded-[30px] px-[12px] py-[5px] cursor-pointer
              border border-[rgba(192,57,43,0.18)]
              shadow-[0_2px_10px_rgba(0,0,0,0.10)]
              transition-colors duration-200
            "
            onClick={(e) => { e.stopPropagation(); setPopUp(true) }}
          >
            <FcCancel size={14} /> Cancel
          </div>
        )}

        {/* ══ Info section ══ */}
        <div className="flex flex-col gap-[6px] px-[18px] pt-[16px] pb-[18px]">

          {/* Location + Rating */}
          <div className="flex items-center justify-between">
            <span className="
              card-sans flex items-center gap-[5px]
              text-[13px] font-semibold text-[#b07d55]
              uppercase tracking-[0.8px]
              max-w-[75%] overflow-hidden text-ellipsis whitespace-nowrap
            ">
              <FaMapMarkerAlt size={11} color="#b07d55" />
              {landMark}, {city}
            </span>
            <span className="card-sans flex items-center gap-[4px] text-[14px] font-bold text-[#4a3434]">
              <FaStar size={13} color="#e8a020" /> {ratings}
            </span>
          </div>

          {/* Title */}
          <div className="card-serif text-[19px] font-bold text-[#2d1e12] tracking-[0.2px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </div>

          {/* Price */}
          <div className="card-serif flex items-baseline gap-[3px] mt-[2px]">
            <span className="text-[22px] font-bold text-[#b07d55]">
              ₹{rent.toLocaleString('en-IN')}
            </span>
            <span className="card-sans text-[13px] text-[#a08070]">/ night</span>
          </div>
        </div>

        {/* ══ Cancel confirmation overlay ══ */}
        {popUp && (
          <div
            className="
              absolute inset-0 z-[20] rounded-2xl
              bg-[rgba(30,15,5,0.45)] backdrop-blur-sm
              flex items-center justify-center
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="
              bg-white rounded-2xl px-[24px] py-[28px] w-[260px]
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              flex flex-col gap-[18px] text-center
            ">
              {/* Icon */}
              <span className="text-[36px] mx-auto">🗑️</span>

              {/* Copy */}
              <div className="flex flex-col gap-[6px]">
                <p className="card-serif text-[20px] font-bold text-[#2d1e12] leading-tight">
                  Cancel Booking?
                </p>
                <p className="card-sans text-[14px] text-[#7a5a4a]">
                  This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-[10px]">
                <button
                  className="
                    flex-1 py-[10px] rounded-[10px] cursor-pointer
                    border-[1.5px] border-[#d9c4b0] bg-white
                    card-sans text-[15px] font-semibold text-[#7a5a4a]
                    hover:bg-[#faf5f0] transition-colors duration-200
                  "
                  onClick={() => setPopUp(false)}
                >Keep</button>

                <button
                  className="
                    flex-1 py-[10px] rounded-[10px] border-none cursor-pointer
                    bg-gradient-to-br from-[#e05c5c] to-[#c0392b]
                    card-sans text-[15px] font-bold text-white
                    shadow-[0_4px_14px_rgba(192,57,43,0.3)]
                    hover:opacity-90 transition-opacity duration-200
                  "
                  onClick={() => { cancelBooking(id); setPopUp(false) }}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default Card