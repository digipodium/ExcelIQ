import React from 'react'

const Company = () => {
    return (

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 via-white to-indigo-200 py-16">
            {/*About Section */}
            <section id="about" className="scroll-mt-32 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Excel IQ</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        ExcelIQ is proposed as a web-based AI platform that enables users to perform Excel-related tasks through natural language without relying on Excel add-ins[cite: 9]. [cite_start]The project aims to make spreadsheet intelligence accessible, efficient, and intuitive for users of all skill levels[cite: 12].
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-black-800 mb-8 text-center">Project Team</h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-8 ">
                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-700 mb-2">Ratan Prakash Verma</h3>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Frontend & AI Integration</p>
                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                [cite_start]<li>Natural Language Command Parsing [cite: 105]</li>
                                [cite_start]<li>Automated Data Cleaning Pipeline [cite: 104]</li>
                                [cite_start]<li>Dynamic Visualization Generation [cite: 107]</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                            <h3 className="text-xl font-bold text-purple-700 mb-2">Rajeshvar Pratap Singh</h3>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Backend & Architecture</p>
                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                [cite_start]<li>Distributed Web Architecture Design [cite: 112]</li>
                                [cite_start]<li>File Upload & Validation Layer [cite: 116]</li>
                                [cite_start]<li>Data Processing Microservice Setup [cite: 118]</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="-my-8 divide-y-2 divide-gray-500">
                        <div className="py-8 flex flex-wrap md:flex-nowrap">
                            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                <span className="font-semibold title-font text-gray-700">
                                    CATEGORY
                                </span>
                                <span className="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
                            </div>
                            <div className="md:flex-grow">
                                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                    Bitters hashtag waistcoat fashion axe chia unicorn
                                </h2>
                                <p className="leading-relaxed">
                                    Glossier echo park pug, church-key sartorial biodiesel vexillologist
                                    pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger
                                    bag selfies, poke vaporware kombucha lumbersexual pork belly
                                    polaroid hoodie portland craft beer.
                                </p>
                                <a className="text-black inline-flex items-center mt-4">
                                    Learn More
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="py-8 flex flex-wrap md:flex-nowrap">
                            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                <span className="font-semibold title-font text-gray-700">
                                    CATEGORY
                                </span>
                                <span className="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
                            </div>
                            <div className="md:flex-grow">
                                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                    Meditation bushwick direct trade taxidermy shaman
                                </h2>
                                <p className="leading-relaxed">
                                    Glossier echo park pug, church-key sartorial biodiesel vexillologist
                                    pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger
                                    bag selfies, poke vaporware kombucha lumbersexual pork belly
                                    polaroid hoodie portland craft beer.
                                </p>
                                <a className="text-black inline-flex items-center mt-4">
                                    Learn More
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="py-8 flex flex-wrap md:flex-nowrap">
                            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                <span className="font-semibold title-font text-gray-700">
                                    CATEGORY
                                </span>
                                <span className="text-sm text-gray-500">12 Jun 2019</span>
                            </div>
                            <div className="md:flex-grow">
                                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                    Woke master cleanse drinking vinegar salvia
                                </h2>
                                <p className="leading-relaxed">
                                    Glossier echo park pug, church-key sartorial biodiesel vexillologist
                                    pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger
                                    bag selfies, poke vaporware kombucha lumbersexual pork belly
                                    polaroid hoodie portland craft beer.
                                </p>
                                <a className="text-black inline-flex items-center mt-4">
                                    Learn More
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default Company;