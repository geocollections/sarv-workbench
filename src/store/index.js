import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
Vue.use(Vuex)

export function createStore () {

  return new Vuex.Store({
    state: {
      currentUser:null,
      createRelationWith: { object: null, data: null, info: null, edit: null },
      activeObject: null,
      sidebarList:[],
      activeSearchParams: null,
      sidebarUserAction: null,
      activeLibrary: null,
      activeProject: null,
      shortcuts: []
    },
    actions,
    mutations,
    getters
  })
}
