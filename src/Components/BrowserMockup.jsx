import React from "react";

const BrowserMockup = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {/* Browser Chrome/Header */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          {/* Traffic Lights */}
          <div className="flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* URL Bar */}
            <div className="ml-4 flex-1 max-w-3xl">
              <div className="bg-white rounded-md py-1 px-3 text-sm text-gray-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
                app.rokango.ng/beta
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white">
          {/* Replace the img src with your actual screenshot */}
          <img
            src="/screens/screen-3.jpeg"
            alt="Website Screenshot"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default BrowserMockup;
