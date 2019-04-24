import Vue from 'vue'

export default {

  CREATE_RELATION_OBJECT: (state, { createRelationWith }) => {
    Vue.set(state,'createRelationWith', createRelationWith )
  },
  REMOVE_RELATION_OBJECT: (state) => {
    Vue.set(state,'createRelationWith',  { object: null, data: null, info: null } )
  },
  SET_SAMPLE_VIEW: (state, isFull) => {
    Vue.set(state,'sampleView', isFull)
  },

  SET_CURRENT_USER: (state, object) => {
    Vue.set(state,'currentUser', object)
  },

  SET_ACTIVE_SEARCH_PARAMS: (state, params) => {
    Vue.set(state,'activeSearchParams', params)
  },

  SET_SIDEBAR_LIST: (state, { resp }) => {
    Vue.set(state, 'sidebarList', { results : resp.body.results || false, totalPages: resp.body.page ? resp.body.page.split(' of ')[1]: undefined}) /* false means page not found */
  },

  SET_SIDEBAR_USER_ACTION: (state, { userAction }) => {
    Vue.set(state, 'sidebarUserAction', userAction || false) /* false means page not found */
  },
}
