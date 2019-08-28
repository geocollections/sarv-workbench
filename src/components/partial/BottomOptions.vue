<template>
  <div class="bottom-options-new">

    <div class="d-flex justify-content-around align-items-center bottom-options-lg">


      <button class="bottom-item p-2 text-center bottom-nav"
              :disabled="previousDisabled && sendingData"
              :class="{ 'bottom-item-disabled': previousDisabled }"
              @click="!previousDisabled ? handleClick('PREVIOUS', 'previous') : ''"
              tabindex="4"
              ref="previous"
              v-if="isNavigationShown">
        <span class="bottom-nav-icon">
          <font-awesome-icon icon="angle-double-left" size="sm"/>
        </span>
        <span class="bottom-text"> {{ $t('buttons.previous') }}</span>
      </button>


      <button class="bottom-item p-2 text-center bottom-finish"
              :disabled="sendingData"
              v-if="object === 'site' && !$route.meta.isEdit"
              tabindex="1"
              ref="finish"
              @click="handleClick('FINISH', 'finish')">
        <span class="d-lg-inline-block bottom-icon">
          <i class="fas fa-check-double fa-3x"></i>
        </span>
        <span class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $t('edit.buttons.finish') }}
        </span>
      </button>

      <button class="bottom-item p-2 text-center bottom-save"
              :disabled="sendingData"
              v-else
              tabindex="1"
              ref="saveAndLeave"
              @click="handleClick('SAVE_AND_LEAVE', 'saveAndLeave')">
        <span class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="door-open" size="3x"/>
        </span>
        <span class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $t('edit.buttons.save') }}
        </span>
      </button>


      <button class="bottom-item p-2 text-center bottom-save"
              :disabled="sendingData"
              tabindex="2"
              ref="save"
              @click="handleClick('SAVE', 'save')">
        <span class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="save" size="3x"/>
        </span>
        <span class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $t('edit.buttons.save') }}
        </span>
      </button>


      <button class="bottom-item p-2 text-center bottom-cancel"
              :disabled="sendingData"
              tabindex="3"
              ref="clearOrCancel"
              @click="$route.meta.isEdit ? handleClick('CANCEL', 'clearOrCancel') : handleClick('CLEAR', 'clearOrCancel')">
        <span class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="ban" size="3x"/>
        </span>
        <span class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $route.meta.isEdit ? $t('buttons.cancel') : $t('buttons.clear') }}
        </span>
      </button>


      <button class="bottom-item p-2 text-center bottom-nav"
              :disabled="nextDisabled && sendingData"
              :class="{ 'bottom-item-disabled': nextDisabled }"
              @click="!nextDisabled ? handleClick('NEXT', 'next') : ''"
              tabindex="5"
              ref="next"
              v-if="isNavigationShown">
        <span class="bottom-text">{{ $t('buttons.next') }} </span>
        <span class="bottom-nav-icon">
          <font-awesome-icon icon="angle-double-right" size="sm"/>
        </span>
      </button>


    </div>

  </div>
</template>

<script>
  import fontAwesomeLib from "../../mixins/fontAwasomeLib";

  export default {
    name: "BottomOptions",
    props: {
      object: {
        type: String,
        default: 'attachment'
      },
      isNavigationShown: {
        type: Boolean,
        default: false
      },
    },
    mixins: [fontAwesomeLib],
    data() {
      return {
        nextDisabled: false,
        previousDisabled: false,
        sendingData: false,
      }
    },
    mounted(){
      this.$root.$on('disable-previous', this.disablePrevious);
      this.$root.$on('disable-next', this.disableNext);

      // TODO: Fix when user is using inputs
      // document.addEventListener('keyup', this.handleKeyup)
    },
    beforeDestroy() {
      // document.removeEventListener('keyup', this.handleKeyup)
    },
    methods: {
      handleClick(action, elementRef) {
        this.sendingData = true;
        if (this.object === 'attachment') this.$emit('button-clicked', action, this.object);
        else this.$parent.$emit('button-clicked', action, this.object);

        // Resetting focus after 500ms
        setTimeout(() => {
          this.sendingData = false;
          this.$nextTick(() => this.$refs[elementRef].focus());
        }, 500)
      },


      disableNext(data) {
        this.nextDisabled = data
      },
      disablePrevious(data) {
        this.previousDisabled = data
      },

      handleKeyup(event) {
        // ArrowRight
        if (event.keyCode === 39 || event.which === 39) {
          if (!this.nextDisabled) {
            this.$parent.$emit('button-clicked', 'NEXT', this.object)
          }
        }

        // ArrowLeft
        if (event.keyCode === 37 || event.which === 37) {
          if (!this.previousDisabled) {
            this.$parent.$emit('button-clicked', 'PREVIOUS', this.object)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-options-new {
    background-color: #fff!important;
    color: #000;
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 0 4px 10px #000;
    z-index: 39000;
    height: 56px;
  }

  @media (min-width: 992px) {
    .bottom-options-lg {
      /* Sidebar width */
      margin-left: 260px;
    }

    .d-lg-inline-block {
      display: inline-block !important;
    }

    .bottom-text-lg {
      vertical-align: 0.25rem;
      margin-left: 1rem;
      font-size: 15px !important;
    }

    .bottom-text {
      font-size: 15px !important;
    }
  }

  .bottom-options-new > div {
    height: 56px;
  }

  .bottom-item:hover {
    cursor: pointer;
  }

  .bottom-item-disabled {
    color: rgba(0, 0, 0, 0.5);
  }

  .bottom-item-disabled:hover {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.5) !important;
  }

  .bottom-icon {
    font-size: 0.5rem;
  }

  .bottom-text {
    font-size: 12px;
    margin-top: -0.1rem;
  }

  .bottom-nav:hover {
    color: #007bff;
  }

  .bottom-nav:hover > .bottom-nav-icon {
    opacity: 1;
    transition: opacity 0.2s;
  }

  .bottom-nav > .bottom-nav-icon {
    opacity: 0;
    transition: opacity 0.2s;
  }

  /* Removes arrow transition when Previous or Next button is disabled */
  .bottom-item-disabled:hover > .bottom-nav-icon {
    opacity: 0;
  }

  .bottom-finish {
    color: #007bff;
  }

  .bottom-save {
    color: #28a745;
  }

  .bottom-cancel {
    color: #dc3545;
  }

  .bottom-finish, .bottom-save, .bottom-cancel {
    transition: color 200ms, letter-spacing 500ms, font-weight 200ms;
  }

  .bottom-finish:hover, .bottom-save:hover, .bottom-cancel:hover {
    color: #000;
    letter-spacing: 2px;
    font-weight: 800;
    transition: color 200ms, letter-spacing 500ms, font-weight 200ms;
  }

  .bottom-item:focus {
    border-radius: 0.25rem;
  }

  /* Previous and Next buttons */
  .bottom-nav:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.25);
  }

  .bottom-finish:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .bottom-save:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }

  .bottom-cancel:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  }

  /* Overriding default button element styles */
  button {
    all: unset;
  }
</style>
