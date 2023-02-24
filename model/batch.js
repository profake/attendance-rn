import AsyncStorage from "@react-native-async-storage/async-storage";
import { v1 as uuidv1 } from "uuid";

export const getAllBatches = async () => {
  try {
    const value = await AsyncStorage.getItem("Batches");
    if (value !== null) {
      // console.log("Set value: " + value);
      return JSON.parse(value);
    } else {
      console.log("value not found");
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const addNewBatch = async (batchName) => {
  let id = uuidv1();
  let batch = {
    id,
    batchName,
    students: [],
  };
  try {
    let value = await AsyncStorage.getItem("Batches");
    value = JSON.parse(value);
    if (value) value.push(batch);
    else value = [batch];
    await AsyncStorage.setItem("Batches", JSON.stringify(value));
    return value;
  } catch (e) {
    console.log(e.message);
  }
};

export const addSingleStudent = async (studentId, batchId) => {
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

export const addMultipleStudents = async (
  studentIdRangeStart,
  studentIdRangeEnd,
  studentYearSession,
  batchId
) => {
  const studentsToAdd = [];
  for (let i = studentIdRangeStart; i <= studentIdRangeEnd; i++) {
    let lastDigit = "0";
    if (i < 100 && i != studentIdRangeStart) {
      if (i < 10) {
        lastDigit = lastDigit + "0" + i;
      } else lastDigit = lastDigit + i;
    } else lastDigit = i;
    const id = studentYearSession + "-" + lastDigit;
    studentsToAdd.push(id);
    console.log(studentsToAdd);
  }
  try {
    const value = await AsyncStorage.getItem("Batches");
    if (value !== null) {
      let parsedValues = JSON.parse(value);
      const index = parsedValues.findIndex((item) => item.id === batchId);
      studentsToAdd.forEach((student) => {
        parsedValues[index].students.push(student);
      });
      await AsyncStorage.setItem("Batches", JSON.stringify(parsedValues));
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteStudent = async (studentData, studentIdToDelete, batchId) => {
  let array = [...studentData]; // make a separate copy of the array
  const index = array.indexOf(studentIdToDelete);
  array.splice(index, 1);
  const value = await AsyncStorage.getItem("Batches");
  if (value !== null) {
    let parsedValues = JSON.parse(value);
    const iindex = parsedValues.findIndex((item) => item.id === batchId);
    parsedValues[iindex].students = array;
    await AsyncStorage.setItem("Batches", JSON.stringify(parsedValues));
    return array;
  }
};
