<template>
<!-- TODO: Drop Material Icons and get font awesome icons working -->
  <vs-sidebar v-if="false" :parent="$refs.parentSidebar" default-index="1" color="primary" class="sidebarx"
              :reduce="false"
              :hidden-background="true"
              spacer v-model="active">

    <div class="header-sidebar" slot="header">
      <vs-avatar/>

      <h6>{{ name }}</h6>
    </div>

    <vs-sidebar-group open :title="$t('header.title')">
      <vs-sidebar-item index="1" icon="home" :to="{ path: '/dashboard' }">
        {{ $t('buttons.homePage') }}
      </vs-sidebar-item>

      <vs-sidebar-group v-if="permissions.project" :title="$t('header.projects')">
        <vs-sidebar-item index="2.1" icon="store" :to="{ path: '/project' }">
          {{ $t('header.editProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="2.2" icon="nature_people" :to="{ path: '/project/add' }">
          {{ $t('header.addProject') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeProject > 0" index="2.3" icon="style" :to="{ path: '/project/' + activeProject }">
          {{ $t('frontPage.buttons.activeProject') }}: {{ activeProject }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSite > 0" index="2.4" icon="style" :to="{ path: '/site/' + activeSite }">
          {{ $t('frontPage.buttons.activeSite') }}: {{ activeSite }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.attachment" :title="$t('header.files')">
        <vs-sidebar-item index="3.1" icon="store" :to="{ path: '/attachment' }">
          {{ $t('frontPage.buttons.myFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.2" icon="nature_people" :to="{ path: '/attachment/add/photo_archive' }">
          {{ $t('frontPage.buttons.photoArchive') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.3" icon="style" :to="{ path: '/attachment/add/specimen_image' }">
          {{ $t('frontPage.buttons.specimenImage') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.4" icon="style" :to="{ path: '/attachment/add/other_file' }">
          {{ $t('frontPage.buttons.otherFiles') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="3.5" icon="style" :to="{ path: '/attachment/add/digitised_reference' }">
          {{ $t('frontPage.buttons.digitisedReference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.reference" :title="$t('header.references')">
        <vs-sidebar-item index="4.1" icon="store" :to="{ path: '/reference' }">
          {{ $t('frontPage.buttons.myReferences') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="4.2" icon="nature_people" :to="{ path: '/reference/add' }">
          {{ $t('frontPage.buttons.reference') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.library" :title="$t('header.libraries')">
        <vs-sidebar-item index="5.1" icon="store" :to="{ path: '/library' }">
          {{ $t('frontPage.buttons.libraries') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="5.2" icon="nature_people" :to="{ path: '/library/add' }">
          {{ $t('frontPage.buttons.library') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.locality" :title="$t('header.localities')">
        <vs-sidebar-item index="6.1" icon="store" :to="{ path: '/locality' }">
          {{ $t('frontPage.buttons.localities') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="6.2" icon="nature_people" :to="{ path: '/locality/add' }">
          {{ $t('frontPage.buttons.locality') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.sample" :title="$t('header.samples')">
        <vs-sidebar-item index="7.1" icon="store" :to="{ path: '/sample' }">
          {{ $t('frontPage.buttons.samples') }}
        </vs-sidebar-item>
        <vs-sidebar-item index="7.2" icon="nature_people" :to="{ path: '/sample/add' }">
          {{ $t('frontPage.buttons.sample') }}
        </vs-sidebar-item>
        <vs-sidebar-item v-if="activeSample > 0" index="7.3" icon="style" :to="{ path: '/sample/' + activeSample }">
          {{ $t('frontPage.buttons.activeSample') }}: {{ activeSample }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group v-if="permissions.doi" :title="$t('header.dois')">
        <vs-sidebar-item index="8.1" icon="store" :to="{ path: '/doi' }">
          DOI
        </vs-sidebar-item>
        <vs-sidebar-item index="8.2" icon="nature_people" :to="{ path: '/doi/add' }">
          {{ $t('frontPage.buttons.doi') }}
        </vs-sidebar-item>
      </vs-sidebar-group>

    </vs-sidebar-group>


    <vs-divider icon="person" position="left"></vs-divider>

    <vs-sidebar-item index="9" icon="settings" :to="{ path: '/settings' }">
      {{ $t('header.settings') }}
    </vs-sidebar-item>

    <div class="footer-sidebar" slot="footer">
      <!-- TODO: If edit view then SAVE and LEAVE buttons -->
      <vs-button icon="reply" color="danger" type="border">{{ $t('header.logOut') }}</vs-button>
    </div>

  </vs-sidebar>
</template>

<script>
  export default {
    name: "SidebarVuesax",
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
      }
    },

    created: function () {
      // Gets user's name
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
