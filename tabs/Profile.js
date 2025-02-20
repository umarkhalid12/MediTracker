import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../FirebaseConfig'; // Correctly import auth
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation(); // Initialize navigation

  const user = auth.currentUser; // Access current user from auth

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert(
          'Logged Out',
          'You have been logged out successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login'); 
                console.log('User logged out and redirected to Login screen');
              },
            },
          ]
        );
      })
      .catch((error) => {
        Alert.alert('Logout Failed', error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={{flexDirection:'row', alignItems:'center', gap: 10}}> 
        <Text style={styles.title}>Profile</Text>
        <Image source={require('../assets/profile.png')} style={{height:30, width: 30, bottom: 10}}/>
        </View>

        {/* Display User Email */}
        {user ? (
          <Text style={styles.email}> {user.email}</Text>
        ) : (
          <Text style={styles.email}>No user logged in</Text>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#fe696e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
