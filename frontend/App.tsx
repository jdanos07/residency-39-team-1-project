// App.tsx
import React from 'react';
import './src/config/firebase'; // Ensure Firebase is initialized
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { ActivityIndicator, View } from 'react-native';

// Main app component that shows different screens based on auth state
function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  // Show LoginScreen if not authenticated, HomeScreen if authenticated
  return user ? <HomeScreen /> : <LoginScreen />;
}

// Root component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
