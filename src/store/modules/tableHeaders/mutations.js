const mutations = {
  UPDATE_TABLE_HEADERS(state, payload) {
    state[payload.table].forEach((item, index) => {
      state[payload.table][index].show = !!payload.event.includes(item.value);
    });
  },

  SET_ALL_TABLE_HEADERS(state, payload) {
    let currentHeaders = state[payload.table]
      .filter(item => item.show)
      .map(item => item.value);
    if (currentHeaders && currentHeaders.length === 0)
      currentHeaders = state.defaults[payload.table];

    let allHeaders = payload.fields.map(item => {
      return {
        value: item,
        text: `${payload.table}.${item}`,
        show: currentHeaders.includes(item)
      };
    });

    if (payload.table === "attachment" || payload.table === "analysis")
      allHeaders.push({
        value: "link",
        text: `${payload.table}.link`,
        sortable: false,
        show: true
      });
    if (payload.table === "analysis") {
      allHeaders.push({
        value: "sample__number",
        text: `${payload.table}.sample__number`,
        show: true
      });
      allHeaders.push({
        value: "sample__locality__locality",
        text: `${payload.table}.sample__locality__locality`,
        show: true
      });
      allHeaders.push({
        value: "sample__depth",
        text: `${payload.table}.sample__depth`,
        show: true
      });
      allHeaders.push({
        value: "analysis_method__analysis_method",
        text: `${payload.table}.analysis_method__analysis_method`,
        show: true
      });
    }

    allHeaders
      .sort(
        (a, b) =>
          currentHeaders.indexOf(a.value) - currentHeaders.indexOf(b.value)
      )
      .sort((a, b) => b.show - a.show);

    state[payload.table] = allHeaders;
  }
};

export default mutations;
