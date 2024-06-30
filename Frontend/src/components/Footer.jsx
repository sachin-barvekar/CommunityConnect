import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 bg-opacity-75 text-white p-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold">Community Connect</h3>
          <p className="text-sm">&copy; {new Date().getFullYear()} Community Connect. All rights reserved.</p>
        </div>
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <li>
              <a href="#" className="text-sm hover:text-gray-300 transition duration-300">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-gray-300 transition duration-300">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-gray-300 transition duration-300">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <h3 className="text-lg font-semibold mb-2 sm:mb-0">Follow Us</h3>
          <div className="flex space-x-4 justify-center sm:justify-start">
            <a href="#" className="text-sm hover:text-gray-300 transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-sm hover:text-gray-300 transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-sm hover:text-gray-300 transition duration-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-sm hover:text-gray-300 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}