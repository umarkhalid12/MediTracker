import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Typelist, WhenToTake } from './Options'; 
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Home from '../tabs/Home';



import { getAuth } from 'firebase/auth'; 

const useAuth = () => {
  const auth = getAuth(); // Get Firebase authentication instance
  return { user: auth.currentUser }; // Fetch the current logged-in user
};


const formatDate = (dateString) => {
  return format(new Date(dateString), 'mm/dd/yyyy');
};


const formatTime = (dateString) => {
  return format(new Date(dateString), 'hh:mm a');
};
const getDatesRange=(startDate, endDate)=>{
  const start=moment(new Date(startDate),'MM/DD/YYYY');
  const end=moment(new Date(endDate),'MM/DD/YYYY');
  const dates=[];
  while(start.isSameOrBefore(end)){
    dates.push(start.format('MM/DD/YYYY'));
    start.add(1, 'days')
  }
  return dates;
}

const Medicationform = () => {
  const navigation=useNavigation();
  const [formData, setFormData] = useState({});
  const [selectedTime, setSelectedTime] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [selectedReminderTime, setSelectedReminderTime] = useState(new Date());
  const [loading, setloading] = useState(false); // loading state

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const convertToTimestamp = (date) => {
    return date ? new Date(date).getTime() : null;
  };

  const savemedications = async () => {
    const { user } = useAuth();
    const docId = Date.now().toString();
    if (!(formData?.name && formData?.type && formData?.dose && formData?.startDate && formData?.endDate && formData?.reminder)) {
      Alert.alert('Fill All Fields');
      return;
    }
    const dates=getDatesRange(formData?.startDate, formData.endDate);
    console.log(dates);
    setloading(true); // Start loading
    try {
      await setDoc(doc(db, 'medication', docId), {
        ...formData,
        startDate: convertToTimestamp(formData?.startDate),
        endDate: convertToTimestamp(formData?.endDate),
        reminder: convertToTimestamp(formData?.reminder),
        userEmail: user?.email,
        docId: docId,
        dates:dates
      });
      console.log('Data saved:', { ...formData, userEmail: user?.email, docId: docId });
      setloading(false); // Stop loading after successful saving
      Alert.alert('Medication Added Successfully', '', [
        {
          text: 'Ok',
          onPress: () => {
            navigation.navigate('Home');  
          },
        },
      ]);
    } catch (e) {
      setloading(false); // Stop loading on error
      console.log(e);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Medication</Text>

      {/* Medicine Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Medicine Name"
          placeholderTextColor="#888"
          onChangeText={(value) => onHandleInputChange('name', value)}
        />
        <FontAwesome5 name="first-aid" size={24} color="#fe696e" style={styles.icon} />
      </View>

      {/* Type Selection */}
      <FlatList
        style={styles.flatlist}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={Typelist}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: item.name === formData?.type?.name ? '#fe696e' : 'white' }]}
            onPress={() => onHandleInputChange('type', item)}
          >
            <Text
              style={[styles.itemText, { color: item.name === formData?.type?.name ? 'white' : 'gray' }]}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Dose Input */}
      <View style={styles.inputContainer1}>
        <TextInput
          style={styles.textInput}
          placeholder="Dose eg 2 or 5ml"
          placeholderTextColor="#888"
          keyboardType="numeric"
          onChangeText={(value) => onHandleInputChange('dose', value)}
        />
        <FontAwesome name="eyedropper" size={24} color="#fe696e" style={styles.icon} />
      </View>

      {/* Time to Take Picker */}
      <View style={styles.inputContainer1}>
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          placeholder="Time to Take"
          placeholderTextColor="#888"
          value={selectedTime}
          editable={false}
        />
        <Picker
          selectedValue={selectedTime}
          style={[styles.pickerStyle, { width: '30%' }]}
          onValueChange={(itemValue) => {
            setSelectedTime(itemValue);
            onHandleInputChange('time', itemValue);
          }}
        >
          <Picker.Item label="Select Time" value="" />
          {WhenToTake.map((time, index) => (
            <Picker.Item key={index} label={time} value={time} />
          ))}
        </Picker>
        <Entypo name="back-in-time" size={24} color="#fe696e" style={styles.icon} />
      </View>

      {/* Date Pickers */}
      <View style={styles.date}>
        {/* Start Date */}
        <View style={[styles.inputContainer5, { flex: 1 }]}>
          <Entypo name="calendar" size={24} color="#fe696e" style={styles.icon} />
          <Text style={styles.text1} onPress={() => setShowStartDatePicker(true)}>
            {formData?.startDate ? formatDate(formData.startDate) : 'Start Date'}
          </Text>
          {showStartDatePicker && (
            <DateTimePicker
              value={formData?.startDate ? new Date(formData.startDate) : new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                if (date) onHandleInputChange('startDate', date.toISOString());
              }}
            />
          )}
        </View>

        {/* End Date */}
        <View style={[styles.inputContainer5, { flex: 1 }]}>
          <Entypo name="calendar" size={24} color="#fe696e" style={styles.icon} />
          <Text style={styles.text1} onPress={() => setShowEndDatePicker(true)}>
            {formData?.endDate ? formatDate(formData.endDate) : 'End Date'}
          </Text>
          {showEndDatePicker && (
            <DateTimePicker
              value={formData?.endDate ? new Date(formData.endDate) : new Date()}
              mode="date"
              display="default"
              minimumDate={formData?.startDate ? new Date(formData.startDate) : new Date()}
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                if (date) onHandleInputChange('endDate', date.toISOString());
              }}
            />
          )}
        </View>
      </View>

      {/* Set Reminder */}
      <View style={styles.inputContainer5}>
        <Ionicons name="alarm" size={24} color="#fe696e" style={styles.icon} />
        <Text style={styles.text1} onPress={() => setShowReminderPicker(true)}>
          {formData?.reminder ? formatTime(formData.reminder) : 'Set Reminder'}
        </Text>
        {showReminderPicker && (
          <DateTimePicker
            value={selectedReminderTime}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowReminderPicker(false);
              if (time) {
                setSelectedReminderTime(time);
                onHandleInputChange('reminder', time.toISOString());
              }
            }}
          />
        )}
      </View>

      <View style={styles.button}>
        <TouchableOpacity style={styles.button1} onPress={savemedications}>
          {loading ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={{ color: 'white', fontSize: 16 }}>+Add New Medication</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop:50
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 7,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  text1: {
    fontSize: 16,
    flex: 1,
    marginLeft: 27,
    color: 'gray',
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 14,
    backgroundColor: 'white',
  },
  inputContainer5: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 13,
    marginTop: 14,
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  textInput: {
    flex: 100,
    paddingLeft: 35,
    height: 40,
    fontSize: 16,
    borderBottomColor: '#ccc',
    color: 'gray',
  },
  pickerStyle: {
    height: 40,
    marginLeft: 10,
    borderBottomColor: '#ccc',
  },
  flatlist: {
    marginTop: 15,
  },
  itemContainer: {
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 28,
  },
  button1: {
    backgroundColor: '#fe696e',
    paddingVertical: 14,
    width: 245,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Medicationform;
