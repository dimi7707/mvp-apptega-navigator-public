import React, { useState, useEffect } from 'react';
import ProgressTracker from './ProgressTracker';
import StepGuide from './StepGuide';
import QuickActions from './QuickActions';
import { onboardingSteps, getNextStep, getContextualActions } from '@/utils/stepData';
import { 
  AppregaIntegration, 
  UserContext, 
  isStepAvailable 
} from '@/utils/integrationHelpers';
import {
  getCompletedSteps,
  addCompletedStep,
  getCurrentStepIndex,
  saveCurrentStepIndex
} from '@/utils/storageHelpers';

const NavigatorWidget: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const integration = AppregaIntegration.getInstance();
  const currentStep = onboardingSteps[currentStepIndex];

  // Hydration effect - load localStorage data after client hydration
  useEffect(() => {
    setIsHydrated(true);
    setCurrentStepIndex(getCurrentStepIndex());
    setCompletedSteps(getCompletedSteps());
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Set up context listener
    integration.onContextUpdate((context: UserContext) => {
      setUserContext(context);
      // Merge context completed steps with localStorage
      if (context.completedSteps) {
        const mergedSteps = [...new Set([...completedSteps, ...context.completedSteps])];
        setCompletedSteps(mergedSteps);
      }
    });

    // Request initial context from parent
    integration.requestContext();

    // Auto-advance based on completed steps
    const timer = setTimeout(() => {
      if (completedSteps.length > 0) {
        const lastCompletedIndex = onboardingSteps.findIndex(
          step => step.id === completedSteps[completedSteps.length - 1]
        );
        if (lastCompletedIndex >= 0 && lastCompletedIndex + 1 < onboardingSteps.length) {
          const newIndex = lastCompletedIndex + 1;
          setCurrentStepIndex(newIndex);
          saveCurrentStepIndex(newIndex);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [completedSteps, integration, isHydrated]);

  const handleStepComplete = (stepId: string) => {
    // Update localStorage and state
    const updatedSteps = addCompletedStep(stepId);
    setCompletedSteps(updatedSteps);
    
    // Notify parent application
    integration.completeStep(stepId);
    
    // Move to next step if available
    const nextStep = getNextStep(stepId);
    if (nextStep) {
      const nextIndex = onboardingSteps.findIndex(step => step.id === nextStep.id);
      if (nextIndex >= 0 && isStepAvailable(nextStep.id, updatedSteps, nextStep)) {
        setCurrentStepIndex(nextIndex);
        saveCurrentStepIndex(nextIndex);
      }
    }
  };

  const handleAction = (action: string, target?: string) => {
    switch (action) {
      case 'navigate':
        if (target) {
          integration.navigateTo(target);
        }
        break;
      case 'start_tour':
        integration.startTour();
        break;
      case 'help':
        integration.navigateTo('/help');
        break;
      default:
        integration.sendAction(action, target);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      saveCurrentStepIndex(newIndex);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      saveCurrentStepIndex(newIndex);
    }
  };

  const contextualActions = userContext ? getContextualActions(userContext) : [];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="navigator-widget w-full max-w-sm h-full max-h-screen bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-900">Navigator</h1>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              const bedrockPanel = document.querySelector('[data-test="bedrock-test-panel"]') as HTMLElement;
              if (bedrockPanel) {
                bedrockPanel.style.display = bedrockPanel.style.display === 'none' ? 'block' : 'none';
              }
            }}
            className="flex items-center space-x-1 px-2 py-1 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-all duration-200"
            data-test="minimize-button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
            </svg>
            <span className="text-xs font-semibold">IA</span>
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker 
        current={currentStepIndex} 
        total={onboardingSteps.length}
        completedSteps={completedSteps}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <StepGuide
          step={currentStep}
          context={userContext}
          onComplete={handleStepComplete}
          onAction={handleAction}
        />

        {/* Navigation controls */}
        <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className="px-3 py-1 text-xs font-medium text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors duration-200"
          >
            ← Previous
          </button>
          
          <span className="text-xs text-gray-500">
            {currentStepIndex + 1} / {onboardingSteps.length}
          </span>
          
          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === onboardingSteps.length - 1}
            className="px-3 py-1 text-xs font-medium text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {contextualActions.length > 0 && (
        <QuickActions
          actions={contextualActions}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default NavigatorWidget;