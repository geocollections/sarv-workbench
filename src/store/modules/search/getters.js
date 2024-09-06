const getters = {
  getAllShownTableHeaders: (state) => (table) => {
    return state.tableHeaders[table].filter((item) => item.show);
  },
};

export default getters;
