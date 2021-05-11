import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View, FlatList } from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";
import { useNavigation } from "@react-navigation/core";


import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/load";

import api from "../services/api";

import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { PlantProps } from "../libs/storage";

interface EnviromentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [enviromentsSelected, setEnviromentsSelected] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const [loadingMore, setLoadingMore] = useState(true); // para saber se tem mais coisas para carregar
  const [page, setPage] = useState(1); //pagina selecionada, começando pela 1
  
  const navigation = useNavigation();
  
  //filtro da paginação 
  //Memo -> usado para deixar carregada a lista, e só roda a função novamente caso haja mudanças nas dependências 
  const filteredPlants = useMemo(() => {
    return enviromentsSelected === 'all' ? plants : plants.filter(plant =>
      plant.environments.includes(enviromentsSelected)
    );
  }, [page, enviromentsSelected, plants])

  //seleção de plantas por categoria
  //Enviroment = ambiente 
  function handleEnviromentsSelected(environment: string) {
    setEnviromentsSelected(environment);
  }

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

    //condição para a paginação
    if (!data)
      return setLoading(true); //verifica se ainda tem algo para carregar, se nao altera para true

    //Verificar a pagina, para então usar os novos dados e juntar com antigo
    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data);
    }

    setLoading(false); // usado para a animação
    setLoadingMore(false); // para animação na rolagem 
  }

  // função da tela de rolagem, ao chegar no final da pagina, ao arrastar vai carregando mais, ou seja, vai carregando pouco a pouco
  function handleFetchMore(distance: number) {
    // indica que a rolagem é para cima
    if (distance < 1)
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  //função para selecionar planta
  function handlePlantSelect(plant: PlantProps){
/* o plant passado como objeto  depois da virgula vai passar todas as informações da api que ja estão sendo carregadas e levar para a tela de seleção de plantas, sem precisar fazer uma nova requisição */
    navigation.navigate('PlantSave', { plant }); 
  }
  
  
  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc');
      setEnviroments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ]);
    }

    fetchEnviroment();
  }, [])

  useEffect(() => {
    fetchPlants();
  }, [])


  if (loading)
    return <Load />


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>
          Em qual ambiente
        </Text>

        <Text style={styles.subTitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          data={enviroments}
          keyExtractor= {(item) => String(item.key)} // id para melhor performance do flatlist 
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key === enviromentsSelected}
              onPress={() => handleEnviromentsSelected(item.key)}
            />

          )}
          horizontal
          showsHorizontalScrollIndicator={false} //caso queira tirar a linha de baixo 
          contentContainerStyle={styles.enviromentList}
        />

      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor= {(item) => String(item.id)} // id para melhor performance do flatlist 
          renderItem={({ item }
            ) => (
            <PlantCardPrimary 
              data={item} 
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1} //quando o usuário chega a 10% do final da tela
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}

          // carregamento da lista, estilo 
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },

  subTitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});