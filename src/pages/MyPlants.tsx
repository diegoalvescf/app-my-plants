import  React, { useEffect, useState }  from 'react';

import { View, Text, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png'
import { loadPlant, PlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/load';

function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWatered] = useState<string>(); //proxima regada

    
  useEffect(() => {
    async function loadStorageData() {

      const plantsStoraged = await loadPlant();
      
      const nextTime = formatDistance( //do Date-fns - ele calcula a distancia de uma data para a outra 
        new Date(plantsStoraged[0].dateTimeNotification).getTime(), //pega a primeira posição
        new Date().getTime(), // Quanto tempo falta para agora
        {locale: pt} //formatar
      ); 

      setNextWatered(
        `Não esqueça de plantar a ${plantsStoraged[0].name} à ${nextTime}.`
      )
     
      setMyPlants(plantsStoraged); // armazenar as plantas carregadas
      setLoading(false); // para o carregamento.
    } 

    loadStorageData();
  }, [])

  // função para deletar a planta
  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name} ?`, [
      {
        text: 'Não 🙏',
        style: 'cancel'
      },
      {
        text: 'Sim 😌',
        onPress: async () => {
          try{

            await removePlant(plant.id);

            setMyPlants((oldData) => 
              oldData.filter((item) => item.id !== plant.id) //diferente (!+=== -> !==)
            );

          } catch (error) {
            Alert.alert('Não foi possível remover! 😥')
          }
        }
      }
    ])
  }
  
  if(loading) 
    return <Load />


  return (
    <View style={ styles.container }>
      <Header />
      
      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage}/>
      
        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>
      
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Plantas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item}) => (     
            <PlantCardSecondary 
              data={item}  
              handleRemove={() => {handleRemove(item)}}
            />
           )}  
           showsHorizontalScrollIndicator={true}
           contentContainerStyle={{ flex: 1}}
        />
      </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  spotlightImage: {
    width: 60,
    height: 60, 
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify',
  },

  plants: { 
    flex: 1,
    width: '100%',
  },

  plantsTitle:{
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading, 
  },
});

export default MyPlants;
