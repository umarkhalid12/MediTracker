import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { StackRouter } from '@react-navigation/native';

const Loginmain = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text.includes('@') || !text.includes('.')) {
      setEmailError('Please enter a valid email with "@" and a domain (e.g., .com)');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length < 5) {
      setPasswordError('Password must be at least 5 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleNameChange = (text) => {
    setName(text);
    if (text.trim().length === 0) {
      setNameError('Name cannot be empty');
    } else {
      setNameError('');
    }
  };

  const onCreateAccount = () => {
    if (!name) {
      setNameError('Name cannot be empty');
    }
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email with "@" and a domain (e.g., .com)');
    }
    if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters');
    }

    if (name && email && password && !emailError && !passwordError && !nameError) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          
          ToastAndroid.show('Account Created Successfully!', ToastAndroid.BOTTOM);
          navigation.navigate('Main');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);

          if (errorCode === 'auth/email-already-in-use') {
            ToastAndroid.show('Email Already Exists', ToastAndroid.BOTTOM);
          } else {
            ToastAndroid.show('Error: ' + errorMessage, ToastAndroid.BOTTOM);
          }
        });
    } else {
      ToastAndroid.show('Fill All Fields', ToastAndroid.BOTTOM);
    }
  };

  return (
    <View style={styles.container6}>
      <Text style={styles.text1}>Create New Account</Text>
      <View style={styles.container5}>
        <View style={styles.textInputContainer}>
          <FontAwesome name="user" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={handleNameChange}
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
            onChangeText={handlePasswordChange}
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={styles.buttoncontainer}>
          <TouchableOpacity style={styles.Button} onPress={onCreateAccount}>
            <Text style={{ color: 'white', fontSize: 17 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={{ top: 350, alignItems: 'center', justifyContent: 'center', right: 19, flexDirection: 'row' }}>
          <Text>Already Have An Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Loginmain')}>
            <Text style={{ color: '#fe696e' }}>SignIn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container5: {
    justifyContent: 'center',
    top: 55,
    left: 23,
  },
  container6: {
    justifyContent: 'center',
    top: 15,
  },
  text1: {
    fontSize: 26,
    fontWeight: '600',
    marginTop: 40,
    left: 23,
  },
  textInputContainer: {
    width: 310,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  textInputContainer1: {
    width: 310,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    height: 50,
    width: '90%',
    fontSize: 15,
    paddingLeft: 40,
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10,
  },
  Button: {
    backgroundColor: '#fe696e',
    height: 45,
    width: 305,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttoncontainer: {
    top: 45,
    alignItems: 'center',
    right: 26,
  },
});

export default Loginmain;
