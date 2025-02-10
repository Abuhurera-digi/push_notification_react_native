/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect,useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
    Platform
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';
import {PermissionsAndroid} from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';






function App(): React.JSX.Element {

  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  
  useEffect(() => {
    requestPermission()
  },[]);

  useEffect(() => {
    requestLocationPermission();
  }, [location]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }
    }
    getLiveLocation();
  };


  const getLiveLocation = () => {
    Geolocation.watchPosition(
      (position) => {
        console.log("Live Location:", position);
        setLocation(position.coords);
      },
      (error) => {
        console.error("Location Error:", error);
        Alert.alert("Error", error.message);
      },
      {
        enableHighAccuracy: true, // Use GPS for precise location
        distanceFilter: 1, // Update when user moves at least 1 meter
        interval: 5000, // Fetch location every 5 seconds
      }
    );
  };

  const requestPermission= async () => {

    const grandted = await  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if(grandted === PermissionsAndroid.RESULTS.GRANTED){
     
      get();
      console.log("llllllllll", get());
      Alert.alert("Permission Granted");
    }
    else{
      console.log("oooooooooooo");
      Alert.alert("Permission Deniede");
    }

  }

  let notificationMessage;
  async function onMessageReceived(message) {
  
     notificationMessage= message;
     
    console.log("messagesssss", message)
   
  }
  
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);


const get = async () => {
  await messaging().registerDeviceForRemoteMessages();
const token = await messaging().getToken();
console.log("token", token);
}


 
async function onDisplayNotification() {
  try {
    // Request permission
    await notifee.requestPermission();

    // Create a notification channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    console.log("Notification Channel Created:", channelId);

    // Display the notification
    await notifee.displayNotification({
      title: notificationMessage?.notification?.title || "No Title",
      body: notificationMessage?.notification?.body || "No Body",
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });

    console.log("Notification Displayed Successfully");
  } catch (error) {
    console.error("Notification Error:", error);
  }
}


  return (
    <SafeAreaView >
     {/* <View>
    <Text>App</Text>
     </View> */}
    <View>
      <Button title="Display Notification" onPress={() => onDisplayNotification()} />
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Live Location</Text>
      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Button title="Refresh Location" onPress={getLiveLocation} />
    </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
