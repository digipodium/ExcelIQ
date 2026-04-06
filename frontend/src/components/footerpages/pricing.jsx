export default function Pricing() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple & Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your investment journey. Upgrade anytime as you grow with BharatInvesto.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Basic Plan */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border">
            <h3 className="text-xl font-semibold mb-4">Basic</h3>
            <p className="text-4xl font-bold mb-2">₹0</p>
            <p className="text-gray-500 mb-6">Free Forever</p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Live Market Overview</li>
              <li>✔ Basic Stock Tracking</li>
              <li>✔ Limited Research Access</li>
              <li>✔ Community Support</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-black text-white shadow-xl rounded-2xl p-8 transform scale-105">
            <div className="mb-4">
              <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-2">₹999</p>
            <p className="text-gray-300 mb-6">per month</p>

            <ul className="space-y-3 mb-8">
              <li>✔ Real-Time Market Data</li>
              <li>✔ Advanced Technical Analysis</li>
              <li>✔ Portfolio Tracking</li>
              <li>✔ Smart Alerts & Notifications</li>
              <li>✔ In-Depth Research Reports</li>
            </ul>

            <button className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition">
              Upgrade Now
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border">
            <h3 className="text-xl font-semibold mb-4">Premium</h3>
            <p className="text-4xl font-bold mb-2">₹2499</p>
            <p className="text-gray-500 mb-6">per month</p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Everything in Pro</li>
              <li>✔ Exclusive Stock Picks</li>
              <li>✔ Priority Support</li>
              <li>✔ Advanced Strategy Tools</li>
              <li>✔ Early Feature Access</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Go Premium
            </button>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="text-gray-600">
            All plans are designed to empower smarter investing.  
            Cancel or upgrade anytime.
          </p>
        </div>

      </div>
    </div>
  );
}