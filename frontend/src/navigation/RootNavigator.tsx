import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/Tasks/TaskListScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={TaskListScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;