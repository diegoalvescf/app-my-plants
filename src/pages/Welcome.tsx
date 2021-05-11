import React from 'react'
import { Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, View } from 'react-native'
import wateringImg from '../assets/watering.png'
import colors from '../styles/colors';
import { Feather } from '@expo/vector-icons';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/core';


export function Welcome() {
  const navigation = useNavigation();

  function handleStart() {
    navigation.navigate('UserIdentification');
  }

  return (
    // para que os componentes nao encostem nas extremidades
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Gerencie{"\n"}
          suas plantas de{"\n"}
          forma fácil
        </Text>

        <Image
          source={wateringImg}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Não esqueça mais de regar suas plantas.
          {"\n"}Nós cuidamos de lembrar
          você sempre que precisar.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={handleStart}
        >
          <Feather
            name="chevron-right"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //ocupar a tela toda
  },

  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around', //para as extremidades nao grudar nas bordas
  },

  title: {
    fontSize: 32,
    textAlign: 'center',
    color: colors.heading,
    marginTop: 38,
    fontFamily: fonts.heading,
    lineHeight: 38, //altura da linha
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.heading,
    // fontFamily: fonts.text,

  },

  image: {
    height: Dimensions.get('window').width * 0.7
  },

  button: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 30,
    height: 60,
    width: 60,

  },

  buttonIcon: {
    color: colors.white,
    fontSize: 32,
  }
})