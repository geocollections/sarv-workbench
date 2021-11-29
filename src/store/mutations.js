const mutations = {
  UPDATE_SEARCH_FIELDS(state, payload) {
    console.log(payload);
    state[payload.module].searchFields.byIds[payload.field][payload.key] =
      payload.value;
  },

  UPDATE_OPTIONS(state, payload) {
    console.log(payload);
    if (payload.key !== "page" && state[payload.module].options.page !== 1)
      state[payload.module].options.page = 1;
    state[payload.module].options[payload.key] = payload.value;
  },

  UPDATE_HEADERS(state, payload) {
    state[payload.module].headers.forEach((item, index) => {
      if (state[payload.module].headers[index].value === payload.value) {
        state[payload.module].headers[index].show =
          !state[payload.module].headers[index].show;
      }
    });
  },

  RESET_HEADERS(state, payload) {
    state[payload.module].headers = payload.headers;
  },

  UPDATE_VIEW_TYPE(state, payload) {
    state[payload.module].viewType = payload.value;
  },
};

export default mutations;
