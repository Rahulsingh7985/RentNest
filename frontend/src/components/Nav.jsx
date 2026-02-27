import React, { useContext } from "react";
import { Search, Menu } from "lucide-react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  let [isMenuOpen, setIsMenuOpen] = React.useState(false);
  let {serverUrl} = useContext(AuthDataContext);
  let {userData, setUserData} = useContext(UserDataContext);
  const handlelogout = async(e) => {
     try{
      let result = await axios.post(serverUrl + "/api/auth/signout", {},{withCredentials: true});
      setUserData(null);
      console.log("Logout Success:", result.data);
     }catch(error){
      console.log("Logout Error:", error.response); 
  }
}
  return (
    <div>
      <div className="w-full min-h-[80px] flex items-center justify-between px-8 bg-white border-b">

        {/* Logo Section */}
        <div className="flex items-center cursor-pointer">
          <img
            src="/image.png"
            alt="RentNest Logo"
            className="h-[50px]"
          />
          <h1 className="ml-2 text-lime-700 text-2xl font-semibold">
            RentNest
          </h1>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center justify-between border rounded-full shadow-sm hover:shadow-md transition px-4 py-2 gap-4 w-[40%]">
          <input type="text" placeholder="Any where | Any location | Any city" className=" outline-none w-full"></input>

          <button className="bg-lime-700 p-3 rounded-full text-white cursor-pointer">
            <Search size={18} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          <span className="hidden md:block text-sm font-medium cursor-pointer">
            Switch to hosting
          </span>

          <button className="flex items-center gap-2 border rounded-full px-3 py-2 shadow-sm hover:shadow-md cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={18} />
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
              {userData?.name?.charAt(0)?.toUpperCase()}
            </div>
          </button>
          {isMenuOpen && <div className="w-[220px] h-[250px] top-[110%] right-[10%] rounded-lg z-10 bg-slate-50 absolute border border-gray-300 shadow-lg">
            <ul className="flex flex-col gap-3 p-2">
              <li className="hover:bg-slate-200 p-1">My listing</li>
              <li className="hover:bg-slate-200 p-1">My booking</li>
              <li className="hover:bg-slate-200 p-1">List your home</li>
              <li className="hover:bg-slate-200 p-1" onClick={() => navigate("/login")}>Login</li>
              <li className="hover:bg-slate-200 p-1" onClick={handlelogout}>Logout</li>
            </ul>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Nav;