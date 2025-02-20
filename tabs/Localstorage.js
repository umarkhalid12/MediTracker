import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save email
export const saveEmail = async (email) => {
  try {
    await AsyncStorage.setItem('userEmail', email);
    console.log('Email saved successfully:', email);
  } catch (error) {
    console.error('Failed to save email:', error);
  }
};

// Function to get email
export const getEmail = async () => {
  try {
    const email = await AsyncStorage.getItem('userEmail');
    console.log('Retrieved Email:', email);
    return email;
  } catch (error) {
    console.error('Failed to fetch email:', error);
    return null;
  }
};

// Function to clear email
export const clearEmail = async () => {
  try {
    await AsyncStorage.removeItem('userEmail');
    console.log('Email cleared successfully.');
  } catch (error) {
    console.error('Failed to clear email:', error);
  }
};

// Function to log email (for debugging)
export const logStoredEmail = async () => {
  try {
    const email = await getEmail();
    if (email) {
      console.log('Currently stored email:', email);
    } else {
      console.log('No email is currently stored.');
    }
  } catch (error) {
    console.error('Failed to log stored email:', error);
  }
};
