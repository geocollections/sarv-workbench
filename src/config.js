const config = {
  app: {
    filesUrl: import.meta.env.VITE_FILES_URL || "/files",
    publicFilesUrl:
      import.meta.env.VITE_PUBLIC_FILES_URL ||
      "https://files.geocollections.info",
  },
};

export default config;
