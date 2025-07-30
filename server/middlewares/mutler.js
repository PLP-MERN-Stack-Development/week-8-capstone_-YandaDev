import multer from "multer";

const storage = multer.memoryStorage();

// For user signup/profile photo
export const profilePhotoUpload = multer({ storage }).single("file");

// For resume upload (profile update)
export const resumeUpload = multer({ storage }).single("resume");

// For company logo upload
export const logoUpload = multer({ storage }).single("logo");