import * as EmailValidator from "email-validator";
import { States } from "./enums";

export const formatNumber = (value: string | number) => {
  const isDecimalValue =
    parseFloat((value || 0).toString()) !== parseInt((value || 0).toString());
  const numOfDecimals = isDecimalValue ? 2 : 0;

  return parseFloat(
    parseFloat((value || 0).toString()).toFixed(numOfDecimals)
  ).toLocaleString();
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

export const findStateFromCoords = (lat: number, lng: number) => {
  for (const state of States) {
    if (
      lat >= state.latMin &&
      lat <= state.latMax &&
      lng >= state.lngMin &&
      lng <= state.lngMax
    ) {
      return state.value;
    }
  }
  return "";
};

export const capitalizeText = (text: string) => {
  return text.split("")[0].toUpperCase() + text.slice(1);
};
