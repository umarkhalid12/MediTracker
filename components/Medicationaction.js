import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import Home from '../tabs/Home';
import MedicationsList from './MedicationsList';
import BottomTabs from '../App'

const Medicationaction = ({ onUpdate = () => {} }) => { // Provide default empty function for onUpdate
    const route = useRoute();
    const { medication } = route.params;
    const [status, setStatus] = useState(null); // To keep track of the action status for the medication

    const formatReminderTime = (timestamp) => {
        return moment(timestamp).format('h:mm A');
    };

    const currentDate = moment().format('DD/MM/YYYY');
    const navigation = useNavigation();

    useEffect(() => {
        // Check if the medication has been taken for today
        const actionTaken = medication.action?.find((action) => action.date === medication.dates[0] && action.status === 'Taken');
        if (actionTaken) {
            setStatus('Taken');
        }
    }, [medication]);

    const updateactionstatus = async (status) => {
        if (!status || !medication?.docId || !medication?.dates || medication.dates.length === 0) {
            Alert.alert('Error', 'Missing required data to update the medication status.');
            return;
        }

        const selectedDate = medication.dates[0]; // Assuming we're using the first date for simplicity.

        const existingAction = medication.action?.find(action => action.date === selectedDate);
        if (existingAction) {
            Alert.alert('Already Updated', 'This medication has already been marked for today.');
            return;
        }

        try {
            const docRef = doc(db, 'medication', medication.docId);
            const actionData = {
                status: status,
                time: moment().format('LT'),
                date: selectedDate,
            };

            for (let key in actionData) {
                if (actionData[key] === undefined || actionData[key] === null) {
                    throw new Error(`Invalid data for ${key}`);
                }
            }

            await updateDoc(docRef, {
                action: arrayUnion(actionData), // Safely add the action data
            });

            setStatus(status);

            // Pass the updated status back to the parent component (FlatList)
            onUpdate(medication.docId, status);

            Alert.alert(status, 'Response Saved', [
                {
                    text: 'Ok',
                    onPress: () => navigation.navigate('Main'),
                },
            ]);
        } catch (e) {
            console.log(e);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image style={styles.notificationImage} source={require('../assets/notification.gif')} />
            <Text style={styles.currentDate}>{currentDate}</Text>
            <Text style={styles.reminderTime}>{formatReminderTime(medication.reminder)}</Text>
            <Text style={styles.timeToTake}>It's Time To Take!</Text>

            <View style={styles.medicationCard}>
                <Image source={{ uri: medication.type?.icon }} style={styles.medicationIcon} />
                <View style={styles.medicationDetails}>
                    <Text style={styles.medicationName}>{medication.name}</Text>
                    <Text style={styles.medicationDose}>Dose: {medication.dose}</Text>
                    <Text style={styles.medicationTime}>Time: {medication.time}</Text>
                </View>
                <MaterialCommunityIcons name="timer-outline" size={22} color="black" style={{ marginRight: 3 }} />
                <Text style={styles.reminderTime}>{formatReminderTime(medication.reminder)}</Text>

                {/* Display the green tick if the medication has been taken */}
                {status === 'Taken' && (
                    <View style={styles.statusTick}>
                        <AntDesign name="checkcircle" size={24} color="green" />
                    </View>
                )}

                {/* Display the red cross if the medication has been missed */}
                {status === 'Missed' && (
                    <View style={styles.statusTick}>
                        <AntDesign name="closecircle" size={24} color="red" />
                    </View>
                )}
            </View>

            <View style={{ flexDirection: 'row', gap: 30, marginTop: 20 }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        paddingRight: 10,
                        backgroundColor: 'green',
                        borderRadius: 5,
                    }}
                    onPress={() => updateactionstatus('Taken')}>
                    <AntDesign name="check" size={24} color="white" />
                    <Text style={{ color: 'white' }}>Taken</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        paddingRight: 8,
                        borderWidth: 2,
                        borderColor: 'red',
                        borderRadius: 5,
                    }}
                    onPress={() => updateactionstatus('Missed')}>
                    <AntDesign name="closecircle" size={24} color="red" />
                    <Text style={{ color: 'red' }}>Missed</Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', position: 'absolute', bottom: 25 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="closecircle" size={24} color="gray" />
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
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    notificationImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    currentDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    reminderTime: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    timeToTake: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 15,
    },
    medicationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 3,
        position: 'relative',
    },
    medicationIcon: {
        width: 50,
        height: 50,
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
    statusTick: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
});

export default Medicationaction;
