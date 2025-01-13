import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1f3a6e] text-white py-6 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
          <p className="text-lg font-semibold text-white mb-1">
            Velammal College of Engineering and Technology, Madurai
          </p>
          <p className="text-md text-white font-semibold mb-2">
            Department of Computer Science and Engineering
          </p>
        </div>
        <Link to="/know-about-us">
        <div>
          <h1 className="text-white text-xl font-bold text-right">About Us</h1>
          <p className="text-white text-md text-right">Designed and Developed CSE</p> 
        </div>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
