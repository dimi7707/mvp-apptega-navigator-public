(function(window, document) {
  'use strict';

  class ApptegarNavigator {
    constructor() {
      this.config = {
        baseUrl: 'https://navigator.apptega.com/',
        width: '400',
        height: '600',
        position: 'right',
        theme: 'light'
      };
      
      this.iframe = null;
      this.container = null;
      this.isInitialized = false;
    }

    init(options = {}) {
      if (this.isInitialized) {
        console.warn('Apptega Navigator is already initialized');
        return;
      }

      // Merge user options with defaults
      this.config = Object.assign({}, this.config, options);
      
      // Find or create container
      if (options.container) {
        this.container = typeof options.container === 'string' 
          ? document.querySelector(options.container)
          : options.container;
      } else {
        this.container = this.createDefaultContainer();
      }

      if (!this.container) {
        console.error('Navigator container not found');
        return;
      }

      // Create and configure iframe
      this.createIframe();
      this.setupMessageListener();
      this.isInitialized = true;

      console.log('Apptega Navigator initialized successfully');
    }

    createDefaultContainer() {
      const container = document.createElement('div');
      container.id = 'apptega-navigator-default';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        ${this.config.position}: 20px;
        width: ${this.config.width}px;
        height: ${this.config.height}px;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      `;
      
      document.body.appendChild(container);
      return container;
    }

    createIframe() {
      this.iframe = document.createElement('iframe');
      this.iframe.src = this.buildIframeUrl();
      this.iframe.width = '100%';
      this.iframe.height = '100%';
      this.iframe.frameBorder = '0';
      this.iframe.allow = 'web-share';
      this.iframe.title = 'Apptega Navigator';
      
      // Apply responsive styles
      this.iframe.style.cssText = `
        border: none;
        border-radius: 8px;
        background: white;
      `;

      this.container.appendChild(this.iframe);
    }

    buildIframeUrl() {
      const params = new URLSearchParams();
      
      if (this.config.userId) params.set('userId', this.config.userId);
      if (this.config.organizationId) params.set('organizationId', this.config.organizationId);
      if (this.config.userRole) params.set('userRole', this.config.userRole);
      if (this.config.theme) params.set('theme', this.config.theme);
      
      const queryString = params.toString();
      return this.config.baseUrl + (queryString ? '?' + queryString : '');
    }

    setupMessageListener() {
      window.addEventListener('message', (event) => {
        if (event.origin !== this.getOrigin(this.config.baseUrl)) {
          return;
        }

        this.handleNavigatorMessage(event.data);
      });
    }

    getOrigin(url) {
      const link = document.createElement('a');
      link.href = url;
      return link.origin;
    }

    handleNavigatorMessage(data) {
      if (!data || !data.type) return;

      switch (data.type) {
        case 'navigator_action':
          this.handleAction(data.action, data.data);
          break;
        case 'step_completed':
          this.handleStepCompleted(data.data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    }

    handleAction(action, actionData) {
      switch (action) {
        case 'navigate':
          if (actionData && actionData.path) {
            this.navigateToPath(actionData.path);
          }
          break;
        case 'start_tour':
          this.startApplicationTour();
          break;
        case 'request_context':
          this.sendContextToWidget();
          break;
        case 'help':
          this.openHelpCenter();
          break;
        default:
          // Trigger custom event for unknown actions
          this.triggerCustomEvent('navigatorAction', {
            action: action,
            data: actionData
          });
      }
    }

    handleStepCompleted(data) {
      if (data && data.stepId) {
        this.updateUserProgress(data.stepId);
        this.triggerCustomEvent('stepCompleted', data);
      }
    }

    navigateToPath(path) {
      // This would integrate with the host application's routing
      if (typeof this.config.onNavigate === 'function') {
        this.config.onNavigate(path);
      } else {
        // Fallback: try to update current URL
        const baseUrl = window.location.origin;
        window.location.href = baseUrl + path;
      }
    }

    startApplicationTour() {
      if (typeof this.config.onStartTour === 'function') {
        this.config.onStartTour();
      } else {
        console.log('Application tour requested, but no tour handler configured');
      }
    }

    openHelpCenter() {
      if (typeof this.config.onHelp === 'function') {
        this.config.onHelp();
      } else {
        window.open('https://help.apptega.com', '_blank');
      }
    }

    sendContextToWidget() {
      const context = this.getCurrentContext();
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage({
          type: 'context_update',
          context: context
        }, this.getOrigin(this.config.baseUrl));
      }
    }

    getCurrentContext() {
      // This would be customized based on the host application
      const defaultContext = {
        userId: this.config.userId || 'demo_user',
        organizationId: this.config.organizationId || 'demo_org',
        userRole: this.config.userRole || 'organization_user',
        currentPage: this.detectCurrentPage(),
        completedSteps: this.getCompletedSteps(),
        availableModules: ['assessments', 'risks', 'tasks', 'documents', 'dashboard']
      };

      if (typeof this.config.getContext === 'function') {
        return Object.assign(defaultContext, this.config.getContext());
      }

      return defaultContext;
    }

    detectCurrentPage() {
      const path = window.location.pathname;
      
      if (path.includes('assessment')) return 'assessments';
      if (path.includes('risk')) return 'risks';
      if (path.includes('task')) return 'tasks';
      if (path.includes('document')) return 'documents';
      if (path.includes('dashboard')) return 'dashboard';
      
      return 'dashboard';
    }

    getCompletedSteps() {
      // Try to get from localStorage or return demo data
      const stored = localStorage.getItem('apptega_navigator_progress');
      return stored ? JSON.parse(stored) : [];
    }

    updateUserProgress(stepId) {
      const completed = this.getCompletedSteps();
      if (!completed.includes(stepId)) {
        completed.push(stepId);
        localStorage.setItem('apptega_navigator_progress', JSON.stringify(completed));
      }
    }

    triggerCustomEvent(eventName, data) {
      const event = new CustomEvent('AppregaNavigator:' + eventName, {
        detail: data
      });
      window.dispatchEvent(event);
    }

    show() {
      if (this.container) {
        this.container.style.display = 'block';
      }
    }

    hide() {
      if (this.container) {
        this.container.style.display = 'none';
      }
    }

    destroy() {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.isInitialized = false;
    }

    updateConfig(newConfig) {
      this.config = Object.assign(this.config, newConfig);
      if (this.iframe) {
        this.iframe.src = this.buildIframeUrl();
      }
    }
  }

  // Create global instance
  window.AppregaNavigator = new ApptegarNavigator();

  // Auto-initialization if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const autoInitElements = document.querySelectorAll('[data-apptega-navigator]');
    
    autoInitElements.forEach(function(element) {
      const config = {
        container: element,
        width: element.getAttribute('data-width') || '400',
        height: element.getAttribute('data-height') || '600',
        userId: element.getAttribute('data-user-id'),
        organizationId: element.getAttribute('data-organization-id'),
        userRole: element.getAttribute('data-user-role'),
        theme: element.getAttribute('data-theme') || 'light'
      };
      
      window.AppregaNavigator.init(config);
    });
  });

})(window, document);