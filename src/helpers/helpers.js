import config from "@/config";

const getFileUrl = (filename, size) => {
  let filePath = "/" + filename;
  if (size && size.includes(["small", "medium", "large"])) {
    filePath = size + filename;
  }
  return config.app.filesUrl + filePath;
};

const openUrlInNewWindow = (url, width, height) => {
  window.open(url, "", `width=${width || 800},height=${height || 800}`);
};

const getDoiUrl = (doi) => {
  return `https://doi.org/${doi}`;
};

export default {
  getFileUrl,
  openUrlInNewWindow,
  getDoiUrl,
};
