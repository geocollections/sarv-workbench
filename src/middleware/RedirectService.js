if (window?.location?.origin === "https://edit2.geocollections.info") {
  window.location.replace(
    `https://edit.geocollections.info${window.location.pathname}${window.location.search}`
  );
}
