import React from 'react';
import { OnboardingStep } from '@/utils/stepData';
import { UserContext, getContextualHelp } from '@/utils/integrationHelpers';

interface StepGuideProps {
  step: OnboardingStep;
  context: UserContext | null;
  onComplete: (stepId: string) => void;
  onAction: (action: string, target?: string) => void;
}

const StepGuide: React.FC<StepGuideProps> = ({ 
  step, 
  context, 
  onComplete, 
  onAction 
}) => {
  const contextualHelp = context?.currentPage ? 
    getContextualHelp(context.currentPage, step) : null;

  const handleAction = (action: { label: string; target?: string; action?: string }) => {
    if (action.target) {
      onAction('navigate', action.target);
    } else if (action.action) {
      onAction(action.action);
    }
  };

  const handleCompleteStep = () => {
    onComplete(step.id);
  };

  return (
    <div className="flex-1 p-4 bg-white">
      {/* Step header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {step.title}
        </h2>
        <p className="text-sm text-gray-600">
          {step.description}
        </p>
      </div>

      {/* Contextual help */}
      {contextualHelp && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                {contextualHelp}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2 mb-4">
        {step.actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
              index === 0
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{action.label}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Tips section */}
      {step.tips && step.tips.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            💡 Tips
          </h3>
          <ul className="space-y-1">
            {step.tips.map((tip, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complete step button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleCompleteStep}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default StepGuide;