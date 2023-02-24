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
import Dialog from "react-native-dialog";
import { addMultipleStudents, addSingleStudent, deleteStudent, getAllBatches } from "../../model/batch";

const BatchInfo = ({ route, navigation }) => {
  const [studentData, setStudentData] = useState([]);
  const [studentYearSession, onChangeYearSession] = useState("");
  const [studentIdRangeStart, onChangeStudentIdRangeStart] = useState("");
  const [studentIdRangeEnd, onChangeStudentIdRangeEnd] = useState("");
  const [singleStudentModalVisible, setSingleStudentModalVisible] =
    useState(false);
  const [multipleStudentModalVisible, setMultipleStudentModalVisible] =
    useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [studentId, onChangeStudentId] = useState();
  const [studentIdToDelete, setStudentIdToDelete] = useState();

  const { batchId, batchName } = route.params;

  const getData = async () => {
    let data = await getAllBatches();
    data = data.filter((item) => item.id === batchId);
    setStudentData(data[0]?.students);
  };

  const handleAddSingleStudent = async (studentId) => {
    addSingleStudent(studentId, batchId);
    setStudentData(null); // very bad solution but it works for now
  };

  const handleAddMultipleStudents = async (studentIdRangeStart, studentIdRangeEnd, studentYearSession, batchId) => {
    addMultipleStudents(studentIdRangeStart, studentIdRangeEnd, studentYearSession, batchId);
    setStudentData(null); // very bad solution but it works for now
  };

  const handleLongPress = (studentId) => {
    console.log(studentId);
    setStudentIdToDelete(studentId);
    setDeleteDialogVisible(true);
  };

  const handleStudentDelete = async () => {
    setStudentData(deleteStudent(studentData, studentIdToDelete, batchId));
    setStudentIdToDelete("");
    setDeleteDialogVisible(false);
  };

  useEffect(() => {
    getData();
  }, [studentData?.length]);

  return (
    <View style={styles.container}>
      <View>
        <Dialog.Container visible={deleteDialogVisible}>
          <Dialog.Title>Delete ID</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this ID? You cannot undo this action.
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={() => setDeleteDialogVisible(false)}
          />
          <Dialog.Button label="Delete" onPress={handleStudentDelete} />
        </Dialog.Container>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={singleStudentModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSingleStudentModalVisible(!singleStudentModalVisible);
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
              onPress={() =>
                setSingleStudentModalVisible(!singleStudentModalVisible)
              }
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                setSingleStudentModalVisible(!singleStudentModalVisible);
                handleAddSingleStudent(studentId);
              }}
            >
              <Text style={styles.textStyle}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={multipleStudentModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setMultipleStudentModalVisible(!multipleStudentModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.textHeader}>Add Students</Text>
          <Text style={styles.text}>Year, session and department</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeYearSession}
            value={studentYearSession}
            placeholder="e.g: 191-115"
          />
          <Text style={styles.text}>Range Start</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeStudentIdRangeStart}
            value={studentIdRangeStart}
            placeholder="e.g: 101"
          />
          <Text style={styles.text}>Range End</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeStudentIdRangeEnd}
            value={studentIdRangeEnd}
            placeholder="e.g: 140"
          />
          {studentYearSession !== "" &&
            studentIdRangeStart !== "" &&
            studentIdRangeEnd !== "" && (
              <View style={{ justifyContent: "center" }}>
                <Text style={styles.text}>
                  The following IDs will be added:
                </Text>
                <Text style={styles.textHeader}>
                  {studentYearSession}-{studentIdRangeStart} to{" "}
                  {studentYearSession}-{studentIdRangeEnd}
                </Text>
              </View>
            )}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                setMultipleStudentModalVisible(!multipleStudentModalVisible)
              }
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                setMultipleStudentModalVisible(!multipleStudentModalVisible);
                handleAddMultipleStudents(studentIdRangeStart, studentIdRangeEnd, studentYearSession, batchId);
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
            <TouchableOpacity
              style={styles.courseContainer}
              onLongPress={() => handleLongPress(item)}
            >
              <Text style={styles.courseTextStyle}>{item}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No students found under this batch.</Text>
      )}
      <View
        style={{ flexDirection: "row", width: "90%", justifyContent: "center" }}
      >
        <Pressable
          style={styles.button}
          onPress={() => setSingleStudentModalVisible(true)}
        >
          <Text style={styles.textStyle}>Add Student</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setMultipleStudentModalVisible(true)}
        >
          <Text style={styles.textStyle}>Add Multiple Students</Text>
        </Pressable>
      </View>
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
