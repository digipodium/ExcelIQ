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
            Boost your productivity with AI-powered Excel automation and insights using ExcelIQ.
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
              <li>✔ Upload Excel Files</li>
              <li>✔ Basic Data Analysis</li>
              <li>✔ Limited AI Queries</li>
              <li>✔ Simple Charts</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-black text-white shadow-xl rounded-2xl p-8 transform scale-105">
            <div className="mb-4">
              <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-2">₹499</p>
            <p className="text-gray-300 mb-6">per month</p>

            <ul className="space-y-3 mb-8">
              <li>✔ Unlimited Excel Uploads</li>
              <li>✔ Advanced AI Data Insights</li>
              <li>✔ Formula Generation</li>
              <li>✔ Smart Charts & Visualizations</li>
              <li>✔ Data Cleaning Automation</li>
            </ul>

            <button className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition">
              Upgrade Now
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border">
            <h3 className="text-xl font-semibold mb-4">Premium</h3>
            <p className="text-4xl font-bold mb-2">₹1499</p>
            <p className="text-gray-500 mb-6">per month</p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Everything in Pro</li>
              <li>✔ AI Automation Workflows</li>
              <li>✔ Bulk File Processing</li>
              <li>✔ API Access</li>
              <li>✔ Priority Support</li>
            </ul>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
              Go Premium
            </button>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Built for students, professionals, and businesses to simplify Excel with AI.  
            Upgrade anytime as your needs grow.
          </p>
        </div>

      </div>
    </div>
  );
}