import React, { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { FcCancel } from 'react-icons/fc'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { bookingDataContext } from '../Context/BookingContext'

const STYLE = `
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(.94); }
  to { opacity: 1; transform: scale(1); }
}
.card-popup { animation: fadeInScale .18s ease both; }
`

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host, checkOut }) {

  const navigate = useNavigate()
  const { userData } = useContext(userDataContext)
  const { handleViewCard } = useContext(listingDataContext)
  const { cancelBooking } = useContext(bookingDataContext)

  const [popUp, setPopUp] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [showArr, setShowArr] = useState(false)

  /* ✅ MEMOIZED IMAGES */
  const images = useMemo(() => [image1, image2, image3], [image1, image2, image3])

  /* ✅ BOOKING STATE */
  const isExpired = checkOut && new Date(checkOut) < new Date()
  const activeBooked = isBooked && !isExpired

  /* ✅ CLICK HANDLER */
  const handleClick = () => {
    if (popUp) return
    userData ? handleViewCard(id) : navigate('/login')
  }

  /* ✅ IMAGE CHANGE */
  const changeImg = (e, dir) => {
    e.stopPropagation()
    setImgIdx(prev => (prev + dir + images.length) % images.length)
  }

  /* ✅ AVG RATING */
  const avgRating = useMemo(() => {
    if (Array.isArray(ratings)) {
      return ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : '—'
    }
    return ratings ?? '—'
  }, [ratings])

  return (
    <>
      <style>{STYLE}</style>

      <div
        className="relative w-[340px] max-w-[92vw] rounded-2xl overflow-hidden bg-white
                   border border-gray-200 shadow-md hover:shadow-xl
                   transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        onClick={!activeBooked ? handleClick : undefined}
      >

        {/* IMAGE SECTION */}
        <div
          className="relative h-[220px] overflow-hidden"
          onMouseEnter={() => setShowArr(true)}
          onMouseLeave={() => setShowArr(false)}
        >
          {/* SLIDER */}
          <div
            className="flex h-full transition-transform duration-500"
            style={{ transform: `translateX(-${imgIdx * 100}%)` }}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* ARROWS */}
          {showArr && (
            <>
              <button
                onClick={(e) => changeImg(e, -1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow"
              >‹</button>

              <button
                onClick={(e) => changeImg(e, 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow"
              >›</button>
            </>
          )}

          {/* DOTS */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                className={`h-2 rounded-full cursor-pointer transition-all 
                  ${i === imgIdx ? 'w-4 bg-white' : 'w-2 bg-white/60'}`}
              />
            ))}
          </div>
        </div>

        {/* BADGES */}
        {activeBooked && (
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-green-600 text-sm shadow">
            <GiConfirmed /> Booked
          </div>
        )}

        {activeBooked && host === userData?._id && (
          <button
            className="absolute top-12 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-red-500 text-sm shadow"
            onClick={(e) => { e.stopPropagation(); setPopUp(true) }}
          >
            <FcCancel /> Cancel
          </button>
        )}

        {/* INFO */}
        <div className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="flex items-center gap-1 truncate">
              <FaMapMarkerAlt /> {landMark}, {city}
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <FaStar className="text-yellow-500" /> {avgRating}
            </span>
          </div>

          <h3 className="font-semibold text-lg truncate">{title}</h3>

          <p className="text-orange-600 font-bold text-lg">
            ₹{rent}
            <span className="text-sm text-gray-500"> / night</span>
          </p>
        </div>

        {/* POPUP */}
        {popUp && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="card-popup bg-white p-5 rounded-xl text-center w-[260px]">
              <p className="font-bold text-lg">Cancel Booking?</p>
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 bg-gray-200 py-2 rounded"
                  onClick={() => setPopUp(false)}
                >
                  No
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                  onClick={() => {
                    cancelBooking(id)
                    setPopUp(false)
                  }}
                >
                  Yes
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
