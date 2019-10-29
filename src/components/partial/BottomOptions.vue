<template>
  <div class="bottom-options-new">
    <div
      class="d-flex justify-content-around align-items-center bottom-options-lg"
      :class="{ 'drawer-left-margin': drawerState, 'drawer-left-margin-0': !drawerState, 'drawer-right-margin': drawerRightState, 'drawer-right-margin-0': !drawerRightState }"
    >
      <router-link
        class="bottom-item p-2 text-center bottom-nav"
        :disabled="!previousId"
        :class="{ 'bottom-item-disabled': !previousId }"
        :to="{ path: `/${this.object}/${this.previousId}` }"
        tag="button"
        tabindex="4"
        ref="previous"
        title="Go to previous record"
        v-if="isNavigationShown"
      >
        <span class="bottom-nav-icon">
          <i class="fas fa-angle-double-left fa-sm"></i>
        </span>
        <span class="bottom-text"> {{ $t("buttons.previous") }}</span>
      </router-link>

      <button
        class="bottom-item p-2 text-center bottom-finish"
        :disabled="sendingData"
        v-if="object === 'site' && !$route.meta.isEdit"
        tabindex="1"
        ref="finish"
        @click="handleClick('FINISH', 'finish')"
        title="Finish record"
      >
        <span class="d-lg-inline-block bottom-icon">
          <i class="fas fa-check-double fa-3x"></i>
        </span>
        <span
          class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg"
        >
          {{ $t("edit.buttons.finish") }}
        </span>
      </button>

      <button
        class="bottom-item p-2 text-center bottom-save"
        :disabled="sendingData"
        v-else
        tabindex="1"
        ref="saveAndLeave"
        @click="handleClick('SAVE_AND_LEAVE', 'saveAndLeave')"
        title="Save record and go back to list view"
      >
        <span class="d-lg-inline-block bottom-icon">
          <i class="fas fa-door-open fa-3x"></i>
        </span>
        <span
          class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg"
        >
          {{ $t("edit.buttons.save") }}
        </span>
      </button>

      <button
        class="bottom-item p-2 text-center bottom-save"
        :disabled="sendingData"
        tabindex="2"
        ref="save"
        @click="handleClick('SAVE', 'save')"
        title="Save record"
      >
        <span class="d-lg-inline-block bottom-icon">
          <i class="fas fa-save fa-3x"></i>
        </span>
        <span
          class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg"
        >
          {{ $t("edit.buttons.save") }}
        </span>
      </button>

      <button
        class="bottom-item p-2 text-center bottom-cancel"
        :disabled="sendingData"
        tabindex="3"
        ref="clearOrCancel"
        :title="$route.meta.isEdit ? 'Go back to list view' : 'Clear fields'"
        @click="
          $route.meta.isEdit
            ? handleClick('CANCEL', 'clearOrCancel')
            : handleClick('CLEAR', 'clearOrCancel')
        "
      >
        <span class="d-lg-inline-block bottom-icon">
          <i class="fas fa-ban fa-3x"></i>
        </span>
        <span
          class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg"
        >
          {{ $route.meta.isEdit ? $t("buttons.cancel") : $t("buttons.clear") }}
        </span>
      </button>

      <router-link
        class="bottom-item p-2 text-center bottom-nav"
        :disabled="!nextId"
        :class="{ 'bottom-item-disabled': !nextId }"
        :to="{ path: `/${this.object}/${this.nextId}` }"
        tag="button"
        tabindex="5"
        ref="next"
        v-if="isNavigationShown"
        title="Go to next record"
      >
        <span class="bottom-text">{{ $t("buttons.next") }} </span>
        <span class="bottom-nav-icon">
          <i class="fas fa-angle-double-right fa-sm"></i>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BottomOptions",
  props: {
    object: {
      type: String,
      default: "attachment"
    },
    isNavigationShown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sendingData: false,
      previousId: null,
      nextId: null,
      listOfIDs: [],
      bottomNav: "recent"
    };
  },
  computed: {
    ...mapState(["sidebarList", "drawerState", "drawerRightState"])
  },
  watch: {
    sidebarList: {
      handler: function(newVal) {
        if (
          newVal &&
          newVal.results &&
          newVal.results.length > 0 &&
          this.$route.meta.isEdit
        ) {
          this.initNavigationButtons(newVal.results);
        }
      },
      deep: true
    },
    "$route.params.id": {
      handler: function(newVal) {
        if (newVal && this.$route.meta.isEdit) {
          this.previousId = this.calculatePreviousId(this.listOfIDs, newVal);
          this.nextId = this.calculateNextId(this.listOfIDs, newVal);
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(action, elementRef) {
      this.sendingData = true;
      this.$parent.$emit("button-clicked", action, this.object);

      // Resetting focus after 500ms
      setTimeout(() => {
        this.sendingData = false;
        this.$nextTick(() => {
          if (this.$refs[elementRef]) this.$refs[elementRef].focus();
        });
      }, 500);
    },

    initNavigationButtons(list) {
      this.listOfIDs = list.map(item => {
        if (this.object === "library") return item.library;
        else return item.id;
      });
      this.previousId = this.calculatePreviousId(
        this.listOfIDs,
        this.$route.params.id
      );
      this.nextId = this.calculateNextId(this.listOfIDs, this.$route.params.id);
    },

    calculatePreviousId(records, currentId) {
      if (records && records.length > 0 && currentId) {
        let currentIndex = records.indexOf(parseInt(currentId));
        let previousIndex = currentIndex - 1;

        if (previousIndex >= 0) return records[previousIndex];
        else return null;
      }
    },

    calculateNextId(records, currentId) {
      if (records && records.length > 0 && currentId) {
        let currentIndex = records.indexOf(parseInt(currentId));
        let nextIndex = currentIndex + 1;

        if (nextIndex >= 0) return records[nextIndex];
        else return null;
      }
    }
  }
};
</script>

<style scoped>
.bottom-options-new {
  background-color: #fff !important;
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

.drawer-right-margin-0 {
  margin-right: 0;
  transition: all 200ms ease-out;
}

@media (min-width: 1264px) {
  .drawer-right-margin {
    margin-right: 256px;
    transition: all 200ms ease;
  }
}

@media (min-width: 992px) {
  .drawer-left-margin {
    margin-left: 256px;
    transition: all 200ms ease;
  }

  .drawer-left-margin-0 {
    margin-left: 0;
    transition: all 200ms ease-out;
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

.bottom-finish,
.bottom-save,
.bottom-cancel {
  transition: color 200ms, letter-spacing 500ms, font-weight 200ms;
}

.bottom-finish:hover,
.bottom-save:hover,
.bottom-cancel:hover {
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

/* Removing button style */
button {
  all: unset;
}
</style>
