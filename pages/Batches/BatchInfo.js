import {
  Alert,
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
import {
  addMultipleStudents,
  addSingleStudent,
  deleteStudent,
  getAllBatches,
} from "../../model/batch";
import { FloatingAction } from "react-native-floating-action";

const fabActions = [
  {
    text: "Add Single Student",
    icon: require("../../resources/icons/attendance_icon.png"),
    name: "bt_single",
    color: "#2196F3",
    position: 3,
  },
  {
    text: "Add Multiple Students",
    icon: require("../../resources/icons/batch_icon.png"),
    name: "bt_mult",
    color: "#2196F3",
    position: 2,
  },
  {
    text: "Take Attendance",
    icon: require("../../resources/icons/attendance_icon.png"),
    name: "bt_attendance_add",
    color: "#2196F3",
    position: 4,
  },
  {
    text: "Export Attendance",
    icon: require("../../resources/icons/attendance_icon.png"),
    name: "bt_attendance_export",
    color: "#2148f3",
    position: 1,
  },
];
const fabActionsReduced = [
  {
    text: "Add Single Student",
    icon: require("../../resources/icons/attendance_icon.png"),
    name: "bt_single",
    color: "#2196F3",
    position: 2,
  },
  {
    text: "Add Multiple Students",
    icon: require("../../resources/icons/batch_icon.png"),
    name: "bt_mult",
    color: "#2196F3",
    position: 1,
  },
];
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

  const { courseId, courseName, batchId, batchName } = route.params;

  const getData = async () => {
    let data = await getAllBatches();
    data = data.filter((item) => item.id === batchId);
    setStudentData(data[0]?.students);
  };

  const handleAddSingleStudent = async (studentId) => {
    addSingleStudent(studentId, batchId);
    setStudentData(null); // very bad solution but it works for now
  };

  const handleAddMultipleStudents = async (
    studentIdRangeStart,
    studentIdRangeEnd,
    studentYearSession,
    batchId
  ) => {
    addMultipleStudents(
      studentIdRangeStart,
      studentIdRangeEnd,
      studentYearSession,
      batchId
    );
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
    <View style={styles.bigContainer}>
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
                handleAddMultipleStudents(
                  studentIdRangeStart,
                  studentIdRangeEnd,
                  studentYearSession,
                  batchId
                );
              }}
            >
              <Text style={styles.textStyle}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* <Text style={styles.textHeader}>{batchName}</Text> */}

      <View style={styles.studentInfoContainer}>
        <Text style={styles.dateText}>{batchName}</Text>
        <Text style={styles.timeText}>{studentData?.length} students</Text>
        {courseName && <Text style={styles.timeText}>{courseName}</Text>}
      </View>

      {studentData && studentData?.length !== 0 ? (
          <View style={{paddingRight: 100}}>
          <FlatList
          numColumns={2}
          style={{ width: "100%", height: "70%"}}
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
        </View>
      ) : (
        <Text style={styles.noStudentText}>No students found under this batch. Tap the button below to add.</Text>
      )}
      {studentData?.length > 0  && <View
        style={{ flexDirection: "row", width: "90%", justifyContent: "center" }}
      >
      </View>}
      <FloatingAction
        color="#2196F3"
        
        actions={courseId ? fabActions : fabActionsReduced}
        onPressItem={(name) => {
          if (name == "bt_single")
             setSingleStudentModalVisible(true)
          else if (name == "bt_mult")
             setMultipleStudentModalVisible(true);
          else if (name == "bt_attendance_add") {
            const selectedCourse = courseId;
            const selectedBatch = batchId;
            navigation.navigate("AttendanceAdd", {
              selectedCourse,
              selectedBatch,
            });
          } else {            
            const selectedCourse = courseId;
            const selectedBatch = batchId;
            navigation.navigate("Export", {
              selectedCourse,
              selectedBatch,
            });
          }
        }}
      />

      <View></View>
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
  bigContainer: {
    paddingTop: 20,
    display: "flex",
    backgroundColor: "#f7f7f7",
    height: "100%",
  },
  courseContainer: {
    flexDirection: "row",
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
  noStudentText: {
    padding: 10,
    alignContent: 'center',
    fontSize: 16,
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
  studentInfoContainer: {
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 4,
  },
  dateText: {
    fontFamily: "Jost_400Regular",
    fontSize: 30,
  },
  timeText: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },
});
