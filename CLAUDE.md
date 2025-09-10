# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based widget for the Apptega platform that provides guided onboarding navigation. The widget is designed to be embedded as an iframe in the main Apptega application and communicates with the parent window through postMessage API.

## Development Commands

```bash
# Start development server with turbopack
npm run dev

# Build for production (static export)
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Core Components Structure

- **NavigatorWidget** (`src/components/NavigatorWidget.tsx`): Main widget component that orchestrates the entire onboarding flow
- **ProgressTracker** (`src/components/ProgressTracker.tsx`): Displays progress through onboarding steps
- **StepGuide** (`src/components/StepGuide.tsx`): Shows current step content and actions
- **QuickActions** (`src/components/QuickActions.tsx`): Context-aware action buttons

### Data Layer

- **stepData.ts** (`src/utils/stepData.ts`): Defines the onboarding flow with 6 sequential steps (welcome → first_assessment → document_upload → risk_identification → task_management → dashboard_overview)
- **integrationHelpers.ts** (`src/utils/integrationHelpers.ts`): Contains AppregaIntegration singleton for parent-child window communication

### Integration Architecture

The widget operates as an embedded component using:
- **PostMessage Communication**: Bidirectional messaging with parent Apptega application
- **Context Synchronization**: Receives user context and page state from parent
- **Action Delegation**: Sends navigation and action requests back to parent

Allowed parent origins: `app.apptega.com`, `staging.apptega.com`, `localhost:3000/3001`

### State Management

The NavigatorWidget maintains:
- Current step index and completion tracking
- User context from parent application
- Widget minimization state
- Auto-advancement based on completed steps

### Build Configuration

- **Static Export**: Configured for production deployment as static files
- **Base Path**: Uses `/navigator` prefix in production
- **Asset Optimization**: Images unoptimized for static export compatibility

## Key Patterns

- Sequential onboarding flow with prerequisite checking
- Context-aware help and actions based on current page
- Responsive design with minimize/maximize functionality
- TypeScript interfaces for all data structures
- Singleton pattern for integration management