import React from 'react'

export const Singup = () => {
  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      
      
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md text-violet-600">
        
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">Create Account 🚀</h1>
          <p className="text-red/100 text-sm mt-2">
            Join us and start your journey
          </p>
        </div>

      
        <form className="space-y-5">
          
       
          <div className="relative">
           
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-black/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

         
          <div className="relative">
           
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-black/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

          <div className="relative">
           
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-black/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

         
          <div className="relative">
          
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 focus:bg-black/30 outline-none transition duration-300 placeholder-black"
            />
          </div>

     
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-indigo-500" />
            <span>
              I agree to the{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Terms & Conditions
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-semibold py-3 rounded-xl hover:scale-105 transform transition duration-300 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        
        <p className="text-center text-sm mt-6 text-black/70">
          Already have an account?{" "}
          <a href="#" className="text-blue-700 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Singup