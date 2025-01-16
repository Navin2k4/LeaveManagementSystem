import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t border-gray-200">
      <div className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Velammal College of Engineering and Technology
            </h3>
            <p className="text-gray-600">Madurai, Tamil Nadu</p>
          </div>

          <Link to="/know-about-us" className="text-center lg:text-right">
            <h1 className="text-lg font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-gray-600 mb-2">Department of Computer Science and Engineering</p>
            <p className="text-sm text-gray-500">
              Designed and Developed by CSE - {currentYear}
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
