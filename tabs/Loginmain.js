import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastAndroid } from 'react-native';
import { saveEmail } from '../tabs/Localstorage';

const Loginmain = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text.includes('@')) {
      setEmailError('Please enter a valid email with "@"');
    } else {
      setEmailError('');
    }
  };

  const onsignin = () => {
    if (!email.includes('@')) {
      ToastAndroid.show('Invalid Email! Ensure it contains "@"', ToastAndroid.BOTTOM);
      return;
    }
    if (!email || !password) {
      ToastAndroid.show('Fill All Details!', ToastAndroid.BOTTOM);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        // Save the email to local storage
        saveEmail(email);

        navigation.navigate('Main');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-email') {
          ToastAndroid.show('Invalid Email Format!', ToastAndroid.BOTTOM);
        } else if (errorCode === 'auth/user-not-found') {
          ToastAndroid.show('No user found with this email!', ToastAndroid.BOTTOM);
        } else if (errorCode === 'auth/wrong-password') {
          ToastAndroid.show('Incorrect Password!', ToastAndroid.BOTTOM);
        } else {
          ToastAndroid.show('Incorrect Email or Password!', ToastAndroid.BOTTOM);
        }
      });
  };

  return (
    <View style={styles.container5}>
      <Text style={styles.text}>Let's Sign You In</Text>
      <Text style={{ paddingTop: 10 }}>Welcome Back!</Text>

      <View style={styles.textInputContainer}>
        <FontAwesome name="envelope" size={24} color="#666" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={handleEmailChange}
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.textInputContainer1}>
        <FontAwesome name="lock" size={24} color="#666" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Password"
          placeholderTextColor="#666"
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
      </View>

      <View style={styles.buttoncontainer}>
        <TouchableOpacity style={styles.Button} onPress={onsignin}>
          <Text style={{ color: 'white', fontSize: 17 }}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttoncontainer1}>
        <TouchableOpacity style={styles.Button1} onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#fe696e', fontSize: 17 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container5: {
    justifyContent: 'center',
    top: 45,
    left: 23,
  },
  text: {
    fontSize: 40,
    fontWeight: '600',
    marginTop: 10,
  },
  textInputContainer: {
    width: 310,
    marginTop: 170,
    flexDirection: 'row', // Align icon and input field horizontally
    alignItems: 'center', // Align items vertically in the center
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  textInputContainer1: {
    width: 310,
    marginTop: 8,
    flexDirection: 'row', // Align icon and input field horizontally
    alignItems: 'center', // Align items vertically in the center
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    height: 50,
    width: '90%', // Reduce width to leave space for the icon
    fontSize: 15,
    paddingLeft: 40, // Add padding to avoid overlap with the icon
  },
  icon: {
    position: 'absolute', // Position icon inside the TextInput container
    left: 10, // Align the icon to the left side of the container
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10, // Increase margin to separate the error text from the input field
  },
  Button: {
    backgroundColor: '#fe696e',
    height: 45,
    width: 305,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button1: {
    backgroundColor: 'white',
    height: 45,
    width: 305,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fe696e',
  },
  buttoncontainer: {
    top: 45,
    alignItems: 'center',
    right: 26,
  },
  buttoncontainer1: {
    padding: 60,
    alignItems: 'center',
    right: 26,
  },
});



export default Loginmain;
