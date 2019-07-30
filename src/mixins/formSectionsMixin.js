
const formSectionsMixin = {

  data() {
    return {
      formSections: null
    }
  },

  created() {
    this.formSections = this.$localStorage.get('formSections');
    this.$_localStorageMixin_setBlock();
  },

  updated() {
    this.$_localStorageMixin_setBlock();
  },

  beforeRouteUpdate (to, from, next) {
    if (this.block && this.formSections) {
      this.formSections[this.$route.meta.object] = this.block;
      this.$localStorage.set('formSections', this.formSections)
    }
    next()
  },

  beforeRouteLeave(to, from, next) {
    if (this.block && this.formSections) {
      this.formSections[this.$route.meta.object] = this.block;
      this.$localStorage.set('formSections', this.formSections)
    }
    next()
  },

  methods: {
    $_localStorageMixin_setBlock() {
      if (this.formSections && this.formSections[this.$route.meta.object] && this.block) {
        if (Object.keys(this.formSections[this.$route.meta.object]).length >= Object.keys(this.block).length && compareObjectKeys(this.formSections[this.$route.meta.object], this.block)) {
          this.block = this.formSections[this.$route.meta.object]
        }
      }
    }
  }

};

function compareObjectKeys(objectA, objectB) {
  let aKeys = Object.keys(objectA).sort();
  let bKeys = Object.keys(objectB).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys)
}

export default formSectionsMixin
