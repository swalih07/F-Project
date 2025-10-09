import axios from "axios";
import { useState } from "react";
function Registration(){
    const[fullName,setFullName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[message,setMessage]=useState("")
    const[error,setError]=useState({})
    const validateForm=()=>{
      let newError={};

      if(!fullName.trim()){
        newError.fullName="Full name is required!";
      }

      if(!email.trim()){
        newError.email="Email is required!";
      }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        newError.email="Invalid email format!"
      }

      if(!password.trim()){
        newError.password="Password is required!"
      }else if(password.length<6){
        newError.password="Password must be at least 6 characters!"
      }

      setError(newError);
      return Object.keys(newError).length===0;
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();

      if(!validateForm())return;
      const newUser={fullName,email,password}

      try{
        const response=await axios.post("http://localhost:5000/users",newUser)

        if(response.status === 201){
          setMessage("Registered Successfully!");
          setFullName("");
          setEmail("");
          setPassword("");
          setError({});
        }
      }catch(error){
        console.log("Error:",error)
        setMessage("⚠️ Server Error. Please try again later.")
      }
    }

  return (
    <div className="min-h-screen bg-gray flex justify-center items-center px-4">
      <br /><br /><br />
    <div className="bg-slate-800 text-white rounded-lg shadow-lg w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col">
                <label htmlFor="fullname" className="mb-1 font-semibold ">Full Name</label>
                <input
                    type="text"
                    id="fullname"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e)=>setFullName(e.target.value)}
                    className="px-4 py-2 rounded-md text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                {error.fullName && <p className="text-red-400 text-sm mt-1">{error.fullName}</p>}
                </div>
                {/* Email */}
                <div className="flex flex-col">
                   <label htmlFor="email" className="mb-1 font-semibold">Email</label>
                   <input 
                       type="email"
                       id="email"
                       placeholder="Enter your email"
                       value={email}
                       onChange={(e)=>setEmail(e.target.value)}
                       className="px-4 py-2 rounded-md text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                   />
                   {error.email && <p className="text-red-400 text-sm mt-1">{error.email}</p>}
                </div>
                {/* password */}
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="px-4 py-2 rounded-md text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                    />
                    {error.password && <p className="text-red-400 text-sm mt-1">{error.password}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 transition text-white font-semibold py-2 rounded-md mt-2" 
                >
                  Register
                </button>
          </form>
               {message && (
          <p className="text-center mt-4 text-sm text-yellow-300">{message}</p>
        )}
              <div className="mt-4 text-center">
                  <p className="text-gray-300">
                      Already have an account?{" "}
                      <a href="/login" className="text-blue-400 hover:underline font-semibold">
                          Login
                      </a>
                  </p>
              </div>
    </div>
    </div>
  )
}

export default Registration;
