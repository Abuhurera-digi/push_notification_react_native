/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
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
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';
import {PermissionsAndroid} from 'react-native';





function App(): React.JSX.Element {
  
  useEffect(() => {
    requestPermission()
  },[]);

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
    // Do something
     notificationMessage= message;
     
    console.log("messagesssss", message)
    console.log("qqqqqqqqq", notificationMessage);
  }
  
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);


const get = async () => {
  await messaging().registerDeviceForRemoteMessages();
const token = await messaging().getToken();
console.log("yyyyyyyyyyy", token);
}

//   const getToken = async () => {
//     await messaging().registerDeviceForRemoteMessages();
// const token = await messaging().getToken();
//   } 
 
async function onDisplayNotification() {
  try {
    // Request permission
    await notifee.requestPermission();

    // Create a notification channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      //importance: notifee.AndroidImportance.HIGH, // Ensure high importance
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
