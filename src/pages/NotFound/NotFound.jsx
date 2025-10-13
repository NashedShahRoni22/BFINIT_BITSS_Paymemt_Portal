import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Text */}
        <h1 
          className="text-8xl md:text-9xl font-bold mb-6"
          style={{ color: '#013ff2' }}
        >
          404
        </h1>

        {/* Message */}
        <h2 
          className="text-3xl md:text-4xl font-semibold mb-4"
          style={{ color: '#212529' }}
        >
          Under Maintenance
        </h2>
        
        <p 
          className="text-lg mb-10"
          style={{ color: '#212529', opacity: 0.7 }}
        >
          The page you're looking for is under development.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200"
            style={{
              color: '#013ff2',
              borderColor: '#013ff2',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f4f8ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: '#013ff2',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Home className="w-5 h-5" />
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
}