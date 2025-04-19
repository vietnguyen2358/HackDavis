"use client"

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

// Define types for our state
type User = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

type AppState = {
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    read: boolean;
    timestamp: string;
  }>;
};

// Define action types
type Action = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { id: string; message: string; timestamp: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isDarkMode: false,
  sidebarOpen: true,
  notifications: [],
};

// Create context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            id: action.payload.id,
            message: action.payload.message,
            read: false,
            timestamp: action.payload.timestamp,
          },
          ...state.notifications,
        ],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}

// Context provider
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to use the app state
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
} 