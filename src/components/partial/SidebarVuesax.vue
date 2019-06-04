<template>
<!-- TODO: Drop Material Icons and get font awesome icons working -->
  <vs-sidebar :parent="$refs.parentSidebar" default-index="1" color="primary" class="sidebarx"
              :hidden-background="true"
              spacer v-model="active">

    <div class="header-sidebar" slot="header">
      <vs-avatar/>

      <h6>{{ name }} {{ surname }}</h6>
    </div>

    <vs-sidebar-group open :title="$t('header.title')">
      <vs-sidebar-item index="1" icon="fa-home" icon-pack="fas" :to="{ path: '/dashboard' }">
        {{ $t('buttons.homePage') }}
      </vs-sidebar-item>

      <vs-sidebar-group v-if="permissions.project" :title="$t('header.projects')">
        <vs-sidebar-item index="2.1" icon="fa-table" icon-pack="fas" :to="{ path: '/project' }">
          {{ $t('header.editProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="fa-plus-square" icon-pack="fas" :to="{ path: '/project/add' }">
          {{ $t('header.addProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeProject > 0" index="2.3" icon="fa-globe-americas" icon-pack="fas" :to="{ path: '/project/' + activeProject }">
          {{ $t('frontPage.buttons.activeProject') }}: {{ activeProject }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSite > 0" index="2.4" icon="fa-map-marker-alt" icon-pack="fas" :to="{ path: '/site/' + activeSite }">
          {{ $t('frontPage.buttons.activeSite') }}: {{ activeSite }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.attachment" :title="$t('header.files')">
        <vs-sidebar-item index="3.1" icon="fa-folder" icon-pack="far" :to="{ path: '/attachment' }">
          {{ $t('frontPage.buttons.myFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.2" icon="fa-image" icon-pack="far" :to="{ path: '/attachment/add/photo_archive' }">
          {{ $t('frontPage.buttons.photoArchive') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.3" icon="fa-image" icon-pack="fas" :to="{ path: '/attachment/add/specimen_image' }">
          {{ $t('frontPage.buttons.specimenImage') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.4" icon="fa-file" icon-pack="far" :to="{ path: '/attachment/add/other_file' }">
          {{ $t('frontPage.buttons.otherFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.5" icon="fa-file-pdf" icon-pack="far" :to="{ path: '/attachment/add/digitised_reference' }">
          {{ $t('frontPage.buttons.digitisedReference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.reference" :title="$t('header.references')">
        <vs-sidebar-item index="4.1" icon="fa-book" icon-pack="fas" :to="{ path: '/reference' }">
          {{ $t('frontPage.buttons.myReferences') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="4.2" icon="fa-book-open" icon-pack="fas" :to="{ path: '/reference/add' }">
          {{ $t('frontPage.buttons.reference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.library" :title="$t('header.libraries')">
        <vs-sidebar-item index="5.1" icon="fa-list-alt" icon-pack="far" :to="{ path: '/library' }">
          {{ $t('frontPage.buttons.libraries') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="5.2" icon="fa-edit" icon-pack="far" :to="{ path: '/library/add' }">
          {{ $t('frontPage.buttons.library') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.locality" :title="$t('header.localities')">
        <vs-sidebar-item index="6.1" icon="fa-map-marked-alt" icon-pack="fas" :to="{ path: '/locality' }">
          {{ $t('frontPage.buttons.localities') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="6.2" icon="fa-map-marker-alt" icon-pack="fas" :to="{ path: '/locality/add' }">
          {{ $t('frontPage.buttons.locality') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.sample" :title="$t('header.samples')">
        <vs-sidebar-item index="7.1" icon="fa-vials" icon-pack="fas" :to="{ path: '/sample' }">
          {{ $t('frontPage.buttons.samples') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="7.2" icon="fa-vial" icon-pack="fas" :to="{ path: '/sample/add' }">
          {{ $t('frontPage.buttons.sample') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSample > 0" index="7.3" icon="fa-fill-drip" icon-pack="fas" :to="{ path: '/sample/' + activeSample }">
          {{ $t('frontPage.buttons.activeSample') }}: {{ activeSample }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.doi" :title="$t('header.dois')">
        <vs-sidebar-item index="8.1" icon="fa-database" icon-pack="fas" :to="{ path: '/doi' }">
          {{ $t('header.dois') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="8.2" icon="fa-plus-circle" icon-pack="fas" :to="{ path: '/doi/add' }">
          {{ $t('frontPage.buttons.doi') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

    </vs-sidebar-group>


    <vs-divider icon="fa-user" icon-pack="fas" position="left"></vs-divider>


    <div class="footer-sidebar" slot="footer">
      <vs-button icon="fa-sign-out-alt" icon-pack="fas" color="danger" type="border" @click="logOut()">{{ $t('header.logOut') }}</vs-button>
      <vs-button icon="fa-cog" icon-pack="fas" color="primary" type="border" :to="{ path: '/settings' }"></vs-button>
    </div>

  </vs-sidebar>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import authenticate from "../mixins/authenticate";

  export default {
    name: "SidebarVuesax",
    mixins: [authenticate],
    data() {
      return {
        user: '',
        name: '',
        surname: '',
        activeProject:'',
        activeSite:'',
        activeSample:'',
        permissions: '',
        active: true,
        isReduced: false,
      }
    },

    created: function () {
      // Gets user's named
      if (this.$session.exists() && this.$session.get('authUser') != null) {
        this.user = this.$session.get('authUser').user;
        this.name = this.$session.get('authUser').name;
        this.surname = this.$session.get('authUser').surname;
        this.permissions = this.$session.get('authUser').permissions
      }
      this.activeProject = this.$localStorage.get('activeProject')[0];
      this.activeSite = this.$localStorage.get('activeSite');
      this.activeSample = this.$localStorage.get('activeSample');
    },
  }
</script>

<style scoped>
  .header-sidebar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .footer-sidebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .footer-sidebar > button {
    border: 0 solid rgba(0, 0, 0, 0) !important;
    border-left: 1px solid rgba(0, 0, 0, .07) !important;
    border-radius: 0 !important;
  }
</style>
