import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackParamList = {
  Home: undefined;
  PokemonDetail: { name: string };
};

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pokemonTypes = [
    'Todos',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy'
  ];

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

  const filterByType = (type: string | null) => {
    setSelectedType(type);
    setModalVisible(false);
    if (!type || type === 'Todos') {
      setFilteredList(pokemonList);
      return;
    }
    const newList = pokemonList.filter((p) => p.types.includes(type));
    setFilteredList(newList);
  };

  const renderItem = ({ item }: { item: any }) => (
    <PokemonCard
      name={item.name}
      url={item.url}
      onPress={() => navigation.navigate('PokemonDetail', { name: item.name })}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.filterButtonText}>
          {selectedType ? `Tipo: ${selectedType}` : 'Filtrar por Tipo'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un Tipo</Text>
            {pokemonTypes.map((type) => (
              <TouchableOpacity key={type} style={styles.option} onPress={() => filterByType(type)}>
                <Text style={styles.optionText}>{type.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        numColumns={2} 
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
