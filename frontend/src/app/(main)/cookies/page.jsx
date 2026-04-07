"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CookieSettings() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [cookies, setCookies] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (!saved) {
      setShowBanner(true);
    } else {
      setCookies(JSON.parse(saved));
    }
  }, []);

  const acceptAll = () => {
    const all = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    localStorage.setItem("cookie-consent", JSON.stringify(all));
    setCookies(all);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    localStorage.setItem("cookie-consent", JSON.stringify(minimal));
    setCookies(minimal);
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(cookies));
    setShowModal(false);
    setShowBanner(false);
  };

  const toggle = (type) => {
    setCookies({
      ...cookies,
      [type]: !cookies[type]
    });
  };

  return (
    <>
      {/* Banner */}
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-[#020617] border border-white/10 text-white p-6 rounded-2xl shadow-2xl z-50"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-gray-300 text-sm">
              We use cookies to enhance your experience, analyze traffic, and
              improve ExcelIQ. You can customize your preferences.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border border-white/20 rounded-lg text-sm"
              >
                Settings
              </button>

              <button
                onClick={rejectAll}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
              >
                Reject
              </button>

              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#020617] text-white w-[95%] max-w-2xl p-8 rounded-2xl border border-white/10">

            <h2 className="text-2xl font-bold mb-6">
              Cookie Preferences
            </h2>

            {/* Necessary */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Necessary Cookies</h3>
                <p className="text-sm text-gray-400">
                  Required for website functionality
                </p>
              </div>

              <input type="checkbox" checked disabled />
            </div>

            {/* Analytics */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Analytics Cookies</h3>
                <p className="text-sm text-gray-400">
                  Help us understand usage
                </p>
              </div>

              <input
                type="checkbox"
                checked={cookies.analytics}
                onChange={() => toggle("analytics")}
              />
            </div>

            {/* Marketing */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Marketing Cookies</h3>
                <p className="text-sm text-gray-400">
                  Used for advertising
                </p>
              </div>

              <input
                type="checkbox"
                checked={cookies.marketing}
                onChange={() => toggle("marketing")}
              />
            </div>

            {/* Preferences */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold">Preference Cookies</h3>
                <p className="text-sm text-gray-400">
                  Save your settings
                </p>
              </div>

              <input
                type="checkbox"
                checked={cookies.preferences}
                onChange={() => toggle("preferences")}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={savePreferences}
                className="px-4 py-2 bg-indigo-600 rounded-lg"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}