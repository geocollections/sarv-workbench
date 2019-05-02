import vue from 'vue'

const localStorageMixin = {
  methods: {
    lsPushCreateRelationWith (msg) {
      vue.localStorage.set('createRelationWith',  msg)
    },
    lsPullCreateRelationWith () {
      return vue.localStorage.get('createRelationWith')
    },
    lsPushSampleView (state) {
      vue.localStorage.set('sampleView',  state)
    },
    lsPullSampleView () {
      return vue.localStorage.get('sampleView')
    },
    //can be used to get data change in store
    // lsAttachListener (callback) {
    //   vue.localStorage.on('createRelationWith', callback)
    // }
  }
}

export default localStorageMixin
