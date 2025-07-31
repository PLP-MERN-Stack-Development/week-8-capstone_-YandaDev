import multer from "multer";

const storage = multer.memoryStorage();

// For user signup/profile photo
export const profilePhotoUpload = multer({ storage }).single("file");

// For profile update: accept both profilePhoto and resume
export const profileUpdateUpload = multer({ storage }).fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]);

// For company logo upload
export const logoUpload = multer({ storage }).single("logo");