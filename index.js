/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Handle background notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in background!', remoteMessage);

  // Display notification
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId: 'default',
      importance: notifee.AndroidImportance.HIGH,
    },
  });
});

AppRegistry.registerComponent(appName, () => App);
    
