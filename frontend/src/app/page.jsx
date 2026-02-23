import React from 'react'

export const Home = () => {
  return (
    <div>

      <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
  
    <section className="flex flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row">
      {/* content - start */}
      <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-5/12 xl:py-24">
        <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">
          Proudly Presenting ExcelIQ
        </p>
        <h1 className="mb-8 text-2xl font-bold text-black sm:text-5xl md:mb-12 md:text-4xl">
          Redefining the Future of Excel Learning
        </h1>
        <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
          ExcelIQ combines intelligence with simplicity to deliver a next-generation Excel experience. Our platform provides smart guidance, instant solutions, and interactive learning tools that help users solve Excel challenges faster than ever before.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
          <a
            href="/"
            className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
          >
            Start now
          </a>
          <a
            href="#"
            className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
          >
            Take tour
          </a>
        </div>
      </div>
      {/* content - end */}
      {/* image - start */}
      <div className="h-48 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto xl:w-5/12">
        <img
          src="hero sectionexceliq.png"
          loading="lazy"
          alt="Photo by Fakurian Design"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* image - end */}
    </section>
  </div>
</div>

     
      
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          <p className='text-violet-800'>Excel IQ</p> AI-Powered{" "}
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Spreadsheet Automation
          </span>
          : Formulas, Pivot-Tables, Charts & Data Insights.
        </h1>

        
        <p className="text-gray-600 mt-6 text-lg">
          From generating complex formulas and Pivot Tables to creating charts
          and uncovering deep insights, streamline your spreadsheets with AI.
        </p>
      </div>

      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
        
       
        <div className="flex items-center">
          <div className="flex -space-x-3">
            <img
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/men/2.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/men/3.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/women/4.jpg"
              alt="user"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </div>
          <span className="ml-4 text-sm text-gray-600">
            <span className="text-purple-600 font-semibold">
              1.4 Million+
            </span>{" "}
            Happy users
          </span>
        </div>

      
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-2">
          GET STARTED →
        </button>
      </div>

     
      <div className="absolute left-10 top-32 w-20 h-20 border-4 border-green-400 rounded-full opacity-20"></div>
      <div className="absolute right-10 top-20 w-24 h-24 border-4 border-red-400 rounded-full opacity-20"></div>


  
  <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
    
   
  </div>
</div>


</div>
  )
}

export default Home