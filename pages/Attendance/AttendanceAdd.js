import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import {
  getCourseName,
  getBatchData,
  getAttendance,
  saveAttendance,
} from "../../model/attendance";

const AttendanceAdd = ({ route }) => {
  const { selectedCourse: courseId, selectedBatch: batchId } = route.params;
  const [batchName, setBatchName] = useState();
  const [courseName, setCourseName] = useState();
  const [students, setStudents] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudentsBackup, setSelectedStudentsBackup] = useState([]);
  const [hasClickedItem, setHasClickedItem] = useState(false);
  const [date, setDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [dateTemp, setDateTemp] = useState(date);

  const handleDateSave = () => {
    // ask user if they want to change date and overwrite current changes
    // keep a flag to check if there are changes
    setDate(dateTemp);
    getAttendanceFromDate(dateTemp);
    setModalVisible(false);
  };

  const handleAttendanceSave = async () => {
    let attendance = {
      date,
      courseId,
      batchId,
      students: selectedStudents,
    };
    //console.log("Saving following: " + date + courseId + batchId + attendance.students);
    await saveAttendance(attendance);
    setHasClickedItem(false);
  };

  const handleCancelSelection = () => {
    setSelectedStudents(selectedStudentsBackup);
    setSelectedStudentsBackup([]);
    setHasClickedItem(false);
  };

  const handleStudentOnclick = (studentId) => {
    console.log(studentId);
    let array = [...selectedStudents]; // make a separate copy of the array
    if (!hasClickedItem) setSelectedStudentsBackup([...selectedStudents]);
    setHasClickedItem(true);
    const index = array.indexOf(studentId);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(studentId);
    }
    setSelectedStudents(array);
  };

  const onDateChange = (date) => {
    setDateTemp(moment(date).format("DD-MM-YYYY"));
  };
  const getData = async () => {
    const courseName = await getCourseName(courseId);
    setCourseName(courseName);

    const batchData = await getBatchData(batchId);
    setBatchName(batchData.batchName);
    setStudents(batchData.students);
  };

  const getAttendanceFromDate = async (date) => {
    const data = await getAttendance(date, courseId, batchId);
    setSelectedStudents(data);
  };

  useEffect(() => {
    getData();
    getAttendanceFromDate(date);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{courseName}</Text>
      <Text style={[styles.textStyle, { fontSize: 14 }]}>{batchName}</Text>
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
          <CalendarPicker onDateChange={onDateChange} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false);
              handleDateSave();
            }}
          >
            <Text>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateText}>Date: {date}</Text>
      </TouchableOpacity>
      {students && students.length !== 0 ? (
        <View style={{ width: "85%" }}>
          <FlatList
            style={{ width: "100%", height: "65%" }}
            data={students}
            extraData={selectedStudents}
            keyExtractor={(student) => student}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleStudentOnclick(item);
                }}
                style={
                  selectedStudents?.includes(item)
                    ? [styles.courseContainer, styles.selected]
                    : [styles.courseContainer]
                }
              >
                <Text style={styles.courseTextStyle}>{item}</Text>
              </TouchableOpacity>
            )}
          ></FlatList>

          {hasClickedItem && (
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "grey" }]}
                onPress={handleCancelSelection}
              >
                <Text style={styles.dateText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAttendanceSave}
                style={styles.button}
              >
                <Text style={styles.dateText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.text}>No students found under this batch.</Text>
      )}
    </View>
  );
};

export default AttendanceAdd;

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "green",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    justifyContent: "center",
    alignSelf: "center",
    width: 150,
    margin: 8,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  dateText: {
    color: "white",
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: "column",
    backgroundColor: "#2196F3",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginVertical: 12,
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
  textStyle: {
    fontFamily: "Jost_400Regular",
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  courseTextStyle: {
    fontFamily: "Jost_400Regular",
    color: "white",
    fontWeight: "bold",
  },
  modalView: {
    height: "95%",
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
  },
});
