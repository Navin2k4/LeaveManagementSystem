import React from "react";

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
          <p className="text-md text-white font-semibold mt-4">Guided By:</p>
          <ul className="list-none text-md text-white space-y-1">
            <li className="text-white/90 mt-2">Dr. A.M. Rajeswari - AP/CSE</li>
            <li className="text-white/90"></li>
          </ul>
          <div className="mt-4">
            <p className="text-md text-white font-semibold mb-2">Other Sites</p>
            <ul className="list-none text-md space-y-1">
              <li>
                <a
                  href="https://cgpa-calculator-l1l7.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:underline"
                >
                  CGPA Calculator
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center lg:text-right">
          <p className="text-md text-white font-semibold mb-2">
          Stellar Technology&#174;<br />&copy; {currentYear}  All Rights Reserved
          </p>
          <div className="list-none text-md text-white space-y-1">
            <p className="text-white/90 font-thin">Navin Kumaran - <span className="text-white/90 font-thin italic">22CSE48</span></p>
            <p className="text-white/90 font-thin">Vinoth Kumar - <span className="text-white/90 font-thin italic">22CSE59</span></p>
            <p className="text-white/90 font-thin">Dinesh Kumar - <span className="text-white/90 font-thin italic">22CSE35</span></p>
            <p className="text-white/90 font-thin">Udhaya Chandra Pandiyan - <span className="text-white/90 font-thin italic">22CSE57</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
