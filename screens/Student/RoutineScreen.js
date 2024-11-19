import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db, auth } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const RoutineScreen = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const userId = auth.currentUser?.uid; // Obtiene el UID del alumno autenticado.
        if (!userId) {
          throw new Error('Usuario no autenticado.');
        }

        const routineSnapshot = await getDocs(collection(db, 'usuarios', userId, 'routine'));
        const routineData = routineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setRoutines(routineData);
      } catch (error) {
        console.error('Error fetching routines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutinas Asignadas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : routines.length > 0 ? (
        <ScrollView>
          {routines.map((routine, index) => (
            <View key={index} style={styles.routineContainer}>
              <Text style={styles.routineTitle}>{routine.routineName || 'Rutina Sin Nombre'}</Text>
              <Text style={styles.dateText}>
                Fecha de Inicio: {routine.startDate?.toDate().toLocaleDateString() || 'No disponible'}
              </Text>
              {routine.exercises?.map((exercise, idx) => (
                <View key={idx} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>Ejercicio: {exercise.name}</Text>
                  <Text>Series: {exercise.sets}</Text>
                  <Text>Repeticiones: {exercise.repetitions}</Text>
                  <Text>Peso: {exercise.weight} kg</Text>
                  <Text>Área: {exercise.area || 'No especificada'}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noRoutinesText}>
          No tienes rutinas asignadas. Contacta a tu entrenador para recibir una nueva.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF6347',
  },
  routineContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  exerciseContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noRoutinesText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default RoutineScreen;
