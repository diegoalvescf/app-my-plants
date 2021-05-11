import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import Routes from './src/routes';
import { PlantProps } from './src/libs/storage';


export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  })

  useEffect(() => {

    // Ouvir as notificações
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
    });

    return () => subscription.remove();

    // // listar as Notificações ------------
    // async function notification(){
     
    //   // // cancelar todas as notificaçõe
    //   // await Notifications.cancelAllScheduledNotificationsAsync();
      
    //   //Lista todas as notificações agendadas 
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log('####################################     Notificações agendadas!     ####################################');
    //   console.log(data);
    // }

    // notification();
  })
  if (!fontsLoaded)
    return <AppLoading />
  return (
    <Routes />
  );
};