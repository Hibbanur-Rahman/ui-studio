const { randomUUID } = require('crypto');
import { Roles } from '../enums/user.enums';

// Use Node.js built-in UUID function
const uuidv4 = randomUUID;

//get random digit number
const getRandomDigitNumber = (num: number): string => {
  let digitNumber = "";
  for (let i = 0; i < num; i++) {
    digitNumber += Math.floor(Math.random() * 10);
  }
  return digitNumber;
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate unique user ID using UUID
const generateUserId = (role: keyof typeof Roles) => {
  const prefix = {
    USER: "USR",
    ADMIN: "ADM",
    SUPERADMIN: "SUP",
    STATION_OPERATOR: "STO",
    DELIVERY_PARTNER: "DEL",
  } as const;

  // Generate UUID and remove hyphens for cleaner ID
  const uuid = uuidv4().replace(/-/g, "");
  return `${prefix[role]}_${uuid}`;
};

const generateIdWithSlug = (slug: string) => {
  const uuid = uuidv4().replace(/-/g, "").slice(0, 5);
  return `${slug}_${uuid}`;
};

export {
  getRandomDigitNumber,
  generateOTP,
  generateUserId,
  generateIdWithSlug,
  generateIdWithSlug as genarteIdWithSlug,
};
