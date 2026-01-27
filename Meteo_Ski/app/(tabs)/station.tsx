import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
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

// Background image lives at project root /assets/images
const backImage = require('../../assets/images/back.png');

export default function StationScreen() {
  const { name } = useLocalSearchParams();
  const stationName = String(name || 'Station');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getWeather(stationName);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [stationName]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
        <ThemedText style={styles.titlestation} type="title">{stationName}</ThemedText>
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
          </View>
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
    justifyContent: 'center',
    padding: 20,
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
    fontWeight : 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  text: {
    fontSize: 25,
    marginTop: 10,
        fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  titlestation: {
    color: '#000000ff',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
});