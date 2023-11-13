import config from "@/config";

const getFileUrl = (filename, size) => {
  const filePath = getFilePath(filename, size);

  return config.app.filesUrl + filePath;
};

const getPublicImageUrl = (filename, size) => {
  const filePath = getFilePath(filename, size);
  const fileExtension = filename.split(".")[1];

  return config.app.publicFilesUrl + filePath + "." + fileExtension;
};

const getFilePath = (filename, size) => {
  const uuid = filename.split(".")[0];
  let filePath = "/" + uuid;
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

export default {
  getFileUrl,
  getPublicImageUrl,
  openUrlInNewWindow,
  getDoiUrl,
};
