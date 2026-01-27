import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

const API = (namecity: string, units: string = 'metric', lang: string = 'fr') => 
  `https://api.openweathermap.org/data/2.5/forecast?q=${namecity}&appid=d8d2c196120384ee30b5ed0789101c5d&units=${units}&lang=${lang}`;

const getWeather = async (location: string) => {
  try {
    const response = await fetch(API(location, 'metric', 'fr'));
    const data = await response.json();
    return data;
  } catch(e) {
    console.log("ERREUR dans getWeather:", e);
    return null;
  }
};

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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{stationName}</ThemedText>
      {data && data.city && (
        <>
          <Text style={styles.text}>Ville: {data.city.name}</Text>
          <Text style={styles.text}>Temp: {data.list[0]?.main?.temp}°C</Text>
          <Text style={styles.text}>Météo: {data.list[0]?.weather[0]?.description}</Text>
        </>
      )}
      {!data && <Text style={styles.text}>Aucune donnée disponible</Text>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginTop: 20,
  },
});