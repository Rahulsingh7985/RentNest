import React, { useContext, useState, useRef } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { bookingDataContext } from '../Context/BookingContext';

/* ─── Inline styles (no extra CSS file needed) ─── */
const styles = {
  card: {
    width: '340px',
    maxWidth: '90vw',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 4px 24px rgba(80,40,20,0.10)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    border: '1px solid rgba(180,140,100,0.13)',
  },
  cardHover: {
    transform: 'translateY(-6px) scale(1.012)',
    boxShadow: '0 16px 48px rgba(80,40,20,0.18)',
  },

  /* ── image carousel ── */
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    background: '#f0ebe4',
  },
  imageTrack: (idx) => ({
    display: 'flex',
    width: '300%',
    height: '100%',
    transform: `translateX(-${(idx * 100) / 3}%)`,
    transition: 'transform 0.45s cubic-bezier(.77,0,.175,1)',
  }),
  image: {
    width: '33.333%',
    height: '100%',
    objectFit: 'cover',
    flexShrink: 0,
  },

  /* dots */
  dots: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
    zIndex: 3,
  },
  dot: (active) => ({
    width: active ? '20px' : '7px',
    height: '7px',
    borderRadius: '4px',
    background: active ? '#fff' : 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(255,255,255,0.6)',
    transition: 'width 0.3s ease, background 0.3s ease',
  }),

  /* nav arrows */
  arrow: (side) => ({
    position: 'absolute',
    top: '50%',
    [side]: '10px',
    transform: 'translateY(-50%)',
    zIndex: 4,
    background: 'rgba(255,255,255,0.82)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#7a4a2a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  }),

  /* status badge */
  bookedBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 5,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(6px)',
    color: '#2e7d4f',
    borderRadius: '30px',
    padding: '5px 12px',
    fontSize: '13px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
    letterSpacing: '0.3px',
  },
  cancelBadge: {
    position: 'absolute',
    top: '46px',
    right: '12px',
    zIndex: 5,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(6px)',
    color: '#c0392b',
    borderRadius: '30px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
    border: '1px solid rgba(192,57,43,0.18)',
    transition: 'background 0.2s',
  },

  /* info section */
  info: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: '#b07d55',
    fontWeight: 600,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontFamily: "'Lato', sans-serif",
    maxWidth: '75%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#4a3434',
    fontFamily: "'Lato', sans-serif",
  },
  title: {
    fontSize: '19px',
    fontWeight: 700,
    color: '#2d1e12',
    letterSpacing: '0.2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.25,
  },
  price: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px',
    marginTop: '2px',
  },
  priceAmount: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#b07d55',
  },
  priceLabel: {
    fontSize: '13px',
    color: '#a08070',
    fontFamily: "'Lato', sans-serif",
  },

  /* ── confirm popup overlay ── */
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(30,15,5,0.45)',
    backdropFilter: 'blur(3px)',
    zIndex: 20,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 24px',
    width: '260px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    textAlign: 'center',
  },
  dialogIcon: {
    fontSize: '36px',
    margin: '0 auto',
  },
  dialogTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#2d1e12',
    lineHeight: 1.2,
  },
  dialogSub: {
    fontSize: '14px',
    color: '#7a5a4a',
    marginTop: '-10px',
    fontFamily: "'Lato', sans-serif",
  },
  dialogActions: {
    display: 'flex',
    gap: '10px',
  },
  btnNo: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1.5px solid #d9c4b0',
    background: '#fff',
    color: '#7a5a4a',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    transition: 'background 0.2s',
  },
  btnYes: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #e05c5c, #c0392b)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    boxShadow: '0 4px 14px rgba(192,57,43,0.3)',
    transition: 'opacity 0.2s',
  },
};

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host }) {
  const navigate = useNavigate()
  const { userData } = useContext(userDataContext)
  const { handleViewCard } = useContext(listingDataContext)
  const { cancelBooking } = useContext(bookingDataContext)

  const [popUp, setPopUp] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
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
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;600;700&display=swap');
        .card-arrow { opacity: 0 !important; }
        .card-wrap:hover .card-arrow { opacity: 1 !important; }
        .cancel-badge:hover { background: rgba(255,230,230,0.95) !important; }
        .btn-no:hover { background: #faf5f0 !important; }
        .btn-yes:hover { opacity: 0.88; }
      `}</style>

      <div
        className="card-wrap"
        style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
        onClick={!isBooked ? handleClick : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image carousel ── */}
        <div
          style={styles.imageWrapper}
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <div style={styles.imageTrack(imgIdx)}>
            {images.map((src, i) => (
              <img key={i} src={src} alt={`${title} ${i + 1}`} style={styles.image} />
            ))}
          </div>

          {/* Arrows */}
          <button
            className="card-arrow"
            style={{ ...styles.arrow('left'), opacity: showArrows ? 1 : 0 }}
            onClick={(e) => changeImg(e, -1)}
          >&#8592;</button>
          <button
            className="card-arrow"
            style={{ ...styles.arrow('right'), opacity: showArrows ? 1 : 0 }}
            onClick={(e) => changeImg(e, 1)}
          >&#8594;</button>

          {/* Dots */}
          <div style={styles.dots}>
            {images.map((_, i) => (
              <div key={i} style={styles.dot(i === imgIdx)} onClick={(e) => { e.stopPropagation(); setImgIdx(i) }} />
            ))}
          </div>
        </div>

        {/* ── Badges ── */}
        {isBooked && (
          <div style={styles.bookedBadge}>
            <GiConfirmed size={15} /> Booked
          </div>
        )}
        {isBooked && host === userData?._id && (
          <div
            className="cancel-badge"
            style={styles.cancelBadge}
            onClick={(e) => { e.stopPropagation(); setPopUp(true) }}
          >
            <FcCancel size={14} /> Cancel
          </div>
        )}

        {/* ── Info ── */}
        <div style={styles.info}>
          <div style={styles.locationRow}>
            <span style={styles.location}>
              <FaMapMarkerAlt size={11} color="#b07d55" />
              {landMark}, {city}
            </span>
            <span style={styles.rating}>
              <FaStar size={13} color="#e8a020" /> {ratings}
            </span>
          </div>
          <div style={styles.title}>{title}</div>
          <div style={styles.price}>
            <span style={styles.priceAmount}>₹{rent.toLocaleString('en-IN')}</span>
            <span style={styles.priceLabel}>/ night</span>
          </div>
        </div>

        {/* ── Cancel confirmation dialog ── */}
        {popUp && (
          <div style={styles.overlay} onClick={(e) => e.stopPropagation()}>
            <div style={styles.dialog}>
              <span style={styles.dialogIcon}>🗑️</span>
              <div>
                <div style={styles.dialogTitle}>Cancel Booking?</div>
                <div style={styles.dialogSub}>This action cannot be undone.</div>
              </div>
              <div style={styles.dialogActions}>
                <button
                  className="btn-no"
                  style={styles.btnNo}
                  onClick={() => setPopUp(false)}
                >Keep</button>
                <button
                  className="btn-yes"
                  style={styles.btnYes}
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
