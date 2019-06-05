<template>
  <div class="settings">

    <div class="row mt-4">
      <div class="col">
        <p class="h3">{{ $t('header.settings') }}</p>
      </div>
    </div>

    <fieldset class="border p-2 mt-4">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.permissions }"  @click="block.permissions = !block.permissions">
        {{ $t('settings.permissions') }}
        <i class="fas fa-user-lock"></i>
      </legend>

      <transition name="fade">
        <div class="row" v-if="block.permissions">

          <div class="col-6 col-sm-4 col-lg-3" v-for="(key, index) in permissions">
            <vs-list>
              <vs-list-header icon="fa-table" icon-pack="fas" :title="index.charAt(0).toUpperCase() + index.substring(1)" color="dark"></vs-list-header>


              <!-- TODO: Buttons to paths -->
              <div v-for="entity in key">
                <vs-list-item v-if="entity === 'add'" icon="fa-plus-square" icon-pack="far" :subtitle="entity">

<!--                  <i class="fas fa-arrow-right test" @click="goTo(index, '/add')"></i>-->
                </vs-list-item>

                <vs-list-item v-if="entity === 'change'" icon="fa-edit" icon-pack="far" :subtitle="entity"></vs-list-item>

                <vs-list-item v-if="entity === 'delete'" icon="fa-minus-square" icon-pack="far" :subtitle="entity"></vs-list-item>
              </div>
            </vs-list>
          </div>

        </div>

      </transition>


    </fieldset>


<!--  IDEAS: 1. Create your own navbar shortcuts (only on large screen + max 7 links (can be dropdowns etc.))  -->
  </div>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'

  export default {
    name: "Settings",
    data() {
      return {
        user: '',
        permissions: '',
        block: {permissions: false}
      }
    },
    metaInfo () {
      return {
        title: this.$t('titles.settings')
      }
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.user = this.$session.get('authUser').user
        this.permissions = this.$session.get('authUser').permissions
        //console.log(this.permissions['reference'].includes('add'))
      }
    },

    methods: {
      goTo(table, path = '') {
        this.$router.push({ path: '/' + table + path })
      }
    }
  }
</script>

<style scoped>
  legend:hover {
    color: #007bff;
  }

  .test:hover {
    cursor: pointer;
    color: #007bff;
  }

</style>
