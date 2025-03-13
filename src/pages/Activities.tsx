import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Activities() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Back to Home
      </button>
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Fun Activities
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Today's Activities</h2>
        {/* Add your activities content here */}
      </div>
    </div>
  );
}