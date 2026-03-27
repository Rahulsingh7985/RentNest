import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const bookingDataContext = createContext()

function BookingContext({ children }) {
  let [checkIn, setCheckIn] = useState("")
  let [checkOut, setCheckOut] = useState("")
  let [total, setTotal] = useState(0)
  let [night, setNight] = useState(0)
  let { serverUrl } = useContext(authDataContext)
  let { getCurrentUser } = useContext(userDataContext)
  let { getListing } = useContext(listingDataContext)
  let [bookingData, setBookingData] = useState([])
  let [myBookings, setMyBookings] = useState([])   // ✅ full booking records with dates
  let [booking, setbooking] = useState(false)
  let navigate = useNavigate()

  // ✅ fetch all bookings for current user (with checkIn/checkOut/listing details)
  const getMyBookings = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/booking/mybookings", { withCredentials: true })
      setMyBookings(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleBooking = async (id) => {
    setbooking(true)
    try {
      let result = await axios.post(serverUrl + `/api/booking/create/${id}`, {
        checkIn, checkOut, totalRent: total
      }, { withCredentials: true })
      await getCurrentUser()
      await getListing()
      await getMyBookings()   // ✅ refresh booking list after new booking
      setBookingData(result.data)
      setbooking(false)
      navigate("/booked")
      toast.success("Booking Successfully")
    } catch (error) {
      console.log(error)
      setBookingData(null)
      setbooking(false)
      toast.error(error.response.data.message)
    }
  }

  const cancelBooking = async (id) => {
    try {
      let result = await axios.delete(serverUrl + `/api/booking/cancel/${id}`, { withCredentials: true })
      await getCurrentUser()
      await getListing()
      await getMyBookings()   // ✅ refresh after cancel
      toast.success("Booking Cancelled Successfully")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  let value = {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    total, setTotal,
    night, setNight,
    bookingData, setBookingData,
    myBookings,           // ✅ expose to components
    getMyBookings,        // ✅ expose so MyBooking page can call it
    handleBooking,
    cancelBooking,
    booking, setbooking
  }

  return (
    <bookingDataContext.Provider value={value}>
      {children}
    </bookingDataContext.Provider>
  )
}

export default BookingContext