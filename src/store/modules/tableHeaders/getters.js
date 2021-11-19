import { getField } from 'vuex-map-fields';


const getters = {
  getField,

  getAllShownTableHeaders: (state) => (table) => {
    return state[table].filter((item) => item.show);
  },

  getListOfAllTables: (state) => () => {
    return Object.keys(state.defaults);
  },
};

export default getters;
