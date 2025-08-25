import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

// ✅ Define Task type
type Task = {
  id: string;
  title: string;
  // Add other fields as needed
};

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('tasks')
      .where('userId', '==', user.uid)
      .onSnapshot(
        snapshot => {
          const updatedTasks: Task[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Task, 'id'>),
          }));
          setTasks(updatedTasks);
          setLoading(false);
          setError(null);
        },
        err => {
          console.error('Snapshot listener failed:', err);
          setError('Real-time updates unavailable. Showing static data.');
          fallbackFetch(user.uid);
        }
      );

    return () => unsubscribe(); // ✅ Cleanup on unmount
  }, [user]);

  const fallbackFetch = async (userId: string) => {
    try {
      const snapshot = await firestore()
        .collection('tasks')
        .where('userId', '==', userId)
        .get();

      const staticTasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }));
      setTasks(staticTasks);
    } catch (err) {
      console.error('Fallback fetch failed:', err);
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to LOOPY!</Text>
        <Text style={styles.subtitle}>
          {user?.isAnonymous ? 'Guest User' : user?.displayName || user?.email}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Tasks</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#999" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : tasks.length === 0 ? (
          <View style={styles.placeholder}>
            <LottieView
              source={require('../../assets/empty-tasks.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.placeholderText}>No tasks yet. Add one!</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={renderTask}
          />
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#ff5252',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
