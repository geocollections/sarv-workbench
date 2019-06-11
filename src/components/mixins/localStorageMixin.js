import Vue from 'vue'

const localStorageMixin = {

  data() {
    return {
      formSections: null
    }
  },

  created() {
    this.formSections = Vue.localStorage.get('formSections');
    if (typeof this.formSections[this.$route.meta.object] !== 'undefined' && this.formSections !== null && typeof this.block !== 'undefined') {
      if (Object.keys(this.formSections[this.$route.meta.object]).length >= Object.keys(this.block).length && this.compareObjectKeys(this.formSections[this.$route.meta.object], this.block)) {
        this.block = this.formSections[this.$route.meta.object]
      }
    }
  },

  updated() {
    if (typeof this.formSections[this.$route.meta.object] !== 'undefined' && this.formSections !== null && typeof this.block !== 'undefined') {
      if (Object.keys(this.formSections[this.$route.meta.object]).length >= Object.keys(this.block).length && this.compareObjectKeys(this.formSections[this.$route.meta.object], this.block)) {
        this.block = this.formSections[this.$route.meta.object]
      }
    }
  },

  beforeRouteUpdate (to, from, next) {
    if (typeof this.block !== 'undefined' && this.formSections !== null) {
      this.formSections[this.$route.meta.object] = this.block;
      Vue.localStorage.set('formSections', this.formSections)
    }
    next()
  },

  beforeRouteLeave(to, from, next) {
    if (typeof this.block !== 'undefined' && this.formSections !== null) {
      this.formSections[this.$route.meta.object] = this.block;
      Vue.localStorage.set('formSections', this.formSections)
    }
    next()
  },

  methods: {
    lsPushCreateRelationWith (msg) {
      Vue.localStorage.set('createRelationWith',  msg)
    },
    lsPullCreateRelationWith () {
      const relation = Vue.localStorage.get('createRelationWith');
      this.lsPushCreateRelationWith({ object: null, data: null, info: null, edit: null });
      return relation
    },
    lsPushSampleView (state) {
      Vue.localStorage.set('sampleView',  state)
    },
    lsPullSampleView () {
      const state = Vue.localStorage.get('sampleView');
      this.lsPushSampleView(true);
      return state
    },

    lsRefreshParentForm (state) {
      Vue.localStorage.set('refreshForm', state)
    },
    lsIsRefreshedParentForm () {
      const state = Vue.localStorage.get('refreshForm');
      this.lsRefreshParentForm(false);
      return state
    },
    //can be used to get data change in store
    // lsAttachListener (callback) {
    //   Vue.localStorage.on('createRelationWith', callback)
    // }

    compareObjectKeys(objectA, objectB) {
      let aKeys = Object.keys(objectA).sort();
      let bKeys = Object.keys(objectB).sort();
      return JSON.stringify(aKeys) === JSON.stringify(bKeys)
    }
  }
}

export default localStorageMixin
