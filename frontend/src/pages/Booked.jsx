import React, { useContext, useState, useEffect } from 'react'
import { GiConfirmed } from "react-icons/gi";
import { bookingDataContext } from '../Context/BookingContext';
import { useNavigate } from 'react-router-dom';
import Star from '../Component/Star';
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import { listingDataContext } from '../Context/ListingContext';
import axios from 'axios';

function Booked() {
  let { bookingData } = useContext(bookingDataContext)
  let [star, setStar] = useState(0)
  let { serverUrl } = useContext(authDataContext)
  let { getCurrentUser } = useContext(userDataContext)
  let { getListing, cardDetails } = useContext(listingDataContext)
  let navigate = useNavigate()
  let [visible, setVisible] = useState(false)
  let [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
  }, [])

  const handleRating = async (id) => {
    try {
      setSubmitted(true)
      let result = await axios.post(serverUrl + `/api/listing/ratings/${id}`, {
        ratings: star
      }, { withCredentials: true })
      await getListing()
      await getCurrentUser()
      setTimeout(() => navigate("/"), 500)
    } catch (error) {
      console.log(error)
      setSubmitted(false)
    }
  }

  const handleStar = (value) => {
    setStar(value)
  }

  return (
    <div className="w-screen min-h-screen bg-slate-200 flex flex-col items-center justify-center px-4 py-16 gap-5 relative">

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-5 bg-lime-700 hover:bg-lime-800 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200"
      >
        ← Back to Home
      </button>

      {/* Booking Confirmed Card */}
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Green header banner */}
        <div className="bg-lime-700 px-8 py-7 flex flex-col items-center gap-3">
          <div className="bg-white/20 rounded-full p-3">
            <GiConfirmed className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Booking Confirmed!</h1>
          <span className="bg-white/20 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full">
            ✓ All Set
          </span>
        </div>

        {/* Details */}
        <div className="px-8 py-6 flex flex-col gap-1 divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Booking ID</span>
            <span className="text-slate-600 text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg max-w-[200px] truncate">
              {bookingData._id}
            </span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Host Email</span>
            <span className="text-slate-700 text-sm font-medium max-w-[200px] truncate">
              {bookingData.host?.email}
            </span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Rent</span>
            <span className="text-lime-700 text-xl font-bold">
              ₹ {bookingData.totalRent}
            </span>
          </div>
        </div>
      </div>

      {/* Rating Card */}
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Top accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700" />

        <div className="px-8 py-7 flex flex-col items-center gap-5">
          <div className="text-center">
            <h2 className="text-slate-800 text-lg font-bold">Rate Your Stay</h2>
            <p className="text-slate-400 text-sm mt-1">How was your experience?</p>
          </div>

          {/* Stars */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleStar(val)}
                className="transition-transform duration-150 hover:scale-125 active:scale-110 focus:outline-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-9 h-9 transition-all duration-200"
                  fill={val <= star ? '#4d7c0f' : 'none'}
                  stroke={val <= star ? '#4d7c0f' : '#cbd5e1'}
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Star label */}
          <p className="text-slate-500 text-sm h-5">
            {star === 0
              ? 'Tap a star to rate'
              : <span className="text-lime-700 font-semibold">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][star]} — {star}/5</span>
            }
          </p>

          {/* Submit */}
          <button
            onClick={() => handleRating(cardDetails._id)}
            disabled={submitted || star === 0}
            className="w-full bg-lime-700 hover:bg-lime-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-base py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            {submitted ? 'Submitting…' : 'Submit Rating'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default Booked


// import React, { useContext, useState } from 'react'
// import { GiConfirmed } from "react-icons/gi";
// import { bookingDataContext } from '../Context/BookingContext';

// import { useNavigate } from 'react-router-dom';
// import Star from '../Component/Star';

// import UserContext, { userDataContext } from '../Context/UserContext';
// import { authDataContext } from '../Context/AuthContext';
// import { listingDataContext } from '../Context/ListingContext';
// import axios from 'axios';

// function Booked() {
//     let {bookingData} = useContext(bookingDataContext)
//     let [star,setStar]= useState(0)
//     let {serverUrl} = useContext(authDataContext) 
    
//     let {getCurrentUser}= useContext(userDataContext)
//     let {getListing,cardDetails} = useContext(listingDataContext)
   
   
//     let navigate = useNavigate()

//     const handleRating=async (id)=>{
//         try {
//           let result=await axios.post(serverUrl+`/api/listing/ratings/${id}`,{
//             ratings:star
//           },{withCredentials:true})
//           await getListing()
//           await getCurrentUser()
        
//           console.log(result);
//           navigate("/")
          
//         } catch (error) {
//           console.log(error)
//         }
//         }



//     const handleStar=async (value) => {
//         setStar(value)
//         console.log("you rated",value )

        
//     }

  
//   return (
//     <div className='w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-200 flex-col'>
//         <div className='w-[95%] max-w-[500px] h-[400px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg'>
//             <div className='w-[100%] h-[50%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold'><GiConfirmed className='w-[100px] h-[100px] text-[green]' />Booking Confirmed</div>
//             <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] '><span>Booking Id :</span> <span>{bookingData._id}</span></div>
//             <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] '><span>Owner Details :</span> <span>{bookingData.host?.email}</span></div>
//             <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] '><span>Total Rent :</span> <span>{bookingData.totalRent}</span></div>
//         </div>

//         <div className='w-[95%] max-w-[600px] h-[200px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg'>
//             <h1 className='text-[18px]'> {star} out of 5 Rating</h1>
//          <Star onRate={handleStar}/>
//          <button className='px-[30px] py-[10px] bg-lime-700 text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap ' onClick={()=>handleRating(cardDetails._id)}>Submit</button>
//         </div>
//         <button className='px-[30px] py-[10px] bg-lime-700 text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap absolute top-[10px] right-[20px]'onClick={()=>navigate("/")}>Back to Home</button>
      
//     </div>
//   )
// }

// export default Booked
