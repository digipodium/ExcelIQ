"use client";

import { ArrowRight, Link } from "lucide-react";


const posts = [
  {
    title: "How Excel IQ Analyzes Excel CV Files",
    desc: "Learn how our AI-powered system extracts insights from Excel CV files and helps recruiters make better decisions.",
    img: "excel.jpg",
    tag: "Product"
  },
  {
    title: "Top 10 Excel Tips Every Analyst Should Know",
    desc: "Boost your productivity with these powerful Excel tricks used by professionals.",
    img: "https://images.unsplash.com/photo-1543286386-713bdd548da4",
    tag: "Excel Tips"
  },
  {
    title: "Why Data Analysis Skills Are Important in 2026",
    desc: "Explore why companies value data analysis and how Excel skills can boost your career.",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    tag: "Career"
  }
];

export default function Blog() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-purple-50 via-white to-gray-50 overflow-hidden">

      {/* glow background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 blur-[120px] opacity-30 rounded-full"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-indigo-300 blur-[120px] opacity-30 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Latest From Our Blog
          </h2>

          <p className="mt-4 text-gray-500">
            Insights, tutorials and updates from Excel IQ
          </p>
        </div>

        {/* blog grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {posts.map((post, index) => (

            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden hover:-translate-y-2"
            >

              {/* image */}
              <div className="overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* content */}
              <div className="p-6">

                <span className="text-sm font-medium text-purple-600">
                  {post.tag}
                </span>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition">
                  {post.title}
                </h3>

                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {post.desc}
                </p>

                <button className="flex items-center gap-2 mt-5 text-purple-600 font-medium hover:gap-3 transition">
                  Read More
                  <ArrowRight size={18}/>
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* view all */}

         
        <div className="text-center mt-16">

          
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-105 transition shadow-lg">
              View All Articles
            </button>
            </div>
          
        

      </div>
    </section>
  );
}