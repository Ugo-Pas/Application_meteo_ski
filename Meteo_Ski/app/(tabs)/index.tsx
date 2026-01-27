import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CatProps = {
  name: string;
};

const Button_station= (props: CatProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => router.push({
        pathname: '/(tabs)/station',
        params: { name: props.name }
      })}
    >
      <Text style={styles.buttonText}>{props.name}</Text>
    </TouchableOpacity>
  );
};

const list_button = (): React.ReactNode => {
  return (
    <View>
      <View style={styles.buttonRow}>
        <Button_station name='Val Thorens'/>
        <Button_station name="Val d'Isère"/>
      </View>
      <View style={styles.buttonRow}>
        <Button_station name='Les Arcs'/>
        <Button_station name='Auron'/>
      </View>
      <View style={styles.buttonRow}>
        <Button_station name='Isola'/>
        <Button_station name="Allos"/>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('fr-FR', options);
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
    });
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/back_info.jpg')}
      contentFit="cover" 
      style={styles.image}>
        <Text style={styles.title}>Meteo Ski</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <Text style={styles.timeText}>{formatTime()}</Text>
        </View>
      <ScrollView contentContainerStyle={styles.container_button}>
        {list_button()}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({  
  dateTimeContainer: {
    alignItems: 'center',
    paddingTop: 0,
    marginBottom: 0,
  },
  dateText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000000ff',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  timeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000ff',
    marginTop: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  container_ti: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  container_button: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 50,
    paddingBottom: 100,
  },
  title: {
    color: '#000000ff',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 10,
    gap: 15,
  },
  button: {
    backgroundColor: '#0d4f85ff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 50,
    minWidth: 125,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
