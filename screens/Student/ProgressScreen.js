import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLine, VictoryTheme } from 'victory-native';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Importar imagen de fondo motivadora para el progreso
import backgroundImage from '../../assets/motivacion.png'; // Asegúrate de tener una imagen motivadora de fondo

const ProgressScreen = ({ studentId }) => {
  const [progressData, setProgressData] = useState([]);

  // Fetch the student's progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progressQuery = query(
          collection(db, 'users', studentId, 'progress'),
          where('date', '>=', new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000)) // Últimas 4 semanas
        );
        const progressSnapshot = await getDocs(progressQuery);
        const data = {};

        progressSnapshot.forEach((doc) => {
          const progress = doc.data();
          const week = `Semana ${getWeekNumber(progress.date.toDate())}`; // Convierte Timestamp a Date

          if (!data[week]) {
            data[week] = { semana: week, Piernas: 0, Cardio: 0, Fuerza: 0 }; // Inicializa áreas
          }
          data[week][progress.area] += progress.volume; // Suma al volumen de la semana y área correspondiente
        });

        // Convierte el objeto en un array y agrega totalVolume
        const processedData = Object.values(data).map((weekData) => ({
          ...weekData,
          totalVolume: weekData.Piernas + weekData.Cardio + weekData.Fuerza,
        }));

        setProgressData(processedData);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Progreso del Alumno</Text>

        {progressData.length > 0 ? (
          <View>
            <Text style={styles.chartTitle}>Volumen de Entrenamiento Semanal</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
              <VictoryBar
                data={progressData}
                x="semana"
                y="totalVolume"
                style={{ data: { fill: '#FF6347' } }}
              />
            </VictoryChart>

            <Text style={styles.chartTitle}>Progreso en Cardio</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
              <VictoryLine
                data={progressData}
                x="semana"
                y="Cardio"
                style={{ data: { stroke: '#FFD700', strokeWidth: 3 } }}
              />
            </VictoryChart>

            <Text style={styles.chartTitle}>Progreso en Fuerza</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
              <VictoryLine
                data={progressData}
                x="semana"
                y="Fuerza"
                style={{ data: { stroke: '#3CB371', strokeWidth: 3 } }}
              />
            </VictoryChart>
          </View>
        ) : (
          <Text style={styles.noDataText}>
            No hay datos de progreso para las últimas semanas. Completa tus rutinas para comenzar a ver tus estadísticas.
          </Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

// Helper function to get week number
const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Agrega una superposición para que el contenido sea legible sobre el fondo
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#FFD700', // Color vibrante para los títulos de los gráficos
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default ProgressScreen;
