export const accessTokenKey = "osher_access_token";
export const tokenKey = "USER_TOKEN";

export const roles = {
  ADMIN: "admin",
  BRAND: "brand",
  INFLUENCER: "influencer",

  // TODO: will might need to add

  DRIVER: "driver",
};

export const TimeSlots = Array.from({ length: 24 }, (_, i) => {
  return i.toString().padStart(2, "0") + ":00";
});

export const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const States = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
];
