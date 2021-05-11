import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform, SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  const navigation = useNavigation();

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputChange(value: string) {
    setIsFilled(!!value); //verificação para ver se esta vazio
    setName(value);
  }


  async function handleSubmit() {
    //Validação para verificar se o campo foi preenchido
    if (!name)
      return Alert.alert('Me diz como chamar vc... \n 👉👈 😢');

    try {
      //armazenamento local, guardar o valor da variavel,
      // por convenção, se costuma usar esse nome de variavel -> 
      // @plantmanager:user que é o nome do app + o que quer guardar
      // devido ao armazenamento a função deve ser async-await
      await AsyncStorage.setItem('@plantmanager:user', name);
      navigation.navigate('Confirmation',{
        title: 'Prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
      }
      );
    } catch {
      return Alert.alert('Não foi possível salvar seu nome, algo deu errado 😬');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* usado para efetuar a chamada do teclado quando for digitar e não sumir o botão de confirmar */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* para sair da tela de digitação ao pressionar qualquer lugar da tela  */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>

            <View style={styles.form}>

              <View style={styles.header}>

                <Text style={styles.emoji}>
                  {isFilled ? '😃' : '😊'}
                </Text>

                <Text style={styles.title}>
                  Como podemos{"\n"}
                  chamar você ?
                </Text>

              </View>

              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green }
                ]}
                placeholder="Digite seu nome ou apelido"
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />

              <View style={styles.footer}>
                <Button
                  title="Começar"
                  onPress={handleSubmit}
                />
              </View>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  content: {
    flex: 1,
    width: '100%',
  },

  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
  },

  emoji: {
    fontSize: 44,
  },


  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 32,
    marginTop: 20,
  },

  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },

});