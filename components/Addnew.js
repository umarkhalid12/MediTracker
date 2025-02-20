import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Medicationform from './Medicationform';

const Addnew = () => {
    const navigation= useNavigation();
  return (
    <ScrollView>
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={require('../assets/consult.png')} style={styles.image} />
        <TouchableOpacity style={styles.iconContainer} onPress={()=> navigation.navigate('Main')}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Medicationform/>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',  
    marginTop: 30,
  },
  image: {
    height: 200,
    width: 370,
  },
  iconContainer: {
    position: 'absolute',  
    top: 10,  
    left: 10,  
    zIndex: 1,  
  },
});

export default Addnew;
