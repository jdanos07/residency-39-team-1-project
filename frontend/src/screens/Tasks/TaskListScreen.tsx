import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable, TextInput } from 'react-native';
import { useTasks } from '../../contexts/TaskContext';
import { TaskItem } from '../../components/tasks/TaskItem';

const TaskListScreen: React.FC = () => {
  const { tasks, isLoading, error, refresh, addTask, deleteTask } = useTasks();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = useCallback(async () => {
    if (!title.trim()) return;
    await addTask(title.trim(), { notes, state: 'Exploring' });
    setTitle(''); setNotes('');
  }, [title, notes, addTask]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f6f7fb' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Tasks</Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <TextInput placeholder="Task title" value={title} onChangeText={setTitle} style={{ padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 }} />
        <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes} style={{ padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }} />
        <Pressable onPress={handleAdd} style={{ marginTop: 10, padding: 12, backgroundColor: '#4c6fff', borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Add Task</Text>
        </Pressable>
      </View>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <TaskItem task={item} onDelete={deleteTask} />
        )}
      />
    </View>
  );
};

export default TaskListScreen;