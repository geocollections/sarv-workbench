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
    console.log(payload)
    state[payload.module].headers.forEach((item, index) => {
      state[payload.module].headers[index].show = !!payload.value.includes(
        item.value
      );
    });
  },

  UPDATE_VIEW_TYPE(state, payload) {
    console.log(payload)
    state[payload.module].viewType = payload.value
  }
};

export default mutations;
