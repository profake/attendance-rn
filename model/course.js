import AsyncStorage from "@react-native-async-storage/async-storage";
import { v1 as uuidv1 } from "uuid";

export const getAllCourses = async () => {
  try {
    const value = await AsyncStorage.getItem("Courses");
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

export const getDetailedCourseData = async (courseId) => {
  try {
    const value = await AsyncStorage.getItem("Courses");
    if (value !== null) {
      let courseInfo = JSON.parse(value);
      courseInfo = courseInfo.filter((item) => item.id === courseId);
      const data = {
        batchesArray: [],
        selectedBatchesArray: [],
      };
      let parsedBatches = await AsyncStorage.getItem("Batches");
      parsedBatches = JSON.parse(parsedBatches);
      courseInfo[0]?.batches.forEach((item) => {
        try {
          const index = parsedBatches.findIndex((batch) => batch.id === item);
          if (index !== -1) {
            data.batchesArray.push([parsedBatches[index].id, parsedBatches[index].batchName]);
            data.selectedBatchesArray.push(parsedBatches[index].id);
            // console.log("Pushing batch " + parsedBatches[index].batchName);
            // console.log("Pushing id " + parsedBatches[index].id);
          }
        } catch (e) {
          console.error(e);
          return null;
        }
      });
      return data;
    } else {
      console.log("Error: No batches found");
      return null;
    }
  } catch (e) {
    console.error(e);
  }
};

export const addCourse = async (courseName, courseCode) => {
  let id = uuidv1();
  let course = {
    id,
    courseName,
    courseCode,
    batches: [],
  };
  try {
    let value = await AsyncStorage.getItem("Courses");
    value = JSON.parse(value);
    if (value) value.push(course);
    else value = [course];
    await AsyncStorage.setItem("Courses", JSON.stringify(value));
    return value;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const addSelectedBatchesToCourse = async (courseId, batchIds) => {
  try {
    const value = await AsyncStorage.getItem("Courses");
    if (value !== null) {
      let parsedValues = JSON.parse(value);
      const index = parsedValues.findIndex((item) => item.id === courseId);
      parsedValues[index].batches = batchIds;
      await AsyncStorage.setItem("Courses", JSON.stringify(parsedValues));
    }
  } catch (e) {
    console.error(e);
  }
};

export const addBatchesToCourse = async () => {
  try {
    const value = await AsyncStorage.getItem("Batches");
    if (value !== null) {
      let parsedValues = JSON.parse(value);
      console.log(parsedValues);
      return parsedValues;
      // await AsyncStorage.setItem("Batches", JSON.stringify(parsedValues));
    } else {
      console.log("Error: No batches found");
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};
