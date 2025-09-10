const STORAGE_KEYS = {
  COMPLETED_STEPS: 'navigator_completed_steps',
  CURRENT_STEP_INDEX: 'navigator_current_step_index'
} as const;

export const getCompletedSteps = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading completed steps from localStorage:', error);
    return [];
  }
};

export const saveCompletedSteps = (completedSteps: string[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(completedSteps));
  } catch (error) {
    console.warn('Error saving completed steps to localStorage:', error);
  }
};

export const addCompletedStep = (stepId: string): string[] => {
  const currentSteps = getCompletedSteps();
  if (!currentSteps.includes(stepId)) {
    const updatedSteps = [...currentSteps, stepId];
    saveCompletedSteps(updatedSteps);
    return updatedSteps;
  }
  return currentSteps;
};

export const getCurrentStepIndex = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP_INDEX);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.warn('Error reading current step index from localStorage:', error);
    return 0;
  }
};

export const saveCurrentStepIndex = (index: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP_INDEX, index.toString());
  } catch (error) {
    console.warn('Error saving current step index to localStorage:', error);
  }
};

export const clearNavigatorData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_STEPS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP_INDEX);
  } catch (error) {
    console.warn('Error clearing navigator data from localStorage:', error);
  }
};