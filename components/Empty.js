import { View, Image, StyleSheet,Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Medicationform from './Medicationform';
const Empty = () => {
  const navigation=useNavigation();
  return (
    
    <View style={{alignItems:'center'}}>
    <View style={styles.container}>
      <Image source={require('../assets/medicine.png')} style={styles.image} />
      <Text style={{fontSize:20, fontWeight:'bold', marginTop: 20}}>
        No Medications!
      </Text>
      <Text style={{alignItems:'center', fontWeight:'400', marginTop:5}}>
        You have 0 Medications. Please setup new one.
      </Text>
      <TouchableOpacity style={{backgroundColor:'#fe696e', borderRadius:10, padding: 15, marginTop: 15, }} onPress={()=> navigation.navigate('Medicationform')}>
        <Text style={{color:'white'}}>+Add Medication</Text>
      </TouchableOpacity>
</View>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 180 
  },
  image: {
    marginLeft:20,
    marginTop:40,
    height: 200,
    width: 200,
  },
});

export default Empty;
