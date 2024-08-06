import React from 'react';

export default function PageNotFound() {
  return (
    <div
      className="flex items-center justify-center bg-gradient-to-r from-[#1f2937] to-[#244784]"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      <div className="text-center p-8 bg-white bg-opacity-20 backdrop-blur-md border border-transparent rounded-lg shadow-md">
        <h1 className="text-9xl font-bold text-gray-100">404</h1>
        <p className="text-2xl font-semibold text-gray-100 mt-4">
          Oops! Page not found.
        </p>
        <p className="mt-2 text-gray-200">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/" 
          className="mt-6 inline-block bg-gradient-to-r from-[#1f2937] to-[#244784] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-[#1e2a47] hover:to-[#2d3a6d] transition-all duration-300"
        >
          Go back to home
        </a>
      </div>
    </div>
  );
}
