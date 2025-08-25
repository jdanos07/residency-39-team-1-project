import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Task } from '../../types/task';

export const TaskItem: React.FC<{ task: Task; onDelete?: (id: string) => void }> = ({ task, onDelete }) => {
  return (
    <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 12, marginVertical: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{task.title}</Text>
      {!!task.notes && <Text style={{ marginTop: 6, color: '#555' }}>{task.notes}</Text>}
      <Text style={{ marginTop: 6, fontSize: 12, color: '#888' }}>State: {task.state}</Text>
      {onDelete && (
        <Pressable onPress={() => onDelete(task.id)} style={{ marginTop: 8, padding: 8, backgroundColor: '#fee', borderRadius: 8, alignSelf: 'flex-start' }}>
          <Text style={{ color: '#b00' }}>Delete</Text>
        </Pressable>
      )}
    </View>
  );
};