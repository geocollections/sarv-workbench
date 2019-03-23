<template>
  <div class="bottom-options">

    <div class="row">
      <div class="col-6 text-center">
        <b-button class="hover-button" variant="outline-success" v-on:click="$emit('button-clicked', 'SAVE')">
          {{ successButton ? successButton : this.$t('edit.buttons.save') }}
        </b-button>
      </div>
      <div class="col-6 text-center">
        <b-button class="hover-button" variant="outline-danger" v-on:click="$emit('button-clicked', 'CANCEL')">
          {{ dangerButton ? dangerButton : this.$t('buttons.cancel') }}
        </b-button>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    props: {
      successButton: {
        type: String,
        default: null
      },
      dangerButton: {
        type: String,
        default: null
      }
    },
    name: "BottomOptions"
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
    z-index: 1; /* Maybe need to make it even more higher */
  }

  .hover-button {
    min-width: 100px;
  }

  /* Adds margin-bottom to footer so that it won't get caught behind buttons */
  .footer {
    margin-bottom: 54px;
  }
</style>
