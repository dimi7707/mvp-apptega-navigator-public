import React from 'react';

interface ProgressTrackerProps {
  current: number;
  total: number;
  completedSteps: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  current, 
  total, 
  completedSteps 
}) => {
  const percentage = Math.round(((completedSteps.length) / total) * 100);
  
  return (
    <div className="w-full bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Getting Started
        </h3>
        <span className="text-xs text-gray-500">
          {completedSteps.length} of {total}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
              index < completedSteps.length
                ? 'bg-blue-600 text-white'
                : index === current
                ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {index < completedSteps.length ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
      
      {percentage === 100 && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🎉 Onboarding Complete!
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;