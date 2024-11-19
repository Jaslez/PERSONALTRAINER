import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { collection, getDoc, doc, addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ManageRoutinesScreen = ({ route, navigation }) => {
  const { trainerId } = route.params || {};
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', repetitions: '', weight: '', area: '' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trainerId) {
      setError('El ID del entrenador no está disponible.');
      return;
    }

    const fetchStudents = async () => {
      try {
        const trainerDoc = await getDoc(doc(db, 'usuarios', trainerId));
        if (trainerDoc.exists()) {
          const studentIds = trainerDoc.data().listaDeAlumnos || [];
          const studentDocs = await Promise.all(
            studentIds.map((id) => getDoc(doc(db, 'usuarios', id)))
          );
          setStudents(
            studentDocs
              .filter((doc) => doc.exists())
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        } else {
          setError('No se encontró información del entrenador.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('No se pudieron cargar los estudiantes.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [trainerId]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', repetitions: '', weight: '', area: '' }]);
  };

  const handleSaveRoutine = async () => {
    if (!selectedStudent || !routineName.trim()) {
      Alert.alert('Error', 'Seleccione un alumno y asigne un nombre a la rutina.');
      return;
    }
  
    try {
      await addDoc(collection(db, 'usuarios', selectedStudent, 'routine'), {
        routineName,
        exercises,
        startDate: new Date(),
      });
  
      Alert.alert('Éxito', 'Rutina creada con éxito.');
      setRoutineName('');
      setExercises([{ name: '', sets: '', repetitions: '', weight: '', area: '' }]);
      navigation.goBack(); // Regresa a la pantalla anterior después de guardar
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error', 'No se pudo guardar la rutina.');
    }
  };
  

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nueva Rutina</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Ionicons name="people-outline" size={20} color="#333" />
            <Picker
              selectedValue={selectedStudent}
              onValueChange={setSelectedStudent}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un alumno" value="" />
              {students.map((student) => (
                <Picker.Item key={student.id} label={student.nombre || student.email} value={student.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#333" />
            <TextInput
              style={styles.input}
              placeholder="Nombre de la Rutina"
              value={routineName}
              onChangeText={setRoutineName}
              placeholderTextColor="#aaa"
            />
          </View>

          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseContainer}>
              <Text style={styles.exerciseTitle}>Ejercicio {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del Ejercicio"
                value={exercise.name}
                onChangeText={(text) => {
                  const updatedExercises = [...exercises];
                  updatedExercises[index].name = text;
                  setExercises(updatedExercises);
                }}
                placeholderTextColor="#aaa"
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Series"
                  keyboardType="numeric"
                  value={exercise.sets}
                  onChangeText={(text) => {
                    const updatedExercises = [...exercises];
                    updatedExercises[index].sets = text;
                    setExercises(updatedExercises);
                  }}
                  placeholderTextColor="#aaa"
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Repeticiones"
                  keyboardType="numeric"
                  value={exercise.repetitions}
                  onChangeText={(text) => {
                    const updatedExercises = [...exercises];
                    updatedExercises[index].repetitions = text;
                    setExercises(updatedExercises);
                  }}
                  placeholderTextColor="#aaa"
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Peso (kg)"
                  keyboardType="numeric"
                  value={exercise.weight}
                  onChangeText={(text) => {
                    const updatedExercises = [...exercises];
                    updatedExercises[index].weight = text;
                    setExercises(updatedExercises);
                  }}
                  placeholderTextColor="#aaa"
                />
              </View>
              {/* Campo para ingresar el área */}
              <TextInput
                style={styles.input}
                placeholder="Área (e.g., Piernas, Pecho, etc.)"
                value={exercise.area}
                onChangeText={(text) => {
                  const updatedExercises = [...exercises];
                  updatedExercises[index].area = text;
                  setExercises(updatedExercises);
                }}
                placeholderTextColor="#aaa"
              />  
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Añadir Ejercicio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoutine}>
            <Ionicons name="save-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Guardar Rutina</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginTop: 10,
    fontSize: 16,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default ManageRoutinesScreen;
