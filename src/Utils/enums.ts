export const accessTokenKey = "osher_access_token";
export const tokenKey = "USER_TOKEN";

export const roles = {
  ADMIN: "admin",
  BRAND: "brand",
  INFLUENCER: "influencer",
  DRIVER: "driver",
};

export const adTypes = {
  BANNER: { name: "Banner", value: "banner" },
  VIDEO: { name: "Video", value: "video" },
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
  {
    name: "Alberta",
    latMin: 48.997,
    latMax: 60.0,
    lngMin: -120.0,
    lngMax: -110.0,
    value: "Alberta",
  },
  {
    name: "British Columbia",
    latMin: 48.3,
    latMax: 60.0,
    lngMin: -139.0,
    lngMax: -114.0,
    value: "British Columbia",
  },
  {
    name: "Manitoba",
    latMin: 49.0,
    latMax: 60.0,
    lngMin: -102.0,
    lngMax: -95.0,
    value: "Manitoba",
  },
  {
    name: "New Brunswick",
    latMin: 44.5,
    latMax: 48.5,
    lngMin: -69.2,
    lngMax: -64.7,
    value: "New Brunswick",
  },
  {
    name: "Newfoundland and Labrador",
    latMin: 46.5,
    latMax: 60.0,
    lngMin: -61.5,
    lngMax: -52.6,
    value: "Newfoundland and Labrador",
  },
  {
    name: "Nova Scotia",
    latMin: 43.3,
    latMax: 47.2,
    lngMin: -66.5,
    lngMax: -59.9,
    value: "Nova Scotia",
  },
  {
    name: "Ontario",
    latMin: 41.7,
    latMax: 56.85,
    lngMin: -95.16,
    lngMax: -74.34,
    value: "Ontario",
  },
  {
    name: "Prince Edward Island",
    latMin: 45.8,
    latMax: 47.4,
    lngMin: -64.4,
    lngMax: -62.9,
    value: "Prince Edward Island",
  },
  {
    name: "Quebec",
    latMin: 45.0,
    latMax: 62.0,
    lngMin: -79.8,
    lngMax: -57.1,
    value: "Quebec",
  },
  {
    name: "Saskatchewan",
    latMin: 49.0,
    latMax: 60.0,
    lngMin: -110.0,
    lngMax: -101.0,
    value: "Saskatchewan",
  },
  // {
  //   name: "Punjab",
  //   latMin: 27.5,
  //   latMax: 33.5,
  //   lngMin: 69,
  //   lngMax: 75,
  //   value: "Punjab",
  // },
];
