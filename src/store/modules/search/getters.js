const getters = {
  getActiveSarvIssuesCount: state => {
    return state.activeSarvIssues?.count;
  },

  getAllShownTableHeaders: (state) => (table) => {
    return state.tableHeaders[table].filter(item => item.show);
  }
};

export default getters;
