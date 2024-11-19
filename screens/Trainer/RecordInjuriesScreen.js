import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RecordInjuriesScreen = ({ route }) => {
  const { trainerId } = route.params || {}; // Asegúrate de recibir trainerId desde la navegación
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [injuryDescription, setInjuryDescription] = useState('');
  const [trainerNotes, setTrainerNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainerId) {
      Alert.alert('Error', 'El ID del entrenador no está disponible.');
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const trainerDoc = await getDoc(doc(db, 'usuarios', trainerId));
        if (trainerDoc.exists()) {
          const trainerData = trainerDoc.data();
          const studentIds = trainerData.listaDeAlumnos || [];
          const studentDocs = await Promise.all(
            studentIds.map((id) => getDoc(doc(db, 'usuarios', id)))
          );
          const studentList = studentDocs
            .filter((doc) => doc.exists())
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setStudents(studentList);
        } else {
          Alert.alert('Error', 'No se encontraron datos del entrenador.');
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
        Alert.alert('Error', 'No se pudieron cargar los alumnos.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [trainerId]);

  const handleRecordInjury = async () => {
    if (!selectedStudent || !injuryDescription.trim()) {
      Alert.alert('Error', 'Selecciona un alumno y proporciona una descripción de la lesión.');
      return;
    }

    const injuryData = {
      description: injuryDescription,
      date: new Date(),
      status: 'Activa', // Estado inicial de la lesión
      trainerNotes: trainerNotes.trim(),
    };

    try {
      await addDoc(collection(db, 'usuarios', selectedStudent, 'injuries'), injuryData);
      Alert.alert('Éxito', 'La lesión ha sido registrada.');
      setInjuryDescription(''); // Limpia el campo de descripción después de registrar
      setTrainerNotes(''); // Limpia el campo de notas del entrenador
    } catch (error) {
      console.error('Error registrando lesión:', error);
      Alert.alert('Error', 'No se pudo registrar la lesión.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Cargando alumnos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Lesión</Text>
      {students.length === 0 ? (
        <Text style={styles.noStudentsText}>No hay alumnos asignados.</Text>
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Ionicons name="people-outline" size={20} color="#FF6347" style={styles.pickerIcon} />
            <Picker
              selectedValue={selectedStudent}
              onValueChange={(value) => setSelectedStudent(value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un alumno" value="" />
              {students.map((student) => (
                <Picker.Item
                  key={student.id}
                  label={student.nombre || student.email}
                  value={student.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="clipboard-outline" size={20} color="#FF6347" />
            <TextInput
              style={styles.input}
              placeholder="Descripción de la lesión"
              value={injuryDescription}
              onChangeText={setInjuryDescription}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="create-outline" size={20} color="#FF6347" />
            <TextInput
              style={styles.input}
              placeholder="Notas del entrenador"
              value={trainerNotes}
              onChangeText={setTrainerNotes}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.recordButton} onPress={handleRecordInjury}>
            <Text style={styles.buttonText}>Registrar Lesión</Text>
          </TouchableOpacity>
        </>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF6347',
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    color: '#333',
  },
  pickerIcon: {
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  noStudentsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  recordButton: {
    marginTop: 30,
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecordInjuriesScreen;
