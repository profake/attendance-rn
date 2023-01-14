import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

const AttendanceAdd = ({ route }) => {
  const { selectedCourse: courseId, selectedBatch: batchId } = route.params;
  const [batchName, setBatchName] = useState();
  const [courseName, setCourseName] = useState();
  const [students, setStudents] = useState();
  const [indexOfCourse, setIndexOfCourse] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [date, setDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [dateTemp, setDateTemp] = useState();

  const handleDateSave = () => {
    // ask user if they want to change date and overwrite current changes
    // keep a flag to check if there are changes
    setDate(dateTemp);
    getAttendance(dateTemp);
    setModalVisible(false);
  };

  const handleAttendanceSave = async () => {
    let attendance = {
      date,
      courseId,
      batchId,
      students: selectedStudents,
    };
    // console.log("Saving following: " + date + courseId + batchId + attendance.students);
    let value = await AsyncStorage.getItem("Attendance");
    value = JSON.parse(value);
    if (value) {
      console.log(value);
      const index = value.findIndex((item) => item.date === attendance.date);
      if (index !== -1) {
        //console.log(item);
        value[index] = attendance;
      } else {
        value.push(attendance);
      }
    } else {
      value = [attendance];
    }
    await AsyncStorage.setItem("Attendance", JSON.stringify(value));
  };

  const handleStudentOnclick = (studentId) => {
    console.log(studentId);
    var array = [...selectedStudents]; // make a separate copy of the array
    var index = array.indexOf(studentId);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(studentId);
    }
    setSelectedStudents(array);
  };

  const onDateChange = (date) => {
    // console.log(date
    setDateTemp(moment(date).format("DD-MM-YYYY"));
  };

  const getData = async () => {
    // console.log(selectedStudents);
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        let courseInfo = JSON.parse(value);
        const index = courseInfo.findIndex((item) => item.id === courseId);
        setIndexOfCourse(index);
        setCourseName(courseInfo[index].courseName);
        courseInfo[index].batches.forEach((batch) => {
          if (batch.id === batchId) {
            setBatchName(batch.batchName);
            setStudents(batch.students);
          }
        });
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAttendance = async(date) => {
    try {
      const value = await AsyncStorage.getItem("Attendance");
      if (value !== null) {
        let attendance = JSON.parse(value);
        const index = attendance.findIndex((item) => item.date === date && item.courseId === courseId && item.batchId === batchId);
        if (index !== -1) {
          console.log("Got attendance for date: " + attendance[index].date);
          setSelectedStudents(attendance[index].students);
        } else {
          setSelectedStudents([]);
          console.log("No attendance for date: " + date);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getData();
    getAttendance(date);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{courseName}</Text>
      <Text style={styles.textStyle}>{batchName}</Text>
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
        <Text>Date: {date}</Text>
      </TouchableOpacity>
      {students && students.length !== 0 ? (
        <View style={{ width: "100%" }}>
          <FlatList
            style={{ width: "100%", height: "60%" }}
            data={students}
            extraData={selectedStudents}
            keyExtractor={(student) => student}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleStudentOnclick(item);
                }}
                style={
                  selectedStudents.includes(item)
                    ? [styles.courseContainer, styles.selected]
                    : [styles.courseContainer]
                }
              >
                <Text style={styles.courseTextStyle}>{item}</Text>
              </TouchableOpacity>
            )}
          ></FlatList>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAttendanceSave}
          >
            <Text>Save Attendance</Text>
          </TouchableOpacity>
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
    paddingTop: 20,
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
  datePickerContainer: {
    flexDirection: "column",
    backgroundColor: "#8d93f6",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 8,
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
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  courseTextStyle: {
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
