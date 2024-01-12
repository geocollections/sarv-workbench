import config from "@/config";

const getFileUrl = (filename, size) => {
  const filePath = getFilePath(filename, size);
  return config.app.filesUrl + filePath;
};

const getPublicFileUrl = (filename, size) => {
  const filePath = getFilePath(filename, size);
  const fileExtension = filename.split(".")[1];

  return config.app.publicFilesUrl + filePath + "." + fileExtension;
};

const getFilePath = (filename, size) => {
  const uuid = filename.split(".")[0];
  let filePath = "/" + uuid;

  // SVG-s do not have sizes
  const useOriginal = filename.endsWith(".svg");
  if (useOriginal) return filePath;

  if (size && ["small", "medium", "large"].includes(size)) {
    filePath = "/" + size + "/" + uuid;
  }
  return filePath;
};

const openUrlInNewWindow = (url, width, height) => {
  window.open(url, "", `width=${width || 800},height=${height || 800}`);
};

const getDoiUrl = (doi) => {
  return `https://doi.org/${doi}`;
};

const openFileInNewWindow = (file) => {
  if (!file) return;
  const isPrivate = file.is_private || file.attachment__is_private;
  const uuidFilename = file.uuid_filename || file.attachment__uuid_filename;

  let uuid = uuidFilename;
  let url = config.app.publicFilesUrl;
  if (isPrivate) {
    uuid = uuidFilename.split(".")?.[0];
    url = config.app.filesUrl;
  }
  if (isImageFile(file)) {
    url += `/large/${uuid}`;
  } else {
    url += "/" + uuid;
  }
  openUrlInNewWindow(url);
};

const isImageFile = (file) => {
  const mimeType =
    file.attachment_format__value || file.attachment__attachment_format__value;
  const uuidFilename = file.uuid_filename || file.attachment__uuid_filename;
  const imageMimeTypes = ["image/jpe", "image/jpg", "image/jpeg", "image/png"];
  if (mimeType) {
    return imageMimeTypes.includes(mimeType);
  } else {
    let fileType = uuidFilename?.split(".")[1];
    return !!(
      fileType?.includes("jpe") ||
      fileType?.includes("jpg") ||
      fileType?.includes("jpeg") ||
      fileType?.includes("png")
    );
  }
};

export default {
  getFileUrl,
  getPublicFileUrl,
  openUrlInNewWindow,
  getDoiUrl,
  isImageFile,
  openFileInNewWindow,
};
