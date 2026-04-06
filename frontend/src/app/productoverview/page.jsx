import React from 'react'

const Product = () => {
    return (
        <div>
            {/*Overview Section */}
            <section id="overview" className="scroll-mt-32 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                    Product <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Overview</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-12">
                    Excel IQ is a platform-independent, web-based AI assistant designed to simplify spreadsheet management and data analysis without the need for traditional software installations or plugins.
                </p>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {[
                        { title: "No Plugins Required", desc: "Runs entirely within a modern web browser, avoiding corporate IT restrictions." },
                        { title: "Procedural Transparency", desc: "Our Explainable AI (XAI) allows you to verify mathematical accuracy and learn." },
                        { title: "Excel Compatible", desc: "Produces formulas and cleaned data fully compatible with Microsoft Excel." }
                    ].map((item, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* Pricing */}

            <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl xl:mb-12">
                        Our plans for you
                    </h2>
                    <div className="mb-6 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 lg:gap-8">
                        {/* plan - start */}
                        <div className="flex flex-col rounded-lg border p-4 pt-6">
                            <div className="mb-12">
                                <div className="mb-2 text-center text-2xl font-bold text-gray-800">
                                    Free
                                </div>
                                <p className="mx-auto mb-8 px-8 text-center text-gray-500">
                                    For individuals and organizations who want to try our system
                                </p>
                                <div className="space-y-2">
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">1.000 MB file storage</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">
                                            2.000 MB bandwidth per month
                                        </span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">200 tasks per month</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Comunity support</span>
                                    </div>
                                    {/* check - end */}
                                </div>
                            </div>
                            <div className="mt-auto flex flex-col gap-8">
                                <div className="flex items-end justify-center gap-1">
                                    <span className="self-start text-gray-600">$</span>
                                    <span className="text-4xl font-bold text-gray-800">0</span>
                                    <span className="text-gray-500">per user/month</span>
                                </div>
                                <a
                                    href="#"
                                    className="block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                                >
                                    Join for free
                                </a>
                            </div>
                        </div>
                        {/* plan - end */}
                        {/* plan - start */}
                        <div className="relative flex flex-col rounded-lg border-2 border-indigo-500 p-4 pt-6">
                            <div className="mb-12">
                                <div className="absolute inset-x-0 -top-3 flex justify-center">
                                    <span className="flex h-6 items-center justify-center rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                                        most popular
                                    </span>
                                </div>
                                <div className="mb-2 text-center text-2xl font-bold text-gray-800">
                                    Team
                                </div>
                                <p className="mx-auto mb-8 px-8 text-center text-gray-500">
                                    Avanced feaures for Individuals and organizations
                                </p>
                                <div className="space-y-2">
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Unlimited file storage</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">10 GB bandwidth per month</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">10.000 tasks per month</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Email support</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">100 Webhooks</span>
                                    </div>
                                    {/* check - end */}
                                </div>
                            </div>
                            <div className="mt-auto flex flex-col gap-8">
                                <div className="flex items-end justify-center gap-1">
                                    <span className="self-start text-gray-600">$</span>
                                    <span className="text-4xl font-bold text-gray-800">19</span>
                                    <span className="text-gray-500">per user/month</span>
                                </div>
                                <a
                                    href="#"
                                    className="block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                                >
                                    Continue with Team
                                </a>
                            </div>
                        </div>
                        {/* plan - end */}
                        {/* plan - start */}
                        <div className="flex flex-col rounded-lg border p-4 pt-6">
                            <div className="mb-12">
                                <div className="mb-2 text-center text-2xl font-bold text-gray-800">
                                    Enterprise
                                </div>
                                <p className="mx-auto mb-8 px-8 text-center text-gray-500">
                                    Maximum performace for organisations
                                </p>
                                <div className="space-y-2">
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Unlimited file storage</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">
                                            Unlimited bandwidth per month
                                        </span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">1.000.000 tasks per month</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Email and phone support</span>
                                    </div>
                                    {/* check - end */}
                                    {/* check - start */}
                                    <div className="flex gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">Unlimited Webhooks</span>
                                    </div>
                                    {/* check - end */}
                                </div>
                            </div>
                            <div className="mt-auto flex flex-col gap-8">
                                <div className="flex items-end justify-center gap-1">
                                    <span className="self-start text-gray-600">$</span>
                                    <span className="text-4xl font-bold text-gray-800">49</span>
                                    <span className="text-gray-500">per user/month</span>
                                </div>
                                <a
                                    href="#"
                                    className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                                >
                                    Contact Sales
                                </a>
                            </div>
                        </div>
                        {/* plan - end */}
                    </div>
                    <div className="text-center text-sm text-gray-500 sm:text-base">
                        Need help deciding?{" "}
                        <a
                            href="#"
                            className="text-gray-500 underline transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                        >
                            Get in touch
                        </a>
                        .
                    </div>
                </div>
            </div>

            {/* Custmers */}
            <section id="customers" className="scroll-mt-32 max-w-6xl mx-auto pb-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by Professionals</h2>
                    <p className="text-gray-600">See how teams are saving hours of manual data entry.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Sarah Jenkins", role: "Financial Analyst", review: "Excel IQ's automated data cleaning pipeline saved me from hours of handling missing values. The procedural transparency is a game-changer." },
                        { name: "David Chen", role: "Marketing Manager", review: "I don't know complex Excel formulas. Being able to just type what I want in plain English and get an instant, accurate formula is amazing." },
                        { name: "Emily Rogers", role: "Data Scientist", review: "The dynamic visualization generation gives me an instant high-level overview of my datasets before I dive deep into analysis. Highly recommended!" }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex text-yellow-400 text-lg mb-4">★★★★★</div>
                            <p className="text-gray-600 mb-6 italic text-sm leading-relaxed">"{testimonial.review}"</p>
                            <div>
                                <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                                <p className="text-xs text-indigo-600 font-semibold uppercase mt-1">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}

export default Product;