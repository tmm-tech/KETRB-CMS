import React, { useState, useEffect } from "react";

export default function MobileCheckWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false); // Initially set to false

  // Update the mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Run the resize handler once during the initial render
    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* Show regular content for larger screens */}
      {!isMobile && <div>{children}</div>}

      {/* Show mobile warning for smaller screens */}
      {isMobile && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12">
          <div className="text-center">
            <SmartphoneIcon className="mx-auto h-12 w-12 text-black" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800">
              Oops, this site is not mobile-friendly!
            </h1>
            <p className="mt-4 text-gray-600">
              This site is optimized for desktop devices. Please switch to a
              larger screen for the best experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SmartphoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
