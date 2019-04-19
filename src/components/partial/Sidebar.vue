<template>
  <!--nav sidebar -->
  <sidebar-wrapper ref="navbar" v-bind:class="{ active: sidebarOpen }" :key="componentKey">

    <template v-if="$route.meta.table === 'site'">
      <li :class="activeSection === 'info' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('info')" style="display: block;">
          Üldinfo
          <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('files')" style="display: block;">
          Files
          <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'samples' ? ' collapsed active' : ''" class="pl-2">
        <span class="toggle-collapse" @click="showSampleMenu = !showSampleMenu"
              :class="showSampleMenu ? 'collapsed' : null"> Samples
          <font-awesome-icon v-if="showSampleMenu" icon="chevron-up" style="margin-top: 10px;"/>
          <font-awesome-icon v-else icon="chevron-down" style="margin-top: 10px;"/>
        </span>

        <a href="javascript:void(0)" @click="setActiveSection('samples')"
           style="display: inline-block; margin-left:20px">
          <font-awesome-icon icon="vial" class="pull-right" style="margin-top: 10px;"/>
        </a>
      </li>

      <b-collapse v-model="showSampleMenu" id="collapseSample">
        <ul class="sub-menu">
          <li><a href="#" @click="setAction('addSample')" style="display: inline-block; ">Add sample</a></li>
        </ul>
      </b-collapse>
     
    </template>
    <template v-if="$route.meta.table === 'project'">
      <li :class="activeSection === 'info' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('info')" style="display: block;">
          Üldinfo
          <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
        </a>
      </li>

      <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
        <a href="javascript:void(0)" @click="setActiveSection('files')" style="display: block;">
          Files
          <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
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

    </template>
    <span @click="pinSidebar" id="thumbtack-icon">
        <font-awesome-icon icon="thumbtack" class="pull-right mr-3 mt-3 rotate" v-bind:class=" {down : isThumbtackDown}"
                           style="margin-top: 10px;"/>
      </span>
    <div v-bind:style="{height: navBarHeight +'px'}" class="p-0">

         <span @click="$root.$emit('button-clicked', 'SAVE')" class="p-0 pr-2 pl-2 actionBtn" style="bottom: 9%; ">
           {{ $t('edit.buttons.save')}}&ensp;<font-awesome-icon icon="save" class="pull-right mr-1" style="color:#28a745;margin-top: 10px; "/>
         </span>
      <span @click="$root.$emit('button-clicked', 'CANCEL')" class="p-0 pl-2 pr-2 actionBtn" style="bottom: 27%; ">
          {{$t('buttons.cancel')}}&ensp;
          <font-awesome-icon icon="ban" class="pull-right mr-1" style="color:#dc3545;margin-top: 10px;"/>
        </span>
    </div>
  </sidebar-wrapper>
</template>

<script>

  import fontAwesomeLib from './../mixins/fontAwasomeLib'
  import SidebarWrapper from "./SidebarWrapper";

  export default {
    name: "Sidebar",
    components: {SidebarWrapper},
    mixins: [fontAwesomeLib],
    data() {
      return {
        activeSection: 'info',
        showSampleMenu: false,
        showSiteMenu: false,
        sidebarOpen: false,
        isThumbtackDown: true,
        componentKey: 0,
        navBarHeight: 300
      }
    },
    mounted() {
      this.navBarHeight = document.querySelector('.nav-side-menu').clientHeight - 200
    },
    methods: {
      setActiveSection(section) {
        this.activeSection = section;
        this.$root.$emit('sidebar-user-choice', section)
      },

      setAction(action, object) {
        this.$root.$emit('sidebar-user-action', {action: action})
      },
      forceRerender() {
        this.componentKey += 1;
      },
      pinSidebar() {
        this.isThumbtackDown = !this.isThumbtackDown;
        this.sidebarOpen = !this.sidebarOpen;
        this.$parent.sidebarOpen = !this.$parent.sidebarOpen;
        // this.sidebarOpen ? document.getElementById('thumbtack-icon').classList.toggle("down") : document.getElementById('thumbtack-icon').classList.remove("down");
        this.forceRerender()
      },
      close() {

      },

      save() {

      }
    }
  }
</script>
<style src="../../assets/css/sidebarStyle.css"></style>
<style scoped>
  .rotate {
    -moz-transition: all 1s linear;
    -webkit-transition: all 1s linear;
    transition: all 1s linear;
  }

  .rotate.down {
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .actionBtn {
    margin-right: -40px;right:0; position: absolute;letter-spacing: 2px;;
    text-transform: uppercase;
    transform: rotate(90deg);
    min-width: 113px;

  }
</style>
