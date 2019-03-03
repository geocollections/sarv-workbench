<template>
    <div class="col-sm-6">
      <div class="col-sm-4">
        <label :for="id">{{ $t(title) }}:</label>
      </div>

      <div class="col-sm-8 mb-2">{{param}}
        <b-form-input :v-model="form[id]" :id="id" :type="type"></b-form-input>
      </div>
    </div>
</template>

<script>
    export default {
      name: "SearchField",
      data(){
        return {localParam : this.param}
      },
      props: {
        id: {
          type: String,
          default: null
        },
        title: {
          type: String,
          default: null
        },
        param: {
          type: Object,
          default: null
        },
        type: {
          type: String,
          default: null
        }
      },
      watch: {
        'param': {
          handler: function (newVal,oldVal) {
            this.$emit('param-changed',{field: this.param, value:newVal})
          },
          deep: true
        }
      },
    }
</script>

<style scoped>

</style>
