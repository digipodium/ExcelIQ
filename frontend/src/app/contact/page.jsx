import React from 'react'

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Contact <span className="text-indigo-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600">
            We'd love to talk about how we can help you with Excel IQ.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">

          {/* Form Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="First Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Last Name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Details</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all">
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Knowledgebase</h3>
              <p className="text-gray-600 mt-1">We're here to help with any questions or code.</p>
              <a href="/support" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">Visit Support Center &rarr;</a>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">FAQ</h3>
              <p className="text-gray-600 mt-1">Search our FAQ for answers to anything you might ask.</p>
              <a href="/support#faq" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">Read FAQs &rarr;</a>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Contact us by email</h3>
              <p className="text-gray-600 mt-1">If you wish to write us an email instead please use:</p>
              <span className="text-indigo-600 font-semibold mt-2 inline-block">support@exceliq.com</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact