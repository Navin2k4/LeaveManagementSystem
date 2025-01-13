"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Clock, AlertTriangle, Users } from "lucide-react";

const systems = [
  {
    name: "Leave Management System",
    icon: FileText,
    developers: [
      "Navin Kumaran - 22CSEB48",
      "Vinoth Kumar - 22CSEB59",
      "Dinesh Kumar - 22CSEB35",
      "Udhaya Chandra Pandiyan - 22CSEB57",
    ],
  },
  {
    name: "OD Management System",
    icon: Clock,
    developers: [
      "Developer 1 - ID1",
      "Developer 2 - ID2",
      "Developer 3 - ID3",
      "Developer 4 - ID4",
    ],
  },
  {
    name: "Defaulter Management System",
    icon: AlertTriangle,
    developers: [
      "Developer 5 - ID5",
      "Developer 6 - ID6",
      "Developer 7 - ID7",
      "Developer 8 - ID8",
    ],
  },
  {
    name: "Our Project Coordinators",
    icon: Users,
    developers: ["Dr. Revathy Mam - AP/CSE", "Dr. Padma Mam- AP/CSE"],
  },
];

const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-12">
          About Our Systems
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {systems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <system.icon className="h-8 w-8 text-blue-300 mr-3" />
                <h2 className="text-2xl font-semibold">{system.name}</h2>
              </div>
              <div className="space-y-2">
                {system.developers.map((developer, idx) => (
                  <p key={idx} className="text-md text-gray-100">
                    {developer}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center bg-white/5 backdrop-blur-lg rounded-lg p-8"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-blue-300">Empowering Hasseless management Through Technology</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                <h4 className="text-xl font-semibold mb-4 text-blue-200">Our Vision</h4>
                <p className="text-gray-200">
                  To revolutionize academic administration through innovative digital solutions that enhance the educational experience.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                <h4 className="text-xl font-semibold mb-4 text-blue-200">Our Mission</h4>
                <p className="text-gray-200">
                  Creating seamless connections between students, faculty, and administration while maintaining transparency and efficiency.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                <h4 className="text-xl font-semibold mb-4 text-blue-200">Our Values</h4>
                <p className="text-gray-200">
                  Innovation, integrity, and excellence in every aspect of our service to the VCET community.
                </p>
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-xl mb-8">
              <h4 className="text-2xl font-bold mb-6 text-blue-200">Why Choose VCET Connect?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    Streamlined Leave Management
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    Real-time Status Updates
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    Secure Data Handling
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    Automated Notifications
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    Intuitive User Interface
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="mr-2 text-blue-200">✦</span>
                    24/7 System Availability
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-blue-200 italic">
              A proud initiative of the Department of Computer Science and Engineering, VCET
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
