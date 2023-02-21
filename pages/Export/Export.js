import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";



const Export = () => {
  let studentList = [];
  let attendanceInfo = [];

  const addStudentIdsFromBatch = async(worksheet) => {
    try {
      const value = await AsyncStorage.getItem("Batches");
      if (value !== null) {
        let batchInfo = JSON.parse(value);
        batchInfo = batchInfo.filter((item) => item.id === batchToExportFor);
        studentList = batchInfo[0]?.students;
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  
    for (let i = 2; i <= studentList.length;i++) {
      let orig = 'A' + i;
      XLSX.utils.sheet_add_aoa(worksheet, [[studentList[i]]], {origin: orig});
    }
  }

  const addDatesFromAttendance = async (worksheet) => {
    let value = await AsyncStorage.getItem("Attendance");
    value = JSON.parse(value);
    for (let i = 0; i < value.length; i++) {
      if (value[i].batchId === batchToExportFor && isInDateRange(value[i].date)) {
        let data = {
          date: value[i].date,
          students: value[i].students
        };
        attendanceInfo.push(data);
      }
    }
    attendanceInfo.sort((a, b) => a.date > b.date);
    // Write the dates row by row like A1, B1, C1, etc...
    let i = 66;
    attendanceInfo.forEach(element => {
      let orig = String.fromCharCode(i) + '1'; // B1, C1, D1...
      XLSX.utils.sheet_add_aoa(worksheet, [[element.date]], {origin: orig});
      element.students.forEach(student => {
        // loop through entire student column and find the row where we can add P
        // this can be improved by mapping the info beforehand; I might do that later
        for (let j = 2; j < studentList.length;j++) {
          let origStudentCell = 'A' + j; // A2, A3, A4...
          let cellValue = worksheet[origStudentCell].v; // 191-115-001
          console.log(worksheet[origStudentCell].v);
          if (cellValue === student) {
              orig = orig.slice(0,-1);
              orig = orig + j; // B3, C7 etc...
              XLSX.utils.sheet_add_aoa(worksheet, [['P']], {origin: orig});
          }
        }
      });
      i++;
    });
  }

  const isInDateRange = date => {
    const dateVal = moment(date, "DD-MM-YYYY").valueOf();
    const startDateVal = moment(startDate, "DD-MM-YYYY").valueOf();
    const endDateVal = moment(endDate, "DD-MM-YYYY").valueOf();
    return dateVal >= startDateVal && dateVal <= endDateVal;
  }

  const [batchToExportFor, setBatchToExportFor] = useState(
"7188c240-b1ad-11ed-a156-6b684ca5de68"
  ); // CSE 47
  const [startDate, setStartDate] = useState(" 18-02-2023");
  const [endDate, setEndDate] = useState("21-02-2023");

  const doStuff = async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    
    let workbook = XLSX.utils.book_new();

    // Student IDs serially on the first column
    let worksheet = XLSX.utils.aoa_to_sheet([['ID']], {origin: 'A1'});
    
    await addStudentIdsFromBatch(worksheet);
    await addDatesFromAttendance(worksheet);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    try {
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        "fileName",
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
