import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { React, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BatchInfo = ({ route, navigation }) => {
  const [studentData, setStudentData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentId, onChangeStudentId] = useState();
  const { batchId, batchName } = route.params;

  const handleAddSingleStudent = async (studentId) => {
    try {
      const value = await AsyncStorage.getItem("Batches");
      if (value !== null) {
        let parsedValues = JSON.parse(value);
        const index = parsedValues.findIndex((item) => item.id === batchId);
        parsedValues[index].students.push(studentId);
        await AsyncStorage.setItem("Batches", JSON.stringify(parsedValues));
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Batches");
      if (value !== null) {
        let batchInfo = JSON.parse(value);
        batchInfo = batchInfo.filter((item) => item.id === batchId);
        setStudentData(batchInfo[0].students);
        console.log("Set follwing: " + batchInfo[0].students);
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, [studentData?.length]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.textHeader}>Add Student</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeStudentId}
            value={studentId}
            placeholder="Student ID"
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleAddSingleStudent(studentId);
              }}
            >
              <Text style={styles.textStyle}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text style={styles.textHeader}>{batchName}</Text>
      {studentData && studentData.length !== 0 ? (
        <FlatList
          style={{ width: "100%", height: "80%" }}
          data={studentData}
          keyExtractor={(student) => student}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseContainer}>
              <Text style={styles.courseTextStyle}>{item}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No students found under this batch.</Text>
      )}
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Add Students</Text>
      </Pressable>
    </View>
  );
};

export default BatchInfo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  courseContainer: {
    flexDirection: "column",
    backgroundColor: "#333333",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  smallText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#b9b9b9",
  },
  textHeader: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 10,
  },
  button: {
    width: "50%",
    margin: 8,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#161f26",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  courseTextStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
});
