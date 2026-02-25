import React, { useContext } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";

function SignUp() {
    let {serverUrl} = useContext(AuthDataContext);
    let [name, setName] = React.useState("");
    let [email, setEmail] = React.useState("");
    let [password, setPassword] = React.useState("");

    const handleSignUp = async (e) => {
        try {
            e.preventDefault();
            let result = await axios.post(serverUrl + "/api/auth/signup", {
                name,
                email,
                password
            })
            console.log("Success:", result.data);
        } catch (error) {
            console.log("Full Error:", error.response);
            console.log("Message:", error.response?.data);
        }
    }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border">
        
        <h1 className="text-2xl font-semibold text-center mb-6">
          Join <span className="text-lime-700">RentNest</span>
        </h1>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full name"
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-lime-400"
            onChange={(e)=>setName(e.target.value)} value={name}
          />

          <input
            type="email"
            placeholder="Email address"
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-lime-400"
            onChange={(e)=>setEmail(e.target.value)} value={email}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-lime-400"
            onChange={(e)=>setPassword(e.target.value)} value={password}
          />

          <input
            type="password"
            placeholder="Confirm password"
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />

          <button
            type="submit"
            className="w-full bg-lime-700 text-white py-3 rounded-lg font-semibold hover:bg-lime-800 transition duration-300"
            
          >
            Agree and Continue
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-lime-700 font-medium cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;