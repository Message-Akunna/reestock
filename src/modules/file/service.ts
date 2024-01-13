import { Response, Request, NextFunction } from "express";
import {
  deleteFile,
  fileExists,
  errorMessage,
  NotFoundError,
  successMessage,
  ValidationError,
} from "iyasunday";
//
import { CustomError } from "../..//utils/interface";

export async function create(body: any, sentFiles: any) {
  try {
    if (!sentFiles || sentFiles.length === 0)
      throw new NotFoundError(`Kindly select a file to upload`);
    const files = [];
    for (let key in sentFiles) {
      const file = sentFiles[key];
      const relativeUrl = file.path
        ? file.path.split("storage").pop()
        : file.key;
      files.push({
        url: file.path ? process.env.STORAGE_URL + relativeUrl : file.location,
        relativeUrl,
        size: file.size,
        filename: file.filename,
      });
    }
    const req = { body };
    if (files.length === 1) (req as any).file = files[0];
    else if (files.length > 1) (req as any).files = files;
    return req;
  } catch (error) {
    throw error;
  }
}

export async function remove(fileUrl: string[]) {
  try {
    if (!fileUrl) throw new ValidationError("Please specify file URL");
    if (typeof fileUrl === "string") fileUrl = [fileUrl];

    for (let file of fileUrl) {
      const relativeUrl = file.split("media/").pop();
      file = process.env.STORAGE_PATH + "/" + relativeUrl;

      if (!(await fileExists(file))) throw new NotFoundError("File not found");
      await deleteFile(file);
    }
    return successMessage("File removed successfully");
  } catch (error) {
    throw error;
  }
}

export default { create, remove };
