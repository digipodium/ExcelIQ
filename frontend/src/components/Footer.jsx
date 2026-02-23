import React from 'react'

const Footer = () => {
  return (
    <div>
  <footer className="bg-white pb-10 pt-4 sm:py-10 lg:py-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
    <div className="grid grid-cols-4 gap-12 border-t pt-10 md:grid-cols-3 lg:grid-cols-3 lg:grid-rows-4 lg:gap-8 lg:pt-12">
      <div className="col-span-full lg:col-span-1 lg:row-span-2">
        {/* logo - start */}
        <div className="mb-4 lg:-mt-2">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-4xl font-bold text-black md:text-2xl"
            aria-label="logo"
          >
            <img
              src="/Exceliq logo.jpeg"
              alt="logo"
              width={95}
              height={94}
              viewBox="0 0 95 94"
              className="h-auto w-5 text-indigo-500"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              
            </img>
            Excel IQ
          </a>
        </div>
        {/* logo - end */}
        <p className="text-sm text-gray-500">
          © 2021 - Present Excel IQ. All rights  reserved.
        </p>
      </div>
      {/* nav - start */}
      <div>
        <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
          Products
        </div>
        <nav className="flex flex-col gap-4">
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Overview
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Solutions
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Pricing
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Customers
            </a>
          </div>
        </nav>
      </div>
      {/* nav - end */}
      {/* nav - start */}
      <div>
        <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
          Company
        </div>
        <nav className="flex flex-col gap-4">
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              About
            </a>
          </div>
         
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Blog
            </a>
          </div>
        </nav>
      </div>
      {/* nav - end */}
      {/* nav - start */}
      <div>
        <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
          Support
        </div>
        <nav className="flex flex-col gap-4">
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Contact
            </a>
          </div>
      
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              FAQ
            </a>
          </div>
        </nav>
      </div>
      {/* nav - end */}
      {/* nav - start */}
      <div>
        <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">
          Legal
        </div>
        <nav className="flex flex-col gap-4">
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Terms of Service
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Privacy Policy
            </a>
          </div>
          <div>
            <a
              href="#"
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Cookie settings
            </a>
          </div>
        </nav>
      </div>
      {/* nav - end */}
    </div>
  </div>
</footer>



   </div>
  )
}

export default Footer