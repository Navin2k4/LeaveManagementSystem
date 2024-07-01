    import React from 'react';

    export default function PageNotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
            <h1 className="text-9xl font-bold text-indigo-600">404</h1>
            <p className="text-2xl font-semibold mt-4">
            Oops! Page not found.
            </p>
            <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
            </p>
            <a 
            href="/" 
            className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
            >
            Go back to home
            </a>
        </div>
        </div>
    );
    }
