import Vue from 'vue'

function handleResponse(response){
  if (response.status === 200) {
    return (response.body.count > 0) ? response.body.results : false
  }
}

export default {

  CREATE_RELATION_OBJECT: (state, { createRelationWith }) => {
    Vue.set(state,'createRelationWith', createRelationWith )
  },

  REMOVE_RELATION_OBJECT: (state) => {
    Vue.set(state,'createRelationWith',  { object: null, data: null, info: null, edit: null } )
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
    /* false means page not found */
    Vue.set(state, 'sidebarList', {
      results : resp.body.results || false,
      page: resp.body.page,
      totalPages: resp.body.page ? resp.body.page.split(' of ')[1]: undefined
    })
  },

  SET_SIDEBAR_USER_ACTION: (state, { userAction }) => {
    Vue.set(state, 'sidebarUserAction', userAction || false)
  },

  SET_ANALYSIS_METHODS: (state, { resp }) => {
    Vue.set(state, 'analysisMethods', handleResponse(resp))
  },

  SET_SAMPLE_PURPOSES: (state, { resp }) => {
    Vue.set(state, 'samplePurposes', handleResponse(resp))
  },

  SET_FOSSIL_GROUPS: (state, { resp }) => {
    Vue.set(state, 'fossilGroups', handleResponse(resp))
  },
}
