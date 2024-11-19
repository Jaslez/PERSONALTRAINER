import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const InjuryScreen = () => {
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInjuries = async () => {
      try {
        const userId = auth.currentUser?.uid; // Obtiene el UID del usuario autenticado.
        if (!userId) {
          throw new Error('Usuario no autenticado.');
        }

        const injurySnapshot = await getDocs(collection(db, 'usuarios', userId, 'injuries'));
        const injuriesData = injurySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setInjuries(injuriesData);
      } catch (error) {
        console.error('Error fetching injuries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInjuries();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Lesiones</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : injuries.length > 0 ? (
        injuries.map((injury, index) => (
          <View key={index} style={styles.injuryContainer}>
            {/* Aquí es donde convierto el Timestamp */}
            <Text style={styles.injuryText}>
              Fecha: {injury.date?.toDate().toLocaleDateString() || 'Fecha no disponible'}
            </Text>
            <Text style={styles.injuryText}>Descripción: {injury.description}</Text>
            <Text style={styles.injuryText}>Estado: {injury.status}</Text>
            <Text style={styles.injuryText}>
              Notas del Entrenador: {injury.trainerNotes || 'Sin notas'}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No hay lesiones registradas. ¡Sigue entrenando de forma segura!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  injuryContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  injuryText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default InjuryScreen;
