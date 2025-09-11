export interface UserContext {
  userId?: string;
  organizationId?: string;
  userRole?: string;
  currentPage?: string;
  completedSteps?: string[];
  availableModules?: string[];
}

export interface NavigatorMessage {
  type: 'navigator_action' | 'context_update' | 'step_completed';
  action?: string;
  data?: unknown;
}

export class AppregaIntegration {
  private static instance: AppregaIntegration;
  private messageHandlers: Map<string, (data: unknown) => void> = new Map();

  static getInstance(): AppregaIntegration {
    if (!AppregaIntegration.instance) {
      AppregaIntegration.instance = new AppregaIntegration();
    }
    return AppregaIntegration.instance;
  }

  private constructor() {
    this.setupMessageListener();
  }

  private setupMessageListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        if (event.origin === '*' || this.isValidOrigin(event.origin)) {
          this.handleMessage(event.data);
        }
      });
    }
  }

  private isValidOrigin(origin: string): boolean {
    const allowedOrigins = [
      'https://app.apptega.com',
      'https://staging.apptega.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    return allowedOrigins.includes(origin);
  }

  private handleMessage(data: unknown) {
    if (typeof data === 'object' && data !== null && 'type' in data) {
      const message = data as { type: string; context?: unknown };
      if (message.type === 'context_update' && message.context) {
        const handler = this.messageHandlers.get('context_update');
        if (handler) {
          handler(message.context);
        }
      }
    }
  }

  public sendMessage(message: NavigatorMessage) {
    console.log("🚀 ~ AppregaIntegration ~ sendMessage ~ message:", message)
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }

  public onContextUpdate(handler: (context: UserContext) => void) {
    this.messageHandlers.set('context_update', (data: unknown) => {
      handler(data as UserContext);
    });
  }

  public sendAction(action: string, data?: unknown) {
    this.sendMessage({
      type: 'navigator_action',
      action,
      data
    });
  }

  public completeStep(stepId: string) {
    this.sendMessage({
      type: 'step_completed',
      data: { stepId }
    });
  }

  public navigateTo(path: string) {
    this.sendAction('navigate', { path });
  }

  public startTour() {
    this.sendAction('start_tour');
  }

  public requestContext() {
    this.sendMessage({
      type: 'navigator_action',
      action: 'request_context'
    });
  }
}

export const getProgressPercentage = (completedSteps: string[], totalSteps: number): number => {
  return Math.round((completedSteps.length / totalSteps) * 100);
};

export const isStepAvailable = (stepId: string, completedSteps: string[], step: { prerequisite?: string }): boolean => {
  if (!step.prerequisite) return true;
  return completedSteps.includes(step.prerequisite);
};

export const getContextualHelp = (currentPage: string, step: { contextualHelp?: Record<string, string> }): string | undefined => {
  return step.contextualHelp?.[currentPage];
};