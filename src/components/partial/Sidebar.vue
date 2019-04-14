<template>
  <!--nav sidebar -->
  <sidebar-wrapper ref="navbar">

    <template v-if="$route.meta.table === 'site'">
      <li :class="activeSection === 'info' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('info')" style="display: block;">
          Üldinfo <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('files')" style="display: block;">
          Files <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'samples' ? ' collapsed active' : ''" class="pl-2">
        <span class="toggle-collapse" @click="showSampleMenu = !showSampleMenu" :class="showSampleMenu ? 'collapsed' : null"> Samples
          <font-awesome-icon v-if="showSampleMenu" icon="chevron-up" style="margin-top: 10px;"/>
          <font-awesome-icon v-else icon="chevron-down" style="margin-top: 10px;"/>
        </span>

        <a href="javascript:void(0)" @click="setActiveSection('samples')" style="display: inline-block; margin-left:20px">
          <font-awesome-icon icon="vial" class="pull-right" style="margin-top: 10px;"/>
        </a>
      </li>

      <b-collapse v-model="showSampleMenu" id="collapseSample">
        <ul class="sub-menu">
          <li><a href="#" @click="setAction('addSample')" style="display: inline-block; ">Add sample</a></li>
        </ul>
      </b-collapse>
      <span @click="pinSidebar">
        <font-awesome-icon id="navbar-expand"  icon="thumbtack" class="pull-right mr-3 mt-3" style="margin-top: 10px;"/>
      </span>
    </template>
    <template v-if="$route.meta.table === 'project'">
      <li :class="activeSection === 'info' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('info')" style="display: block;">
          Üldinfo <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('files')" style="display: block;">
          Files <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'samples' ? ' collapsed active' : ''" class="pl-2">
        <span class="toggle-collapse" @click="showSiteMenu = !showSiteMenu" :class="showSiteMenu ? 'collapsed' : null"> Sites
          <font-awesome-icon v-if="showSiteMenu" icon="chevron-up" style="margin-top: 10px;"/>
          <font-awesome-icon v-else icon="chevron-down" style="margin-top: 10px;"/>
        </span>

        <a href="javascript:void(0)" @click="setActiveSection('sites')" style="display: inline-block; margin-left:43px">
          <font-awesome-icon icon="globe-americas" class="pull-right" style="margin-top: 10px;"/>
        </a>
      </li>

      <b-collapse v-model="showSiteMenu" id="collapseSample">
        <ul class="sub-menu">
          <li><a href="#" @click="setAction('addSite')" style="display: inline-block; ">Add site</a></li>
        </ul>
      </b-collapse>
      <span @click="pinSidebar">
        <font-awesome-icon  icon="thumbtack" class="pull-right mr-3 mt-3" style="margin-top: 10px;"/>
      </span>
    </template>
  </sidebar-wrapper>
</template>

<script>

  import fontAwesomeLib  from './../mixins/fontAwasomeLib'
  import SidebarWrapper from "./SidebarWrapper";
  export default {
    name: "Sidebar",
    components: {SidebarWrapper},
    mixins:[fontAwesomeLib],
    data() {
      return {
        activeSection : 'info',
        showSampleMenu: false,
        showSiteMenu:false,
        isActive:false
      }
    },

    methods: {
      setActiveSection(section) {
        this.activeSection = section;
        this.$root.$emit('sidebar-user-choice',section)
      },

      setAction(action, object) {
        this.$root.$emit('sidebar-user-action',{action:action})
      },

      pinSidebar(){
        // console.log(this.$refs.navbar )
      }
    }
  }
</script>
<style src="../../assets/css/sidebarStyle.css"></style>
<style scoped>

</style>
