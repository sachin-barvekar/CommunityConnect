import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-gray-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-slate-600 xl:inline">Welcome to</span>{' '}
                <span className="block text-slate-700 xl:inline">CommunityConnect</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                "Connecting Communities, Inspiring Change."
              </p>
              <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="/"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 md:py-4 md:text-lg md:px-10"
                  >
                    Join Us
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://img.freepik.com/free-vector/hand-drawn-flat-design-group-people-background-composition_23-2149192135.jpg?w=996&t=st=1719602829~exp=1719603429~hmac=e1458c05e0f199c55a6720b47ec11b433f723ab29a31afa95865ccdd218c55cd"
          alt="Community Connect"
        />
      </div>
    </div>
  );
};

export default HeroSection;