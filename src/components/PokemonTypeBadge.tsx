//logos de tipos 

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const typeIcons: { [key: string]: string } = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🍃',
  ice: '❄️',
  fighting: '🥊',
  poison: '☠️',
  ground: '🌍',
  flying: '🕊️',
  psychic: '🔮',
  bug: '🐞',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '🔩',
  fairy: '🧚',
};

const PokemonTypeBadge = ({ type }: { type: string }) => {
  return (
    <View style={styles.typeBadge}>
      <Text style={styles.typeText}>
        {typeIcons[type] || '❓'} {type}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 10,
    marginRight: 5,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default PokemonTypeBadge;
