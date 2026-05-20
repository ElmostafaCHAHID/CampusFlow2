import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WriteReportScreen from '../screens/WriteReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Nice fallback icon logic for web if vector icons fail
const TabIcon = ({ name, color, size }) => {
  try {
    return <Ionicons name={name} size={size} color={color} />;
  } catch (e) {
    return <Text style={{ fontSize: 20, color }}>●</Text>;
  }
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeList" component={HomeScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
  </Stack.Navigator>
);

const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Write') iconName = 'add-circle-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';
        return <TabIcon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: '#94a3b8',
      headerShown: false,
      tabBarStyle: { 
        height: 60, 
        paddingBottom: 10, 
        paddingTop: 6,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Feed' }} />
    <Tab.Screen name="Write" component={WriteReportScreen} options={{ title: 'Create' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTab} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
