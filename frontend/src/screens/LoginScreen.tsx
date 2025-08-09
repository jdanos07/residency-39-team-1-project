// src/screens/LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle, signInAsGuest, isLoading, error } = useAuth();
  const [localLoading, setLocalLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    console.log('Login button pressed - starting Google sign-in');
    setLocalLoading(true);
    try {
      await signInWithGoogle();
      console.log('Google sign-in completed');
    } catch (err) {
      console.error('Error in handleGoogleSignIn:', err);
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    console.log('Guest sign-in button pressed');
    setLocalLoading(true);
    try {
      await signInAsGuest();
      console.log('Guest sign-in completed');
    } catch (err) {
      console.error('Error in handleGuestSignIn:', err);
      Alert.alert('Sign In Failed', 'Unable to sign in as guest. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>LOOPY</Text>
          <Text style={styles.subtitle}>Neurodivergent-Friendly Productivity</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton, localLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={localLoading}
          >
            {localLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.guestButton, localLoading && styles.disabledButton]}
            onPress={handleGuestSignIn}
            disabled={localLoading}
          >
            {localLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 56,
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  disclaimer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },
});
