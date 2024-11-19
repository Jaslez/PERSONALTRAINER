import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AssignTrainerScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));

        const trainersList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role === 'entrenador');

        const studentsList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role === 'alumno' && user.assignedTrainer === null);

        setTrainers(trainersList);
        setStudents(studentsList);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos.');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignTrainer = async () => {
    if (!selectedTrainer || !selectedStudent) {
      Alert.alert('Error', 'Selecciona un entrenador y un alumno.');
      return;
    }

    try {
      await updateDoc(doc(db, 'usuarios', selectedStudent), {
        assignedTrainer: selectedTrainer,
      });

      await updateDoc(doc(db, 'usuarios', selectedTrainer), {
        listaDeAlumnos: arrayUnion(selectedStudent),
      });

      Alert.alert('Asignación exitosa', 'El alumno ha sido asignado al entrenador.');
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== selectedStudent));
      setSelectedStudent('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la asignación.');
      console.error('Error assigning trainer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Alumno a Entrenador</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Ionicons name="person-outline" size={20} color="#FF6347" style={styles.pickerIcon} />
            <Picker
              selectedValue={selectedTrainer}
              onValueChange={(itemValue) => setSelectedTrainer(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un entrenador" value="" />
              {trainers.map((trainer) => (
                <Picker.Item key={trainer.id} label={trainer.nombre || trainer.email} value={trainer.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="school-outline" size={20} color="#FF6347" style={styles.pickerIcon} />
            <Picker
              selectedValue={selectedStudent}
              onValueChange={(itemValue) => setSelectedStudent(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un alumno" value="" />
              {students.map((student) => (
                <Picker.Item key={student.id} label={student.nombre || student.email} value={student.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.assignButton} onPress={handleAssignTrainer}>
            <Text style={styles.buttonText}>Asignar Alumno</Text>
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
  assignButton: {
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

export default AssignTrainerScreen;
