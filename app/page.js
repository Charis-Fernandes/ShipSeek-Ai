"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ShipSeekAI = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultMask, setResultMask] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setSelectedImage(file);
    setResultMask(null);
    setConfidence(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Prediction failed');

      const result = await response.json();
      setResultMask(result.mask_base64);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Create canvases for both images
      const originalImg = new window.Image();
      const maskImg = new window.Image();
      
      // Set up promise to wait for both images to load
      const loadImages = new Promise((resolve) => {
        let loadedCount = 0;
        
        const checkBothLoaded = () => {
          loadedCount++;
          if (loadedCount === 2) resolve();
        };

        originalImg.onload = checkBothLoaded;
        maskImg.onload = checkBothLoaded;

        originalImg.src = previewUrl;
        maskImg.src = `data:image/png;base64,${resultMask}`;
      });

      await loadImages;

      // Create the final canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size to fit both images side by side with padding
      const padding = 40;
      const titleHeight = 60;
      canvas.width = Math.max(originalImg.width, maskImg.width) * 2 + padding * 3;
      canvas.height = Math.max(originalImg.height, maskImg.height) + titleHeight + padding * 2;

      // Fill background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ShipSeek AI Detection Result', canvas.width / 2, padding + 24);

      // Draw original image
      const originalX = padding;
      const originalY = titleHeight + padding;
      ctx.drawImage(originalImg, originalX, originalY);
      
      // Add "Original Image" label
      ctx.font = '16px Arial';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'left';
      ctx.fillText('Original Image', originalX, originalY - 10);

      // Draw detection result
      const maskX = originalX + originalImg.width + padding;
      const maskY = titleHeight + padding;
      ctx.drawImage(maskImg, maskX, maskY);

      // Add "Detected Ships" label with confidence
      ctx.fillText('Detected Ships', maskX, maskY - 10);
      
      // Add confidence indicator
      const confidenceText = `${confidence.toFixed(1)}% confidence`;
      const confidenceMetrics = ctx.measureText(confidenceText);
      const confidencePadding = 8;
      
      // Draw confidence background
      ctx.fillStyle = confidence > 80 ? '#14b8a6' : confidence > 50 ? '#eab308' : '#ef4444';
      const confidenceX = maskX + 100;
      const confidenceY = maskY - 25;
      ctx.roundRect(
        confidenceX,
        confidenceY,
        confidenceMetrics.width + confidencePadding * 2,
        20,
        4
      );
      ctx.fill();
      
      // Draw confidence text
      ctx.fillStyle = 'white';
      ctx.fillText(
        confidenceText,
        confidenceX + confidencePadding,
        confidenceY + 15
      );

      // Create download link
      const link = document.createElement('a');
      link.download = 'shipseek-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating download:', error);
      alert('Failed to generate download. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Map Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/map-bg.png')] bg-cover bg-center opacity-15" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/Ship.png"
                alt="ShipSeek AI Logo"
                fill
                style={{ objectFit: 'contain' }}
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
        <main className="flex flex-col items-center px-4 pt-12 pb-20">
          <h1 className="text-5xl font-bold text-white mb-2">
            Welcome to <span className="text-teal-400">ShipSeek-AI</span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-3xl text-center mb-16">
            ShipSeek AI uses deep learning and satellite imagery to detect and analyze
            ships in real time. Powered by{" "}
            <span className="text-teal-400">U-Net</span> and{" "}
            <span className="text-teal-400">AI-driven heatmaps</span>, it provides
            accurate vessel tracking for maritime surveillance, logistics, and research.
            Get precise ship insights—fast and reliable!
          </p>

          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-teal-400 bg-teal-400/10'
                    : 'border-gray-600 hover:border-teal-400 bg-black/40'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-[300px] mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setPreviewUrl(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      Choose different image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xl text-white">Drag or Click to Upload Image</p>
                    <label className="cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="text-teal-400 hover:text-teal-300">
                        Browse files
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!selectedImage || isLoading}
                  className={`px-8 py-3 rounded-md text-white transition-colors ${
                    !selectedImage || isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-teal-500 hover:bg-teal-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </form>

            {resultMask && (
              <div className="mt-8 p-6 bg-black/40 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Detection Result:</h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-md text-white text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  
                  </button>
                </div>
                <div className="flex justify-center gap-8">
                  <div>
                    <p className="text-gray-300 mb-2">Original Image:</p>
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="rounded-lg"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-gray-300">Detected Ships:</p>
                      {confidence !== null && (
                        <span className={`px-2 py-1 rounded text-sm ${
                          confidence > 80 ? 'bg-teal-500' :
                          confidence > 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          
                        </span>
                      )}
                    </div>
                    <img
                      src={`data:image/png;base64,${resultMask}`}
                      alt="Detection Result"
                      className="rounded-lg"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-black/40 p-8 mt-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
            <div>
              <p className="text-teal-400 font-medium mb-2">Call for inquiry</p>
              <p className="text-white">+257 388-6895</p>
            </div>
            <div>
              <p className="text-teal-400 font-medium mb-2">Send us email</p>
              <p className="text-white">altontheGOAT@gmail.com</p>
            </div>
            <div>
              <p className="text-teal-400 font-medium mb-2">Logo</p>
              <p className="text-white">ShipseekAI</p>
            </div>
            <div>
              <p className="text-teal-400 font-medium mb-2">More to know about us:</p>
              <a
                href="https://www.linkedin.com/in/alton-fernandes"
                className="text-white hover:text-teal-400 block"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ShipSeekAI;
