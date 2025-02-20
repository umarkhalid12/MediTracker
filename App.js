import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useRef } from 'react';
import Home from './tabs/Home';
import Add from './tabs/Add';
import Profile from './tabs/Profile';
import Login from './tabs/Login';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loginmain from './tabs/Loginmain';
import Signup from './tabs/Signup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FirebaseConfig';
import Addnew from './components/Addnew';
import Empty from './components/Empty';
import Medicationform from './components/Medicationform';
import Medicationaction from './components/Medicationaction';
import MedicationsList from './components/MedicationsList';
import History from './tabs/Add';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={"#fe696e"} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={"#fe696e"} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={"#fe696e"} size={24} />
          ),
        }}

      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading state
  const navigationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    // Optionally, show a loading spinner or splash screen while checking auth state
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={"Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Loginmain" component={Loginmain} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="History" component={History}/>
        <Stack.Screen name="Empty" component={Empty}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Medicationform" component={Medicationform}/>
        <Stack.Screen name="Medicationlist" component={MedicationsList}/>
        <Stack.Screen name="Medicationaction" component={Medicationaction}
        options={{
          presentation:'modal'
        }}/>

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
