<template>
  <div class="settings">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('header.settings') }}</p>
      </div>
    </div>

    <fieldset class="border p-2 mt-2">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.shortcuts }"  @click="block.shortcuts = !block.shortcuts">
        {{ $t('settings.shortcuts') }}
        <i class="far fa-share-square"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.shortcuts">
          <shortcuts/>
        </div>
      </transition>
    </fieldset>

    <fieldset class="border p-2 mt-2">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.permissions }"  @click="block.permissions = !block.permissions">
        {{ $t('settings.permissions') }}
        <i class="fas fa-user-lock"></i>
      </legend>

      <transition name="fade">
        <div class="row" v-if="block.permissions">


          <div class="col-6 col-sm-6 col-md-4 col-xl-3" v-for="(key, index) in permissions">
            <vs-list>
              <vs-list-header style="word-break: break-all"
                              icon="fa-table"
                              icon-pack="fas"
                              :title="index.charAt(0).toUpperCase() + index.substring(1)"
                              color="dark"></vs-list-header>

              <div v-for="entity in key">
                <div class="vs-list--item"
                     :class="{ 'list-link-add' : isTableInCorrectList(index, 'add') }"
                     v-if="entity === 'add'"
                     @click="goTo(index, 'add')">

                  <div class="vs-list--icon"><i class="vs-icon notranslate icon-scale far fa-plus-square null"></i></div>

                  <div class="list-titles">
                    <div class="vs-list--subtitle">{{ entity }}</div>
                  </div>
                </div>

                <div class="vs-list--item"
                     :class="{ 'list-link-change' : isTableInCorrectList(index, 'change') }"
                     v-if="entity === 'change'"
                     @click="goTo(index, 'change')">

                  <div class="vs-list--icon"><i class="vs-icon notranslate icon-scale far fa-edit null"></i></div>

                  <div class="list-titles">
                    <div class="vs-list--subtitle">{{ entity }}</div>
                  </div>
                </div>

                <div class="vs-list--item"
                     :class="{ 'list-link-delete' : isTableInCorrectList(index, 'delete') }"
                     v-if="entity === 'delete'"
                     @click="goTo(index, 'delete')">

                  <div class="vs-list--icon"><i class="vs-icon notranslate icon-scale far fa-minus-square null"></i></div>

                  <div class="list-titles">
                    <div class="vs-list--subtitle">{{ entity }}</div>
                  </div>
                </div>
              </div>

            </vs-list>
          </div>

        </div>

      </transition>


    </fieldset>

  </div>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import VueMultiselect from "vue-multiselect/src/Multiselect";
  import Shortcuts from "../components/partial/settings/Shortcuts";
  import formSectionsMixin from "../mixins/formSectionsMixin";
  import {mapState} from "vuex";

  export default {
    name: "Settings",
    components: {Shortcuts, VueMultiselect},
    mixins: [formSectionsMixin],
    data() {
      return {
        // Todo: Update lists according to routes
        addList: ['attachment', 'reference', 'imageset', 'journal', 'locality', 'sample', 'project', 'site', 'library', 'doi', 'analysis', 'specimen'],
        changeList: ['attachment', 'reference', 'locality', 'sample', 'project', 'site', 'library', 'doi', 'analysis', 'specimen'],
        deleteList: [],
        block: {shortcuts: true, permissions: true },
      }
    },
    metaInfo () {
      return {
        title: this.$t('titles.settings')
      }
    },

    computed: {
      ...mapState(["permissions"])
    },

    methods: {

      goTo(table, action) {
        if (this.isTableInCorrectList(table, action)) {
          if (action === 'add') this.$router.push({ path: '/' + table + '/' + action })
          if (action === 'change' || action === 'delete') this.$router.push({ path: '/' + table })
        }
      },

      /**
       * Checks if table is in either add, change or delete list and then returns boolean value.
       *
       * @param table, String value which is checked to see if it exists in list aka routes available in app
       * @param action, String value which action user wants, either add, change or, delete
       * @returns {boolean}, if table is in list correspondent to desired action
       */
      isTableInCorrectList(table, action) {
        if (action === 'add') return this.addList.includes(table);
        if (action === 'change') return this.changeList.includes(table);
        if (action === 'delete') return this.deleteList.includes(table);
        return false
      },
    }
  }
</script>

<style scoped>
  legend:hover {
    color: #007bff;
  }

  .list-link-add {
    color: #28a745;
  }

  .list-link-add:hover {
    cursor: pointer;
    font-weight: bold;
  }

  .list-link-change {
    color: #007bff;
  }

  .list-link-change:hover {
    cursor: pointer;
    font-weight: bold;
  }

  .list-link-delete {
    color: #dc3545;
  }

  .list-link-delete:hover {
    cursor: pointer;
    font-weight: bold;
  }

</style>
