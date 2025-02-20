import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>Medi Tracker</Text>
        <Text style={styles.text2}>Your Health, Always in Check</Text>
      </View>
      <Image style={styles.image} source={require('../assets/main.png')} />
      <View style={styles.container4}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Loginmain')}>
          <Text style={styles.textinput}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 126,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  image: {
    height: 310,
    width: 310,
  },
  text1: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'verdana',
  },
  textinput: {
    color: 'black',
    fontSize: 18,
  },
  text2: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: 'white',
    height: 50,
    width: 190,
    borderRadius: 10,
    borderColor: '#fe696e',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container4: {
    top: 145,
  },
});

export default Login;
