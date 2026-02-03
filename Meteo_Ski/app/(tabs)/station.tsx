import { Switch, ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

const API = (namecity: string, units: string = 'metric', lang: string = 'fr') => {
  const city = encodeURIComponent(namecity);
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=d8d2c196120384ee30b5ed0789101c5d&units=${units}&lang=${lang}`;
};

const getWeather = async (location: string) => {
  try {
    const response = await fetch(API(location, 'metric', 'fr'));
    if (!response.ok) {
      console.log('ERREUR getWeather status:', response.status);
      return null;
    }
    const data = await response.json();
    return data;
  } catch(e) {
    console.log("ERREUR dans getWeather:", e);
    return null;
  }
};

const getWindDirection = (degrees: number): string => {
  const directions = [
    'Nord', 'Nord-Nord-Est', 'Nord-Est', 'Est-Nord-Est',
    'Est', 'Est-Sud-Est', 'Sud-Est', 'Sud-Sud-Est',
    'Sud', 'Sud-Sud-Ouest', 'Sud-Ouest', 'Ouest-Sud-Ouest',
    'Ouest', 'Ouest-Nord-Ouest', 'Nord-Ouest', 'Nord-Nord-Ouest'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Background image lives at project root /assets/images
const backImage = require('../../assets/images/back.png');

export default function StationScreen() {
  const { name } = useLocalSearchParams();
  const stationName = String(name || 'Station');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getWeather(stationName);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [name]);
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }
  const PrevueDay = (index: number) => {
    const forecast = data?.list?.[index];
    if (!forecast) return null;
  const iconCode = forecast?.weather?.[0]?.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;
  return (
    <View style={styles.forecastCard}>
      <Text style={styles.prevueday}>
        {new Date(forecast?.dt * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
      </Text>
        <Text style={styles.prevue}>Météo : {forecast?.weather?.[0]?.description}</Text>
      <View style={styles.prevueRow}>
        <Text style={styles.prevuetmp}>{Math.round(forecast?.main?.temp)}°C</Text>
        {iconUrl && (
          <Image
            source={{ uri: iconUrl }}
            style={styles.prevueIcon}
          />
        )}
      </View>
      <Text style={styles.prevue}>Vent : {forecast.wind.speed} KM/H</Text>
      <Text style={styles.prevue}>Direction : {getWindDirection(forecast.wind.deg)}</Text>
    </View>
  );
};
  const firstForecast = data?.list?.[0];
  const iconCode = firstForecast?.weather?.[0]?.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;
  return (
    <ImageBackground
      source={backImage}
      resizeMode="cover"
      style={styles.image}>
      <ThemedView
        lightColor="transparent"
        darkColor="transparent"
        style={styles.container}>
        <Text style={styles.titlestation}>{stationName}</Text>
        {data && data.city && (
          <>
          <Text style={styles.text}>Météo : {firstForecast?.weather?.[0]?.description}</Text>
          <View style={styles.row}>
            <Text style={styles.tmp}>{Math.round(firstForecast?.main?.temp)}°C</Text>
            {iconUrl && (
              <Image
                source={{ uri: iconUrl }}
                style={styles.icon}
                accessibilityLabel={firstForecast?.weather?.[0]?.description || 'Icône météo'}
              />
            )}
          </View>
          <View>
            <Text style={styles.text}> Vent : {firstForecast.wind.speed} KM/H</Text>
            <Text style={styles.text}> Direction : {getWindDirection(firstForecast.wind.deg)}</Text>
          </View>
          <View style={styles.switchRow}>
            <Switch
              trackColor={{false: '#767577', true: '#06327e'}}
              thumbColor={isEnabled ? '#9f1cc0' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={styles.prevue}>Prevision jour avenir</Text>
          </View>
          {isEnabled && <View style={styles.prevueContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PrevueDay(8)}
            {PrevueDay(16)}
            {PrevueDay(24)}
            {PrevueDay(32)}
          </ScrollView>
            </View>}
          </>
        )}
        {!data && <Text style={styles.text}>Aucune donnée disponible</Text>}
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign : 'center',
    gap: 15,
    marginTop: 0,
  },
  icon: {
    width: 170,
    height: 170,
    marginTop: 10,
  },
  tmp: {
    fontSize: 35,
    marginTop: 10,
    color: 'rgb(60, 120, 231)',
    fontWeight : 'bold',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  text: {
    fontSize: 30,
    marginTop: 15,
    color: 'rgb(60, 120, 231)',
    fontWeight: 'bold',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  prevue: {
    fontSize: 20,
    color: 'rgb(60, 120, 231)',
    fontWeight: 'bold',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginLeft: 10,
    textAlign: 'center',
  },
  prevuetmp: {
    fontSize: 20,
    marginTop: 10,
    color: 'rgb(60, 120, 231)',
    fontWeight : 'bold',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  prevueday: {
    fontSize: 30,
    color: 'rgb(60, 120, 231)',
    fontWeight: 'bold',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginLeft: 10,
    textAlign: 'center',
  },
  prevueIcon: {
    width: 70,
    height: 70,
    marginTop: 10,
  },
  forecastCard: {
  marginRight: 15,
  padding: 10,
  borderRadius: 10,
  backgroundColor: 'rgba(128, 17, 150, 0.3)',
  minWidth: 150,
  },
  prevueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  prevueContainer: {
    marginTop: 60,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  titlestation: {
    color: 'rgb(60, 120, 231)',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    width: '100%',
    flexWrap: 'wrap',
  },
});