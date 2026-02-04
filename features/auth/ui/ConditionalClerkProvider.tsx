'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';

interface ConditionalClerkProviderProps {
  children: ReactNode;
}

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: '#18181b',
    colorInputBackground: '#27272a',
    colorInputText: '#fafafa',
    colorPrimary: '#3b82f6',
    colorText: '#fafafa',
    colorTextSecondary: '#a1a1aa',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    borderRadius: '0.5rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  elements: {
    card: {
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    },
    headerTitle: {
      color: '#fafafa',
    },
    headerSubtitle: {
      color: '#a1a1aa',
    },
    socialButtonsBlockButton: {
      backgroundColor: '#27272a',
      border: '1px solid #3f3f46',
      '&:hover': {
        backgroundColor: '#3f3f46',
      },
    },
    formButtonPrimary: {
      backgroundColor: '#3b82f6',
      '&:hover': {
        backgroundColor: '#2563eb',
      },
    },
    formFieldInput: {
      backgroundColor: '#27272a',
      border: '1px solid #3f3f46',
      '&:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 1px #3b82f6',
      },
    },
    footerActionLink: {
      color: '#3b82f6',
      '&:hover': {
        color: '#60a5fa',
      },
    },
    userButtonPopoverCard: {
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
    },
    userButtonPopoverActionButton: {
      '&:hover': {
        backgroundColor: '#27272a',
      },
    },
    userPreviewMainIdentifier: {
      color: '#fafafa',
    },
    userPreviewSecondaryIdentifier: {
      color: '#a1a1aa',
    },
    avatarBox: {
      border: '2px solid #3f3f46',
    },
  },
};

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Check if we have a valid Clerk key (not placeholder)
  const hasValidKey = publishableKey &&
    publishableKey !== 'pk_test_placeholder' &&
    publishableKey.startsWith('pk_');

  if (!hasValidKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider appearance={clerkAppearance}>
      {children}
    </ClerkProvider>
  );
}
