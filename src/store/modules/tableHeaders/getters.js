const getters = {
  getAllShownTableHeaders: state => table => {
    return state[table].filter(item => item.show);
  }
};

export default getters;
