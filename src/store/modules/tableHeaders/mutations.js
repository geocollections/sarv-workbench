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

    let allHeaders = payload.headers.map(item => {
      return {
        value: item,
        text: `${payload.table}.${item}`,
        show: currentHeaders.includes(item)
      };
    });

    if (
      payload.table === "attachment" ||
      payload.table === "analysis" ||
      payload.table === "collection" ||
      payload.table === "dataset" ||
      payload.table === "doi" ||
      payload.table === "drillcore" ||
      payload.table === "drillcore_box" ||
      payload.table === "library" ||
      payload.table === "locality" ||
      payload.table === "preparation" ||
      payload.table === "reference" ||
      payload.table === "rock" ||
      payload.table === "specimen" ||
      payload.table === "stratigraphy" ||
      payload.table === "taxon"
    )
      allHeaders.push({
        value: "link",
        text: `${payload.table}.link`,
        sortable: false,
        show: true
      });
    if (payload.table === "loan") {
      allHeaders.push({
        value: "print",
        text: `${payload.table}.print`,
        sortable: false,
        show: true
      });
    }
    if (payload.table === "sarv_issue") {
      allHeaders.push({
        value: "replied",
        text: `${payload.table}.replied`,
        sortable: false,
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
  },

  SET_DEFAULT_TABLE_HEADERS(state, payload) {
    state[payload.table] = state[payload.table].map(item => {
      return {
        ...item,
        show: state.defaults[payload.table].includes(item.value)
      };
    });
  },

  SET_DYNAMIC_SEARCH_FIELDS(state, payload) {
    let currentSearchFields = state.searchFields[payload.table];
    const dynamicFields = payload.fields.map(item => {
      return {
        [item]: null,
        [`${item}__lookuptype`]: "icontains"
      };
    });

    console.log(currentSearchFields.length);
    console.log(dynamicFields.length);

    if (
      currentSearchFields.length === 0 ||
      currentSearchFields.length !== dynamicFields.length
    ) {
      currentSearchFields = dynamicFields;
      state.searchFields[payload.table] = currentSearchFields;
    }
  }
};

export default mutations;
