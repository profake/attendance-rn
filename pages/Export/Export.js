import { Button, StyleSheet, Text, View } from "react-native";
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

const Export = () => {
  let studentList = [];
  let attendanceInfo = [];
  const studentIdMap = new Map();
  let exportFileName = "fileName";

  const handleAddStudentIdsToSheet = async (worksheet) => {
    let batchInfo = await getAllBatches();
    if (batchInfo.length > 0) {
      batchInfo = batchInfo.filter((item) => item.id === batchToExportFor);
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
          value[i].batchId === batchToExportFor &&
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

  const [batchToExportFor, setBatchToExportFor] = useState(
    "6e7435d0-b44b-11ed-b17d-931fe2eac9f8"
  ); // CSE 47
  const [startDate, setStartDate] = useState(" 18-02-2023");
  const [endDate, setEndDate] = useState("24-02-2023");

  const doStuff = async () => {
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
      <Button title="Export" onPress={() => doStuff()}></Button>
    </View>
  );
};

export default Export;

const styles = StyleSheet.create({});
