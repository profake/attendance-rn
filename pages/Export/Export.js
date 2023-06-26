import { Alert, Button, StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { getAllBatches } from "../../model/batch";
import { getAttendanceData } from "../../model/attendance";
import { Modal } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { TouchableOpacity } from "react-native";
import { getCourseName } from "../../model/course";
import { getBatchName } from "../../model/batch";

const Export = ({ route }) => {
  const { selectedCourse, selectedBatch } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [batchName, setBatchName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const courseName = await getCourseName(selectedCourse);
      setCourseName(courseName);

      const batchName = await getBatchName(selectedBatch);
      setBatchName(batchName);
    };
    getData();
  }, []);

  let studentList = [];
  let attendanceInfo = [];
  const studentIdMap = new Map();
  let exportFileName = "fileName";

  const handleAddStudentIdsToSheet = async (worksheet) => {
    let batchInfo = await getAllBatches();
    if (batchInfo.length > 0) {
      batchInfo = batchInfo.filter((item) => item.id === selectedBatch);
      console.log(batchInfo[0].students);
      studentList = batchInfo[0]?.students;
      for (let i = 2; i < studentList.length + 2; i++) {
        let orig = "A" + i; // Starts from A2
        XLSX.utils.sheet_add_aoa(worksheet, [[studentList[i - 2]]], {
          origin: orig,
        });
        studentIdMap.set(studentList[i - 2], orig);
        // console.log(studentIdMap.get(studentList[i-2]), studentList[i-2]);
      }
    } else {
      console.log("Error: No batches found");
    }
  };

  const addAttendanceDataToSheet = async (worksheet) => {
    const value = await getAttendanceData();
    if (value !== null) {
      for (let i = 0; i < value.length; i++) {
        if (
          value[i].batchId === selectedBatch &&
          isInDateRange(value[i].date)
        ) {
          let data = {
            date: value[i].date,
            students: value[i].students,
          };
          attendanceInfo.push(data);
        }
      }
      attendanceInfo.sort((a, b) => a.date > b.date);
      // Write the dates row by row like A1, B1, C1, etc...
      let i = 66;
      attendanceInfo.forEach((element) => {
        let orig = String.fromCharCode(i) + "1"; // B1, C1, D1...
        XLSX.utils.sheet_add_aoa(worksheet, [[element.date]], { origin: orig });
        orig = orig.slice(0, -1);
        element.students.forEach((student) => {
          // console.log(student);
          let cellToAddTo = studentIdMap.get(student);
          console.log(student + ": " + cellToAddTo);
          cellToAddTo = cellToAddTo.slice(1);
          console.log(cellToAddTo);
          console.log(orig);
          cellToAddTo = orig + cellToAddTo;
          console.log(cellToAddTo);
          XLSX.utils.sheet_add_aoa(worksheet, [["P"]], { origin: cellToAddTo });
        });
        i++;
      });
    }
  };

  const isInDateRange = (date) => {
    const dateVal = moment(date, "DD-MM-YYYY").valueOf();
    const startDateVal = moment(startDate, "DD-MM-YYYY").valueOf();
    const endDateVal = moment(endDate, "DD-MM-YYYY").valueOf();
    return dateVal >= startDateVal && dateVal <= endDateVal;
  };

  const onDateChange = (date, type) => {
    console.log(
      "Date: " + moment(date).format("DD-MM-YYYY"),
      " | Type: " + type
    );
    type == "START_DATE"
      ? setStartDate(moment(date).format("DD-MM-YYYY"))
      : setEndDate(moment(date).format("DD-MM-YYYY"));
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const exportData = async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    let workbook = XLSX.utils.book_new();

    // Student IDs serially on the first column
    let worksheet = XLSX.utils.aoa_to_sheet([["ID"]], { origin: "A1" });

    await handleAddStudentIdsToSheet(worksheet);
    await addAttendanceDataToSheet(worksheet);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    try {
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        exportFileName,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <View>
      <View style={styles.batchInfoContainer}>
        <Text style={styles.courseText}>{courseName}</Text>
        <Text style={styles.batchText}>{batchName}</Text>
      </View>
      <View style={styles.container}>
      {startDate && endDate ? (
        <View>
          <Text style={[styles.textStyle, { color: "black" }]}>
            Exporting data from {startDate} to {endDate}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={[styles.textStyle, { color: "black" }]}>
            Select dates to Export
          </Text>
        </View>
      )}
      <Pressable
        style={styles.button}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Select Dates</Text>
      </Pressable>

      {startDate && endDate && (
        <Pressable
          style={styles.button}
          onPress={() => {
            exportData();
          }}
        >
          <Text style={styles.textStyle}>Export</Text>
        </Pressable>
      )}
      </View>

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
          <CalendarPicker
            allowRangeSelection={true}
            allowBackwardRangeSelect={true}
            onDateChange={onDateChange}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Text>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "green",
  },
  container: {
    width: "100%",    
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    color: "white",
    fontSize: 16,
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
  batchInfoContainer: {
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 4,
  },
  courseText: {
    fontFamily: "Jost_400Regular",
    fontSize: 30,
  },
  batchText: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
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
});
