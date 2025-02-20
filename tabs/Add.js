import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetDateRangeToDisplay } from '../components/Formatdate';  // Assuming this function is correctly imported
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native';

const History = () => {
  const [medList, setMedList] = useState([]);
  const [filteredMedList, setFilteredMedList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));

  // Fetch date range list
  const GetDateRangeList = () => {
    const dateRange = GetDateRangeToDisplay(); // Assuming this returns the date range
    setDateRange(dateRange);
  };

  // Fetch medication list from Firebase
  const GetMedicationList = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (!email) {
      console.log('User email not found');
      return;
    }

    try {
      const q = query(collection(db, 'medication'), where('userEmail', '==', email));
      const querySnapshot = await getDocs(q);
      const medications = [];
      querySnapshot.forEach((doc) => {
        medications.push({ ...doc.data(), id: doc.id });
      });
      setMedList(medications);
    } catch (e) {
      console.log(e);
    }
  };

  // Filter medications based on selected date
  const FilterMedicationsByDate = (selectedDate) => {
    const filtered = medList.filter((medication) =>
      medication.dates?.includes(selectedDate)
    );
    setFilteredMedList(filtered);
  };

  // Check if the medication is taken or missed based on medicationList.js data
  const CheckStatus = (medication, selectedDate) => {
    // Assuming 'medication.action' contains an array with date and status (taken/missed)
    const actionForDate = medication.action?.find((action) => action.date === selectedDate);

    if (actionForDate) {
      return actionForDate.status === 'taken' ? 'taken' : 'missed';
    }
    return 'missed'; // Default to missed if no status for the selected date
  };

  useEffect(() => {
    GetDateRangeList();
    GetMedicationList();
  }, []);

  useEffect(() => {
    FilterMedicationsByDate(selectedDate);
  }, [selectedDate, medList]);

  return (
    <ScrollView>
      <Image 
        source={require('../assets/history.png')} 
        style={styles.image} 
      />
      <Text style={styles.header}>Medication History</Text>

      {/* Date selection */}
      <FlatList
        style={{ padding: 12 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={dateRange}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.container, { backgroundColor: item?.formatedDate === selectedDate ? '#fe696e' : 'white' }]}
            onPress={() => setSelectedDate(item.formatedDate)}
          >
            <Text style={[styles.day, { color: item?.formatedDate === selectedDate ? 'white' : 'black' }]}>{item?.day}</Text>
            <Text style={[styles.date, { color: item?.formatedDate === selectedDate ? 'white' : 'black' }]}>{item?.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Medication cards */}
      {filteredMedList.length > 0 ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ padding: 12 }}
          data={filteredMedList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.medicationContainer}
              onPress={() => {/* Navigate to the medication detail page */}}
            >
              <Image source={{ uri: item.type?.icon }} style={styles.medicationIcon} />
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationName}>{item.name}</Text>
                <Text style={styles.medicationDose}>Dose: {item.dose}</Text>
                <Text style={styles.medicationTime}>Time: {item.time}</Text>
              </View>

              <MaterialCommunityIcons name="timer-outline" size={22} color="black" style={{ marginRight: 3 }} />
              <Text style={styles.reminderTime}>{moment(item.reminder).format('h:mm A')}</Text>

              {/* Status: Tick if taken, Cross if missed */}
              <View style={styles.insidecontainer}>
                {CheckStatus(item, selectedDate) === 'taken' ? (
                  <AntDesign name="checkcircle" size={16} color="green" />
                ) : (
                  <AntDesign name="closecircle" size={16} color="red" />
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noMedicationsText}>No medications added yet for this date.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: '100%',
    marginTop: 30,
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5,
  },
  container: {
    paddingLeft: 6,
    paddingTop: 5,
    paddingBottom: 20,
    paddingRight: 7,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 18,
    fontWeight: '400',
  },
  medicationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicationDose: {
    fontSize: 16,
    color: 'gray',
  },
  medicationTime: {
    fontSize: 16,
    color: 'gray',
  },
  reminderTime: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 'auto',
  },
  insidecontainer: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  noMedicationsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default History;
