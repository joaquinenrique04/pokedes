import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface Props {
  name: string;
  url: string;
  onPress: () => void;
}

const typeColors: { [key: string]: string } = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878',
};

export default function PokemonCard({ name, url, onPress }: Props) {
  const [backgroundColor, setBackgroundColor] = useState('#A8A878');
  const [types, setTypes] = useState<string[]>([]);

  // Extraer ID desde la URL
  const extractId = (pokeUrl: string) => {
    const parts = pokeUrl.split('/');
    return parts[parts.length - 2];
  };

  const id = extractId(url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonTypes = response.data.types.map((t: any) => t.type.name);
        setTypes(pokemonTypes);
        const primaryType = pokemonTypes[0] || 'normal';
        setBackgroundColor(typeColors[primaryType] || '#A8A878');
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [id]);

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.id}>#{id.padStart(3, '0')}</Text>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.typeContainer}>
          {types.map((type) => (
            <View key={type} style={[styles.typeBadge, { backgroundColor: typeColors[type] }]}>
              <Text style={styles.typeText}>{type.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // Para ajustarse a la mitad de la pantalla cuando numColumns={2}
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    padding: 8,
    borderRadius: 10,

    // Sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  id: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 4,
    marginTop: 2,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
