import vue from 'vue'

const localStorageMixin = {
  methods: {
    lsPushCreateRelationWith (msg) {
      vue.localStorage.set('createRelationWith',  msg)
    },
    lsPullCreateRelationWith () {
      const relation = vue.localStorage.get('createRelationWith');
      this.lsPushCreateRelationWith({ object: null, data: null, info: null, edit: null });
      return relation
    },
    lsPushSampleView (state) {
      vue.localStorage.set('sampleView',  state)
    },
    lsPullSampleView () {
      const state = vue.localStorage.get('sampleView');
      this.lsPushSampleView(true);
      return state
    },

    lsRefreshParentForm (state) {
      vue.localStorage.set('refreshForm', state)
    },
    lsIsRefreshedParentForm () {
      const state = vue.localStorage.get('refreshForm');
      this.lsRefreshParentForm(false);
      return state
    },
    //can be used to get data change in store
    // lsAttachListener (callback) {
    //   vue.localStorage.on('createRelationWith', callback)
    // }
  }
}

export default localStorageMixin
