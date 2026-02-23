import React from 'react'

const Login = () => {
  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      
     
      <div className="backdrop-blur-lg bg-white/10 border border-black/20 shadow-2xl rounded-2xl p-8 w-full max-w-md text-violet-500">
        
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">Welcome Back 👋</h1>
          <p className="text-black/70 text-sm mt-2">
            Please login to your account
          </p>
        </div>

        
        <form className="space-y-5">
          
         
          <div className="relative">
           
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-white/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

          <div className="relative">
          
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-white/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

         
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-pink-500" />
              Remember me
            </label>
            <a href="#" className="hover:underline text-pink-700">
              Forgot password?
            </a>
          </div>

        
          <button
            type="submit"
            className="w-full bg-white text-indigo-800 font-semibold py-3 rounded-xl hover:scale-105 transform transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

      
        <p className="text-center text-sm mt-6 text-black/70">
          Don’t have an account?{" "}
          <a href="#" className="text-pink-700 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login