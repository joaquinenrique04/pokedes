import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ProfileScreenProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function ProfileScreen({ setIsLoggedIn }: ProfileScreenProps) {
  const username = 'admin';

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <Text style={styles.detail}>Usuario: {username}</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:28, marginBottom:20 },
  detail: { fontSize:18, marginBottom:10 },
});
