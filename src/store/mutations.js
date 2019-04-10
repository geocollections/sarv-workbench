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
}
