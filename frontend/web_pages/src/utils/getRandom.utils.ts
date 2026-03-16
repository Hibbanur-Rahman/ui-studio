// Browser and Node.js compatible UUID v4 generator
const uuidv4 = (): string => {
  // Check if we're in a browser environment with crypto.randomUUID support
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback to manual UUID generation for compatibility
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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

const generateIdWithSlug = (slug: string) => {
  const uuid = uuidv4().replace(/-/g, "").slice(0, 5);
  return `${slug}_${uuid}`;
};

export {
  getRandomDigitNumber,
  generateOTP,
  generateIdWithSlug,
};
