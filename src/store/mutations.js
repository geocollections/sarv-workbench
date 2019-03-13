import Vue from 'vue'

export default {

  CREATE_RELATION_OBJECT: (state, { createRelationWith }) => {
    Vue.set(state,'createRelationWith', createRelationWith )
  },
  REMOVE_RELATION_OBJECT: (state) => {
    Vue.set(state,'createRelationWith', null )
  },
}
