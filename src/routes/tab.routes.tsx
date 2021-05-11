import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import MyPlants from '../pages/MyPlants';
import { PlantSelect } from '../pages/PlantSelect';
import colors from '../styles/colors';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
  return(
    <AppTab.Navigator
      tabBarOptions={{
        activeTintColor: colors.green, // cor de quando estiver selecionado
        inactiveTintColor: colors.heading,
        labelPosition: 'beside-icon', //um ao lado do outro
        style: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 88
        },
      }}>
        <AppTab.Screen
          name="Nova Planta"
          component={PlantSelect}
          options={{
            tabBarIcon: (({ size, color }) => (
              <MaterialIcons 
                name="add-circle-outline"
                size={size}
                color={color} 
              />
            ))
          }}
        />
        
        <AppTab.Screen
          name="Minhas Plantas"
          component={MyPlants}
          options={{
            tabBarIcon: (({ size, color }) => (
              <MaterialIcons 
                name="format-list-bulleted"
                size={size}
                color={color} 
              />
            ))
          }}
        />
      </AppTab.Navigator>
  )
}

export default AuthRoutes;