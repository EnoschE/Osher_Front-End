import { createWorker } from "tesseract.js";
import * as EmailValidator from "email-validator";

export const formatNumber = (value: string | number) => {
  const isDecimalValue =
    parseFloat((value || 0).toString()) !== parseInt((value || 0).toString());
  const numOfDecimals = isDecimalValue ? 2 : 0;

  return parseFloat(
    parseFloat((value || 0).toString()).toFixed(numOfDecimals)
  ).toLocaleString();
};

export const scanTextFromImage = async (image: any) => {
  const worker = await createWorker();
  const { data } = await worker.recognize(image);
  await worker.terminate();

  return data?.text || "";
};

export const getSatelliteImage = (address?: string) => {
  if (address) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=20&size=800x800&maptype=satellite&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  }
};

export const getStreetViewImage = (address?: string) => {
  if (address) {
    return `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${address}&fov=75&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  }
};

export const validatePassword = (password: string | undefined) => {
  return password
    ? password?.length < 5
      ? "Password length must be at least 5 characters"
      : // : password?.search(/[A-Z]/) < 0
        // ? "Password requires at least one uppercase letter"
        // : password?.search(/[a-z]/) < 0
        // ? "Password requires at least one lowercase letter"
        // : password?.search(/[0-9]/) < 0
        // ? "Password requires at least one number"
        ""
    : "Password cannot be empty";
  // ? password?.length < 8
  // 	? "Password length must be at least 8 characters"
  // 	: password?.search(/[A-Z]/) < 0
  // 	? "Password requires at least one uppercase letter"
  // 	: password?.search(/[a-z]/) < 0
  // 	? "Password requires at least one lowercase letter"
  // 	: password?.search(/[0-9]/) < 0
  // 	? "Password requires at least one number"
  // 	: ""
  // : "Password cannot be empty";
};

export const validateEmail = (email: string | undefined) => {
  return email
    ? !EmailValidator.validate(email)
      ? "Enter a valid email"
      : ""
    : "Email cannot be empty";
};

export function uuidv4() {
  return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(
    /[xy]/g,
    (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
    }
  );
}

export function formatDate(dateString: any) {
  // Parse the date string into a Date object
  const dateObject = new Date(dateString);

  // Format the date as "26 March 2024"
  return dateObject.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
