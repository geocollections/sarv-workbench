export default {
  isUserAllowedTo: state => (action, table) => {
    if (state.permissions && state.permissions[table])
      return state.permissions[table].includes(action);
    else return false;
  }
};
