
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
    let object = this.$route.meta.object;
    if (object === 'attachment' && !this.$route.meta.isEdit) object = this.$route.meta.child;
    if (this.block && this.formSections) {
      this.formSections[object] = this.block;
      this.$localStorage.set('formSections', this.formSections)
    }
    next()
  },

  beforeRouteLeave(to, from, next) {
    let object = this.$route.meta.object;
    if (object === 'attachment' && !this.$route.meta.isEdit) object = this.$route.meta.child;
    if (this.block && this.formSections) {
      this.formSections[object] = this.block;
      this.$localStorage.set('formSections', this.formSections)
    }
    next()
  },

  methods: {
    $_localStorageMixin_setBlock() {
      let object = this.$route.meta.object;
      if (object === 'attachment' && !this.$route.meta.isEdit) object = this.$route.meta.child;
      if (this.formSections && this.formSections[object] && this.block) {
        if (Object.keys(this.formSections[object]).length >= Object.keys(this.block).length && compareObjectKeys(this.formSections[object], this.block)) {
          this.block = this.formSections[object]
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
