import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Empty from '../components/Empty'
import MedicationsList from '../components/MedicationsList';
import { ScrollView } from 'react-native';
export default function Home() {
  return (
    <SafeAreaView>
   <ScrollView>
      <Header/>
    
       <MedicationsList/>
   </ScrollView>
    </SafeAreaView>
  
  );
}