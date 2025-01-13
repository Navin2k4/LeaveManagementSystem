import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-[#1f2937] to-[#244784] min-h-screen">
      <div className="text-center p-8 bg-white bg-opacity-20 backdrop-blur-md border border-transparent rounded-lg shadow-md max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-gray-100">404</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-2xl font-semibold text-gray-100 mt-4">
            Oops! Page not found.
          </p>
          <p className="mt-2 text-gray-200">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="mt-4 text-xl text-gray-100 italic">
            "Not all those who wander are lost, but this page certainly is."
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/"
            className="mt-6 inline-block border border-white text-white py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            Go back home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PageNotFound;
