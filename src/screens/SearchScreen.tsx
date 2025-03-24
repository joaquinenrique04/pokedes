import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PokemonCard from '../components/PokemonCard';

type HomeStackParamList = {
  Home: undefined;
  PokemonDetail: { name: string };
};

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=200');
      const results = response.data.results;
      const enriched = await Promise.all(
        results.map(async (item: any) => {
          const pokeId = extractId(item.url);
          const detail = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
          const types = detail.data.types.map((t: any) => t.type.name);
          return {
            ...item,
            id: pokeId,
            types,
          };
        })
      );

      setPokemonList(enriched);
      setFilteredList(enriched);
    } catch (error) {
      console.error(error);
    }
  };

  const extractId = (pokeUrl: string) => {
    const parts = pokeUrl.split('/');
    return parts[parts.length - 2];
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text) {
      setFilteredList(pokemonList);
      return;
    }
    const filtered = pokemonList.filter((p) => p.name.includes(text.toLowerCase()));
    setFilteredList(filtered);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('PokemonDetail', { name: item.name })} 
    >
      <PokemonCard name={item.name} url={item.url} types={item.types} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
});
