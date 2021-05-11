import React, { useState } from 'react';

import { View, Text, StyleSheet,Image, Platform, Alert } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from "@react-navigation/core"; // através dele que vou recuperar os dados da planta que estao sendo carredos na função do plant select ( https://prnt.sc/12lprea )
import { SvgFromUri } from 'react-native-svg';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { loadPlant, PlantProps, savePlant } from '../libs/storage';

import waterdrop from '../assets/waterdrop.png'
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { format, isBefore } from 'date-fns';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

interface Params {
  plant: PlantProps; 
}

export function PlantSave() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date()); // estado usado para capturar o tempo informado para o time picker, e por padrão vai ser uma nova data https://prnt.sc/12lrr8q 
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios'); // para controlar quando irá aparecer ou não no caso do android, nesse caso se for ios ele é verdadeiro e ja mostra!
  
  const route = useRoute(); //para recuperar os dados da planta
  const { plant } = route.params as Params;

  const navigation = useNavigation();

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
      //verificar se é android, e faz a inversão do estado, pois por padrão esta recebendo o IOS como padrão https://prnt.sc/12ls7t9 
     if(Platform.OS === 'android'){
      setShowDatePicker(oldState => !oldState);
    }

    //Validação, para não deixar escolher uma data de um horário que ja passou, 
    //https://prnt.sc/12lsobm 
    if(dateTime && isBefore(dateTime, new Date())){
      setSelectedDateTime( new Date()); // volta a configuração da hora, para a hora atual. ex, se é 12:15 e o usuario configurou 11 hrs, ele volta para 12:15 e avisa para configurar uma hora futura. 
      return Alert.alert('escolha uma data no futuro! ⏰')
    }

    //continua a verificação, então caso exista, ele preenche com a data selecionada
    if(dateTime) 
      setSelectedDateTime(dateTime);
  }

  //função para abrir a alteração da hora no android, muda o estado e então aparece o timer
  function handleOpenDateTimePickerFromAndroid(){
    setShowDatePicker(oldState => !oldState);
  }

  async function handleSave() {
    try {
      
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime
      });

      navigation.navigate('Confirmation',{
        title: 'Tudo certo',
        subtitle: 'Pode deixar que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito obrigado',
        icon: 'hug',
        nextScreen: 'MyPlants',
      }
      );

    } catch {
      Alert.alert('Não foi possível salvar.. 😬');
    }
  }
  
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >

      <View style={styles.container}>   
      
        <View style={styles.plantInfo}>
      
          <SvgFromUri
            uri={plant.photo}
            height={150}
            width={150}
          />

          <Text style={styles.plantName}>
            {plant.name}
          </Text>
      
          <Text style={styles.plantAbout}>
            {plant.about}
          </Text>
      
        </View>

        <View style={styles.controller}>
      
          <View style={styles.tipContainer}> 
            
            <Image
              source={waterdrop}
              style={styles.tipImage}
            />

            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>


          </View>
        
          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {/* exibição para o IOS */}
          {showDatePicker && (<DateTimePicker
              value={selectedDateTime}
              mode="time"
              display="spinner"
              onChange={handleChangeTime}
            />
          )}

          {/* exibição para Android  */}
          {
            Platform.OS === 'android' && (
              <TouchableOpacity 
                style={styles.dateTimePickerButton}
                onPress={handleOpenDateTimePickerFromAndroid}

              >
                <Text style={styles.dateTimePickerText}>
                  { selectedDateTime ? `Mudar | ${format(selectedDateTime, 'HH:mm')}`: 'Selecionar horário'} {/*exibe a data selecionada */}
                </Text>
              </TouchableOpacity>
            )
          }

          <Button title="Cadastrar planta" onPress={handleSave}/>
        
        </View>
      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },

  plantInfo:{
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },

  controller:{
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  
  plantAbout:{
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },

  tipContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    // para subir a divisão do fundo (https://prnt.sc/12lpcjy)
    position: 'relative',
    bottom: 60,
  },

  tipImage:{
    width: 56,
    height: 56,
  },

  tipText:{
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },
  

  alertLabel:{
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  dateTimePickerText: {
    backgroundColor: colors.blue_light,
    padding: 15,
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
    borderRadius: 20,
  },

});

export default PlantSave;
