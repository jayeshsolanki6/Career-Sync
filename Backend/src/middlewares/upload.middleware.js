import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }

    cb(null, true);
  },
});

export const uploadResumeAndJd = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "jd", maxCount: 1 },
]);