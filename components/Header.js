import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation=useNavigation();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Extract the email name (before @) if displayName is not available
        const emailName = user.email ? user.email.split('@')[0] : 'Anonymous';
        setDisplayName(user.displayName || emailName);
      } else {
        setDisplayName('');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    
    <View style={styles.container}>
      {displayName ? (
        <Text style={styles.text}>Welcome, {displayName}!</Text>
      ) : (
        <Text style={styles.text}>Welcome!</Text>
      )}
      <Image source={require('../assets/waving.png')} 
      style={{height: 34,
        width:34,
        marginLeft:10,
        alignItems:'center'
      }}/>
      <TouchableOpacity onPress={()=>navigation.navigate('Empty')}>
      <FontAwesome5 name="briefcase-medical" size={24} color="black"  style={{marginLeft:100}}/>
      </TouchableOpacity>
      </View>
     
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 8,
    margin: 8,
    flexDirection:'row'
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;
