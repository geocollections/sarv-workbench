<template>
  <div class="bottom-options">

    <div class="row">
      <div class="col-2">
        <b-button class="hover-button" v-if="isNavigationShown && !previousDisabled" variant="outline-info"
                  v-on:click="$parent.$emit('button-clicked', 'PREVIOUS', object)">
          <font-awesome-icon icon="angle-double-left" :title="$t('buttons.previous')"/> <span class="d-none d-md-inline d-lg-inline pl-2" >{{ $t('buttons.previous') }}</span>
        </b-button>
      </div>
        <div class="col-4 text-right">
        <b-button class="hover-button" variant="outline-success" v-on:click="$parent.$emit('button-clicked', 'SAVE', object)">
          {{ successButton ? successButton : this.$t('edit.buttons.save') }}
        </b-button>
      </div>
      <div class="col-4 text-left">
        <b-button class="hover-button" variant="outline-danger" v-on:click="$parent.$emit('button-clicked', 'CANCEL', object)">
          {{ dangerButton ? dangerButton : this.$t('buttons.cancel') }}
        </b-button>
      </div>
      <div class="col-2 text-right">
        <b-button class="hover-button" v-if="isNavigationShown && !nextDisabled" variant="outline-info" v-on:click="$parent.$emit('button-clicked', 'NEXT', object)">
          <span class="d-none d-md-inline d-lg-inline pr-2">{{ $t('buttons.next') }}</span> <font-awesome-icon icon="angle-double-right" :title="$t('buttons.next')"/>
        </b-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {faAngleDoubleLeft,faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  library.add(faAngleDoubleLeft,faAngleDoubleRight)

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "BottomOptions",
    data() {
      return {
        nextDisabled : false,
        previousDisabled : false
      }
    },

    props: {
      successButton: {
        type: String,
        default: null
      },
      dangerButton: {
        type: String,
        default: null
      },
      object: {
        type: String,
        default: 'attachment'
      },
      isNavigationShown: {
        type: Boolean,
        default: false
      },
    },
    mounted(){
      this.$root.$on('disable-previous', this.disablePrevious);
      this.$root.$on('disable-next', this.disableNext);
    },
    methods: {
      disableNext(data) {
        this.nextDisabled = data
      },
      disablePrevious(data) {
        this.previousDisabled = data
      }
    }
  }
</script>

<!-- Styles are not scoped because now it is possible to add margin-bottom to footer easily -->
<style>
  .bottom-options {
    background-color: #f8f9fa!important;
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 8px 16px;
    box-shadow: 0 4px 10px #000;
    z-index: 1000;
  }

  .hover-button {
    min-width: 100px;
  }

  /* Adds margin-bottom to footer so that it won't get caught behind buttons */
  .footer {
    margin-bottom: 54px;
  }
</style>
