"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration attempt:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-teal-900">
      {/* Map Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/map-bg.png')] bg-cover bg-center opacity-15" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/Ship.png"
              alt="ShipSeek AI Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <span className="text-lg font-bold text-white">ShipseekAI</span>
        </Link>
        <nav className="flex gap-8">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About Us
          </Link>
          <Link href="/history" className="text-gray-300 hover:text-white">
            History
          </Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login" className="text-white hover:text-teal-400 px-1 py-2">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-teal-500 px-6 py-2 rounded-md hover:bg-teal-600 text-white"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/95 rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">
            ShipSeek-AI
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-gray-700">
                Phone no.
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your number..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a password..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-500 hover:text-teal-600">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage; 