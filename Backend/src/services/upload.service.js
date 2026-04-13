import fs from "fs/promises";
import os from "os";
import path from "path";

import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse';
import WordExtractor from "word-extractor";

const getFile = (files, name) => files?.[name]?.[0];

const getExt = (file) =>
  path.extname(file.originalname || "").toLowerCase();


const extractPdf = async (file) => {
  const parser = new PDFParse({ data: file.buffer });
  const parsed = await parser.getText();
  return parsed.text || '';
};

const extractDocx = async (file) => {
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value || "";
};

const extractDoc = async (file) => {
  const extractor = new WordExtractor();
  const tempPath = path.join(os.tmpdir(), `tmp-${Date.now()}.doc`);

  await fs.writeFile(tempPath, file.buffer);

  try {
    const doc = await extractor.extract(tempPath);
    return doc.getBody() || "";
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
};

const extractText = async (file) => {
  const ext = getExt(file);

  if (ext === ".pdf") return extractPdf(file);
  if (ext === ".docx") return extractDocx(file);
  if (ext === ".doc") return extractDoc(file);

  throw new Error("Unsupported file format");
};


export const getResumeJdText = async ({ files, body }) => {
  const resume = getFile(files, "resume");
  const jdFile = getFile(files, "jd");
  const jdText = body?.jdText?.trim();

  if (!resume) throw new Error("Resume is required");

  if (!jdFile && !jdText)
    throw new Error("Provide JD file or text");

  const resumeText = await extractText(resume);
  if (!resumeText) throw new Error("Resume text extraction failed");

  const jdFinalText = jdFile
    ? await extractText(jdFile)
    : jdText;

  if (!jdFinalText) throw new Error("JD text extraction failed");

  return {
    resumeText,
    jdText: jdFinalText,
  };
};