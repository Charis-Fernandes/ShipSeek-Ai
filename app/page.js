"use client";

import React from "react";
import Image from "next/image";

const ShipSeekAI = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      <header className="w-full flex justify-between items-center p-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <Image
            src="/Ship.png"
            alt="ShipSeek AI Logo"
            width={40}
            height={40}
          />
          {/* Logo Image */}
          <button className="text-lg font-bold">ShipSeekAI</button>
        </div>
        <nav className="flex gap-4">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            About Us
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            History
          </a>
        </nav>
        <button className="bg-green-500 px-4 py-2 rounded hover: ">
          Register
        </button>
      </header>

      <main className="text-center p-8">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-green-400">ShipSeek-AI</span>
        </h1>
        <p className="mt-4 text-lg max-w-2xl">
          ShipSeek AI uses deep learning and satellite imagery to detect and
          analyze ships in real time. Powered by{" "}
          <span className="text-blue-400">U-Net</span> and{" "}
          <span className="text-blue-400">AI-driven heatmaps</span>, it provides
          accurate vessel tracking for maritime surveillance, logistics, and
          research. Get precise ship insights—fast and reliable!
        </p>
      </main>

      <section className="bg-gray-800 p-8 w-3/4 flex flex-col items-center rounded-lg">
        <div className="bg-gray-700 w-64 h-80 flex items-center justify-center rounded-lg">
          <span className="text-gray-400">Nothing to see here yet!</span>
        </div>
        <p className="text-gray-400 mt-2">
          Start by uploading your first image for cropping
        </p>
        <button className="mt-4 bg-green-500 px-6 py-2 rounded">Submit</button>
      </section>

      <footer className="bg-gray-900 p-6 mt-8 w-full flex justify-between">
        <div>
          <p className="text-green-400">Call for inquiry</p>
          <p>+257 388-6895</p>
        </div>
        <div>
          <p className="text-green-400">Send us email</p>
          <p>altontheGOAT@gmail.com</p>
        </div>
        <div>
          <p className="text-green-400">Logo</p>
          <p>ShipseekAI</p>
        </div>
        <div>
          <p className="text-green-400">More to know about us:</p>
          <a
            href="https://www.linkedin.com/in/alton-fernandes"
            className="text-blue-400 block"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ShipSeekAI;
