import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetDateRangeToDisplay } from '../components/Formatdate';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const MedicationsList = () => {
    const [medList, setmedList] = useState([]);
    const [filteredMedList, setFilteredMedList] = useState([]);
    const [dateRange, setdateRange] = useState([]);
    const [selectedDate, setselectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [status, setstatus] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        GetDateRangeList();
        GetMedicationList();
    }, []);

    useEffect(() => {
        FilterMedicationsByDate(selectedDate);
        CheckStatus();  // Call CheckStatus whenever selectedDate or medList changes
    }, [selectedDate, medList]);

    const GetDateRangeList = () => {
        const dateRange = GetDateRangeToDisplay();
        setdateRange(dateRange);
    };

    const GetMedicationList = async () => {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) {
            console.log('User email not found');
            return;
        }

        try {
            const q = query(
                collection(db, 'medication'),
                where('userEmail', '==', email)
            );
            const querySnapshot = await getDocs(q);
            const medications = [];
            querySnapshot.forEach((doc) => {
                medications.push({ ...doc.data(), id: doc.id });
            });
            setmedList(medications);
        } catch (e) {
            console.log(e);
        }
    };

    const FilterMedicationsByDate = (selectedDate) => {
        const filtered = medList.filter((medication) =>
            medication.dates?.includes(selectedDate)
        );
        setFilteredMedList(filtered);
    };

    const CheckStatus = () => {
        // Check if the selected date is present in the medication's dates array
        const data = medList.find((item) => item.dates?.includes(selectedDate));

        if (data) {
            const actionForDate = data.action?.find((action) => action.date === selectedDate);
            setstatus(actionForDate);
        }
    };

    return (
        <View>
            <Image source={require('../assets/medication.jpeg')} style={{ marginTop: -2, height: 200, width: '100%', borderRadius: 10 }} />
            <Text style={styles.font}>Add New Medication</Text>
            <FlatList
                style={{ padding: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={dateRange}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.container, { backgroundColor: item?.formatedDate == selectedDate ? '#fe696e' : 'white' }]}
                        onPress={() => setselectedDate(item.formatedDate)}>
                        <Text style={[styles.day, { color: item?.formatedDate == selectedDate ? 'white' : 'black' }]}>{item?.day}</Text>
                        <Text style={[styles.date, { color: item?.formatedDate == selectedDate ? 'white' : 'black' }]}>{item?.date}</Text>
                    </TouchableOpacity>
                )}
            />

            {filteredMedList.length > 0 ? (
                <FlatList
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ padding: 12 }}
                    data={filteredMedList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.medicationContainer}
                            onPress={() => navigation.navigate('Medicationaction', { medication: item })}>
                            <Image source={{ uri: item.type?.icon }} style={styles.medicationIcon} />
                            <View style={styles.medicationDetails}>
                                <Text style={styles.medicationName}>{item.name}</Text>
                                <Text style={styles.medicationDose}>Dose: {item.dose}</Text>
                                <Text style={styles.medicationTime}>Time: {item.time}</Text>
                            </View>
                            <MaterialCommunityIcons name="timer-outline" size={22} color="black" style={{ marginRight: 3 }} />
                            <Text style={styles.reminderTime}>{moment(item.reminder).format('h:mm A')}</Text>
                            {status?.date && status.date === selectedDate && (
                                <View style={styles.insidecontainer}>
                                    <AntDesign name="checkcircle" size={16} color="green" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noMedicationsText}>No medications added yet for this date.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 6,
        paddingTop: 5,
        paddingBottom: 5,
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
    font: {
        fontSize: 20,
        fontWeight: '600',
        padding: 10,
    },
    noMedicationsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    insidecontainer: {
        position: 'absolute',
        top: 5,
        left: 5,
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
});

export default MedicationsList;
