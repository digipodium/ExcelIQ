"Use client";
import Link from "next/link";


export default function Navbar() {
  return (
    <div>
<div className="bg-white lg:pb-12 ">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
    <header className="flex items-center justify-between py-4 md:py-8 ">
      {/* logo - start */}
      <a
        href="/"
        className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl"
        aria-label="logo"
      >
        <img
          src="/Exceliq logo.jpeg"
          height={54}
          width={54}
        
        >
         
        </img>
        Excel IQ
      </a>
      {/* logo - end */}
      {/* nav - start */}
      <nav className="hidden gap-12 lg:flex ">
       
      </nav>
      {/* nav - end */}
      {/* buttons - start */}
      <div className="-ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
        <Link
          href="/login"
          className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:text-indigo-500 focus-visible:ring active:text-indigo-600 md:text-base"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
        >
          Sign up
        </Link>
      </div>
      
    </header>
   
  
  </div>
</div>




    </div>
  )
}

