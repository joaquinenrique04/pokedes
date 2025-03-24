import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PokemonTypeBadge from '../components/PokemonTypeBadge.tsx';

type PokemonDetailProps = NativeStackScreenProps<{ PokemonDetail: { name: string } }, 'PokemonDetail'>;

export default function PokemonDetailScreen({ route }: PokemonDetailProps) {
  const { name } = route.params;
  const [pokemon, setPokemon] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [evolutionChain, setEvolutionChain] = useState<{ name: string, sprite: string }[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'About' | 'Base Stats' | 'Evolution'>('About');

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(response.data);

      const speciesResponse = await axios.get(response.data.species.url);
      setSpecies(speciesResponse.data);

      if (speciesResponse.data.evolution_chain?.url) {
        const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
        extractEvolutionChain(evolutionResponse.data.chain);
      }
      const types = response.data.types.map((t: any) => t.type.url);
      fetchWeaknesses(types);
    } catch (error) {
      console.error(error);
    }
  };

  const extractEvolutionChain = async (chain: any) => {
    let evolutions: { name: string, sprite: string }[] = [];
    let currentStage = chain;

    while (currentStage) {
      const evoName = currentStage.species.name;
      const evoResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
      evolutions.push({ name: evoName, sprite: evoResponse.data.sprites.front_default });

      currentStage = currentStage.evolves_to.length > 0 ? currentStage.evolves_to[0] : null;
    }
    setEvolutionChain(evolutions);
  };

  const fetchWeaknesses = async (typeUrls: string[]) => {
    try {
      let weaknessesSet = new Set<string>();

      for (const url of typeUrls) {
        const typeResponse = await axios.get(url);
        const weaknesses = typeResponse.data.damage_relations.double_damage_from.map((t: any) => t.name);
        
        weaknesses.forEach((weakness: string) => weaknessesSet.add(weakness));
      }

      setWeaknesses(Array.from(weaknessesSet));
    } catch (error) {
      console.error(error);
    }
  };

  if (!pokemon || !species) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <Text style={styles.title}>#{pokemon.id} {pokemon.name}</Text>
      <Image source={{ uri: pokemon.sprites.other['official-artwork'].front_default }} style={styles.image} />
      <View style={styles.typeContainer}>
        {pokemon.types.map((t: any) => (
          <PokemonTypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </View>
      <View style={styles.tabContainer}>
        {['About', 'Base Stats', 'Evolution'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab as any)} style={[styles.tab, selectedTab === tab && styles.activeTab]}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === 'About' && (
        <View>
          <Text style={styles.sectionTitle}>Pokédex Data</Text>
          <Text style={styles.detail}>Category: {species.genera.find((g: any) => g.language.name === 'en')?.genus}</Text>
          <Text style={styles.detail}>Height: {pokemon.height / 10} m</Text>
          <Text style={styles.detail}>Weight: {pokemon.weight / 10} kg</Text>
          <Text style={styles.detail}>Capture Rate: {species.capture_rate}</Text>
          
          <Text style={styles.sectionTitle}>Abilities</Text>
          {pokemon.abilities.map((a: any) => (
            <Text key={a.ability.name} style={styles.detail}>{a.ability.name}</Text>
          ))}
          <Text style={styles.sectionTitle}>Weaknesses</Text>
          <View style={styles.typeContainer}>
            {weaknesses.map((weakness) => (
              <PokemonTypeBadge key={weakness} type={weakness} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Training</Text>
          <Text style={styles.detail}>Base Happiness: {species.base_happiness}</Text>
          <Text style={styles.detail}>Base Experience: {pokemon.base_experience}</Text>
          <Text style={styles.detail}>Growth Rate: {species.growth_rate.name.replace("-", " ")}</Text>
        </View>
      )}
      {selectedTab === 'Base Stats' && (
        <View>
          <Text style={styles.sectionTitle}>Stats</Text>
          {pokemon.stats.map((s: any) => (
            <Text key={s.stat.name} style={styles.detail}>{s.stat.name}: {s.base_stat}</Text>
          ))}
        </View>
      )}
      {selectedTab === 'Evolution' && (
        <View>
          <Text style={styles.sectionTitle}>Evolution Chain</Text>
          <View style={styles.evolutionContainer}>
            {evolutionChain.map((evo, index) => (
              <View key={index} style={styles.evolutionItem}>
                <Image source={{ uri: evo.sprite }} style={styles.sprite} />
                <Text style={styles.detail}>{evo.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 10 },
  image: { width: 200, height: 200, marginBottom: 10, resizeMode: 'contain' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  detail: { fontSize: 16, marginBottom: 5, textTransform: 'capitalize' },
  tabContainer: { flexDirection: 'row', marginBottom: 10 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#4CAF50' },
  tabText: { fontSize: 16, fontWeight: 'bold' },
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 },
  evolutionContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  evolutionItem: { alignItems: 'center', marginHorizontal: 10 },
  sprite: { width: 100, height: 100, resizeMode: 'contain' },
});
