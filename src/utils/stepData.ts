export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetPage?: string;
  prerequisite?: string;
  actions: {
    label: string;
    target?: string;
    action?: string;
  }[];
  tips: string[];
  contextualHelp?: {
    [key: string]: string;
  };
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Apptega',
    description: 'Let\'s get you started with your first assessment',
    targetPage: 'dashboard',
    actions: [
      { label: 'Start First Assessment', target: '/assessments/new' },
      { label: 'Tour the Platform', action: 'start_tour' }
    ],
    tips: [
      'Assessments are the foundation of your compliance program',
      'Start with a simple compliance framework',
      'You can always add more complexity later'
    ]
  },
  {
    id: 'first_assessment',
    title: 'Create Your First Assessment',
    description: 'Choose a framework and start documenting your controls',
    targetPage: 'assessments',
    prerequisite: 'welcome',
    actions: [
      { label: 'Choose Framework', target: '/assessments/templates' },
      { label: 'Start from Scratch', target: '/assessments/new' }
    ],
    tips: [
      'Popular frameworks include SOC 2, ISO 27001, and NIST',
      'Templates help you get started faster',
      'You can customize any framework to fit your needs'
    ],
    contextualHelp: {
      'assessments': 'Click the "New Assessment" button to get started',
      'assessments/new': 'Great! Now select your compliance framework'
    }
  },
  {
    id: 'document_upload',
    title: 'Upload Supporting Documents',
    description: 'Add documents that support your compliance controls',
    targetPage: 'documents',
    prerequisite: 'first_assessment',
    actions: [
      { label: 'Upload Documents', target: '/documents/upload' },
      { label: 'Link to Controls', target: '/assessments/controls' }
    ],
    tips: [
      'Organize documents by control or policy area',
      'Use clear, descriptive file names',
      'Link documents to specific assessment controls'
    ],
    contextualHelp: {
      'documents': 'Drag and drop files or use the upload button',
      'documents/upload': 'Select multiple files to upload at once'
    }
  },
  {
    id: 'risk_identification',
    title: 'Identify and Link Risks',
    description: 'Document risks and connect them to your assessment',
    targetPage: 'risks',
    prerequisite: 'document_upload',
    actions: [
      { label: 'Add New Risk', target: '/risks/new' },
      { label: 'View Risk Register', target: '/risks' }
    ],
    tips: [
      'Start with high-impact, high-probability risks',
      'Link risks to specific assessment controls',
      'Use consistent risk scoring methodology'
    ],
    contextualHelp: {
      'risks': 'Use the risk register to track all identified risks',
      'risks/new': 'Describe the risk and its potential impact'
    }
  },
  {
    id: 'task_management',
    title: 'Create Implementation Tasks',
    description: 'Break down compliance work into manageable tasks',
    targetPage: 'tasks',
    prerequisite: 'risk_identification',
    actions: [
      { label: 'Create Task', target: '/tasks/new' },
      { label: 'Assign Team Members', target: '/tasks/assign' }
    ],
    tips: [
      'Create specific, actionable tasks',
      'Set realistic deadlines',
      'Assign tasks to appropriate team members'
    ],
    contextualHelp: {
      'tasks': 'Track progress on all compliance-related tasks',
      'tasks/new': 'Be specific about what needs to be accomplished'
    }
  },
  {
    id: 'dashboard_overview',
    title: 'Monitor Your Progress',
    description: 'Use the dashboard to track compliance metrics',
    targetPage: 'dashboard',
    prerequisite: 'task_management',
    actions: [
      { label: 'View Dashboard', target: '/dashboard' },
      { label: 'Generate Reports', target: '/reports' }
    ],
    tips: [
      'Check your dashboard regularly',
      'Monitor assessment completion rates',
      'Track task progress and deadlines'
    ],
    contextualHelp: {
      'dashboard': 'Your compliance overview at a glance',
      'reports': 'Generate reports for stakeholders and auditors'
    }
  }
];

export const getStepById = (id: string): OnboardingStep | undefined => {
  return onboardingSteps.find(step => step.id === id);
};

export const getNextStep = (currentStepId: string): OnboardingStep | undefined => {
  const currentIndex = onboardingSteps.findIndex(step => step.id === currentStepId);
  return currentIndex >= 0 && currentIndex < onboardingSteps.length - 1 
    ? onboardingSteps[currentIndex + 1] 
    : undefined;
};

export const getPreviousStep = (currentStepId: string): OnboardingStep | undefined => {
  const currentIndex = onboardingSteps.findIndex(step => step.id === currentStepId);
  return currentIndex > 0 
    ? onboardingSteps[currentIndex - 1] 
    : undefined;
};

export const getContextualActions = (userContext: { currentPage?: string } | null) => {
  if (!userContext?.currentPage) return [];
  
  const currentStep = onboardingSteps.find(step => 
    step.targetPage === userContext.currentPage
  );
  
  return currentStep?.actions || [];
};