import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { getBatchesUnderCourse, getAllCourses } from "../../model/attendance";

const Attendance = ({ navigation }) => {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);

  const handleAddAttendance = (selectedCourse, selectedBatch) => {
    console.log("Course=" +  selectedCourse);
    console.log("Batch=" + selectedBatch);
    
    navigation.navigate("AttendanceAdd", { selectedCourse, selectedBatch });
  };

  const onCourseSelectionChange = async (courseId) => {
    //console.log(courseId);
    const data = await getBatchesUnderCourse(courseId);
    setBatches(data);
  };
 
  const getData = async () => {
    const data = await getAllCourses();
    setCourses(data);
  }

  useEffect(() => {
    getData();
  }, []);

  const courseOpen = () => {
    setCourseDropdownOpen(!courseDropdownOpen);
    setBatchDropdownOpen(false);
  };
  const batchOpen = () => {
    setCourseDropdownOpen(false);
    setBatchDropdownOpen(!batchDropdownOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropDownContainer}>
        <DropDownPicker
          style={styles.dropDown}
          placeholder="Select a Course"
          zIndex={3000}
          open={courseDropdownOpen}
          value={selectedCourse}
          items={courses}
          setOpen={courseOpen}
          setValue={setSelectedCourse}
          onChangeValue={(value) => onCourseSelectionChange(value)}
          setItems={setCourses}
        />
        <DropDownPicker
          style={styles.dropDown}
          placeholder="Select a Batch"
          zIndex={1000}
          open={batchDropdownOpen}
          value={selectedBatch}
          items={batches}
          setOpen={batchOpen}
          setValue={setSelectedBatch}
          setItems={setBatches}
          translation={{
            NOTHING_TO_SHOW: "No batches found",
          }}
        />
        <Text>Attendance overview will be shown here</Text>
        <Pressable
          style={styles.button}
          onPress={() => handleAddAttendance(selectedCourse, selectedBatch)}
        >
          <Text style={styles.textStyle}>Add Attendance</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "green",
  },
  batchesList: {
    width: "70%",
    height: "90%",
  },
  dropDown: {
    marginTop: 10,
  },
  dropDownContainer: {
    padding: 35,
    margin: 10,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  courseContainer: {
    flex: 1,
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
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
