<template>
  <!--nav sidebar -->
  <transition name="fade-sidebar">
    <sidebar-wrapper ref="navbar" v-bind:class="{ active: sidebarOpen }" :key="componentKey">
      <template v-if="$route.meta.table === 'site'">
        <li :class="activeSection === 'info' ? ' collapsed active' : ''" class="pl-2">
          <a href="javascript:void(0)" @click="setAction('navigate','info')" style="display: block;">
            Üldinfo
            <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
          </a>
        </li>

        <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
          <a href="javascript:void(0)" @click="setAction('navigate','files')" style="display: block;">
            Files
            <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
          </a>
        </li>
        <li :class="activeSection === 'samples' ? ' collapsed active' : ''" class="pl-2">
          <a href="javascript:void(0)" @click="setAction('navigate','samples')" style="display: block;">

          <span class="toggle-collapse" @click="showSampleMenu = !showSampleMenu"
                :class="showSampleMenu ? 'collapsed' : null"> Samples
          <font-awesome-icon v-if="showSampleMenu" icon="chevron-up" style="margin-top: 10px;"/>
          <font-awesome-icon v-else icon="chevron-down" style="margin-top: 10px;"/>
          </span>
            <font-awesome-icon icon="vial" class="pull-right" style="margin-top: 10px"/>
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
          <a href="javascript:void(0)" @click="setAction('navigate','info')" style="display: block;">
            Üldinfo
            <font-awesome-icon icon="project-diagram" class="pull-right" style="margin-top: 10px"/>
          </a>
        </li>

        <li :class="activeSection === 'files' ? ' collapsed active' : ''" class="pl-2">
          <a href="javascript:void(0)" @click="setAction('navigate','files')" style="display: block;">
            Files
            <font-awesome-icon icon="folder-open" class="pull-right" style="margin-top: 10px"/>
          </a>
        </li>
        <li :class="activeSection === 'sites' ? ' collapsed active' : ''" class="pl-2">
          <a href="javascript:void(0)" @click="setAction('navigate','sites')" style="display: block;">

          <span class="toggle-collapse" @click="showSiteMenu = !showSiteMenu"
                :class="showSiteMenu ? 'collapsed' : null"> Sites
          <font-awesome-icon v-if="showSiteMenu" icon="chevron-up" style="margin-top: 10px;"/>
          <font-awesome-icon v-else icon="chevron-down" style="margin-top: 10px;"/>
          </span>
            <font-awesome-icon icon="globe-americas" class="pull-right" style="margin-top: 10px"/>
          </a>
        </li>

        <b-collapse v-model="showSiteMenu" id="collapseSample">
          <ul class="sub-menu">
            <li><a href="#" @click="setAction('addSite')" style="display: inline-block; ">Add site</a></li>
          </ul>
        </b-collapse>

      </template>




    <div id="thumbtack-icon"  class="element-list" >
    <span class="ml-2"  v-if="sidebarOpen">
      <button @click="setAction('save')" class="btn btn-success p-1 mt-2 ml-1 pl-3 pr-3" style="text-transform: uppercase"> <font-awesome-icon icon="save"/></button>
      <button @click="setAction('cancel')" class="btn btn-danger p-1 mt-2 ml-3 pl-3 pr-3" style="text-transform: uppercase"><font-awesome-icon icon="ban"/></button>
    </span>
      <a  @click="pinSidebar" class="pull-right " style="display: block;  padding-left: 100px; width: 50px; padding-right: 15px;" v-bind:style=" {marginTop: isThumbtackDown ? '0px' : '-30px' }">&ensp;
        <font-awesome-icon icon="thumbtack" class="pull-right rotate" style="margin-top: 10px;" v-bind:class=" {down : isThumbtackDown}"/>
      </a>
    </div>

      <div v-bind:style="{height: navBarHeight +'px'}" class="p-0"  v-if="activeSearchParams!==null">
      <span @click="setAction('cancel')" class="p-0 pl-2 pr-2 actionBtn" style="bottom: 9%; " v-if="!sidebarOpen">
          {{$t('buttons.cancel')}}&ensp;
          <font-awesome-icon icon="ban" class="pull-right mr-1" style="color:#dc3545;margin-top: 10px;"/>
        </span>
        <span @click="setAction('save')" class="p-0 pr-2 pl-2 actionBtn" style="bottom: 27%; " v-if="!sidebarOpen">
           {{ $t('edit.buttons.save')}}&ensp;<font-awesome-icon icon="save" class="pull-right mr-1"
                                                                style="color:#28a745;margin-top: 10px; "/>
         </span>
        <span class="ml-2" v-if="sidebarOpen && activeSearchParams !== null">
        <br><span class="ml-2"  style="font-size: medium">{{$t(activeSearchParams.title)}}</span>


        <li class="element-list" :class="{active : parseInt($route.params.id) === entity.id }" style="display: block;"
            v-for="entity in sidebarList.results" v-if="sidebarList.results && sidebarList.results.length > 0">
           <router-link :to="{ path: '/'+activeSearchParams.object+'/' + entity.id }" :title="$t('editSite.editMessage')">
             &ensp;{{entity.id}} - {{entity[activeSearchParams.field]}}
      </router-link>

        </li>
      </span>
        <span class="ml-1"  v-if="sidebarOpen && sidebarList.results &&  sidebarList.results.length > 0">
        <button @click="previousPage" v-if="sidebarList.totalPages && activeSearchParams.search.page > 1" class="btn btn-xs btn-outline-info ml-2 mt-2 p-1 pull-left" style="text-transform: uppercase; width: 3rem"><font-awesome-icon icon="angle-double-left"/> </button>
        <button @click="nextPage" v-if="sidebarList.totalPages  && activeSearchParams.search.page < sidebarList.totalPages" class="btn btn-xs btn-outline-info mr-2 mt-2 p-1 pull-right" style="text-transform: uppercase;width: 3rem"> <font-awesome-icon icon="angle-double-right"/></button>
      </span>
      </div>
    </sidebar-wrapper>

  </transition>

</template>

<script>

  import fontAwesomeLib from './../mixins/fontAwasomeLib'
  import SidebarWrapper from "./SidebarWrapper";
  import cloneDeep from 'lodash/cloneDeep'
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
        isThumbtackDown: false,
        componentKey: 0,
        navBarHeight: 300,
        page:1,
      }
    },
    computed: {
      activeSearchParams() { return this.$store.state['activeSearchParams'] },
      sidebarList() {
        return this.$store.state['sidebarList']
      }
    },
    created() {
      if(this.$store.state['activeSearchParams'] !== null) {
        this.$store.dispatch(this.$store.state['activeSearchParams'].request)
      }

    },

    mounted() {
      this.navBarHeight = document.querySelector('.nav-side-menu').clientHeight - 200

      if (this.$localStorage.get('sidebar') !== null) {
        this.isThumbtackDown = !this.$localStorage.get('sidebar');
        this.sidebarOpen = this.$localStorage.get('sidebar');
        this.$root.$emit('show-sidebar', this.$localStorage.get('sidebar'))
        this.forceRerender()
        ;
      }
    },
    methods: {
      setActiveSection(section) {

        // this.$root.$emit('sidebar-user-action', {action: 'navigate',choice:section})
      },

      setAction(action, choice) {
        // this.$root.$emit('sidebar-user-action', {action: action})
        if (action === 'navigate') this.activeSection = choice;

        this.$store.commit("SET_SIDEBAR_USER_ACTION", {userAction: {action: action, choice:choice} })
      },
      forceRerender() {
        this.componentKey += 1;
      },
      pinSidebar() {
        this.isThumbtackDown = !this.isThumbtackDown;
        this.sidebarOpen = !this.sidebarOpen;
        this.$root.$emit('show-sidebar',this.sidebarOpen);
        this.$localStorage.set('sidebar',this.sidebarOpen)
        // this.$parent.sidebarOpen = !this.$parent.sidebarOpen;
        // this.sidebarOpen ? document.getElementById('thumbtack-icon').classList.toggle("down") : document.getElementById('thumbtack-icon').classList.remove("down");
        this.forceRerender()
      },
      deleteSearchPreferences() {
        this.$localStorage.remove(this.activeSearchParams.searchHistory)
        this.$store.state.activeSearchParams.search = cloneDeep(this.activeSearchParams.defaultSearch)
      },
      previousPage() {
        this.$store.state.activeSearchParams.search.page = this.$store.state.activeSearchParams.search.page-1
      },
      nextPage(){
        this.$store.state.activeSearchParams.search.page = this.$store.state.activeSearchParams.search.page+1
      }
    },
    watch: {
      'activeSearchParams': {
        handler: function (newval, oldval) {
          if(newval === null) return
          this.$store.dispatch(newval.request)
        },
        deep: true
      },
      'sidebarList': {
        handler: function (newval, oldval) {

        },
        deep: true
      },


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
    margin-right: -40px;
    right: 0;
    position: absolute;
    letter-spacing: 2px;;
    text-transform: uppercase;
    transform: rotate(90deg);
    min-width: 113px;

  }
  .fade-sidebar-leave-active {
    transition: opacity .2s;
  }
  .fade-sidebar-enter-active {
    transition: opacity .7s;
  }
  .fade-sidebar-enter, .fade-sidebar-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0.1;
  }
</style>
