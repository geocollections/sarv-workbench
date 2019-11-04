<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    @input="changeDrawerState"
    mobile-break-point="992"
    disable-resize-watcher
    :dark="isDrawerDark"
    :color="drawerColor"
  >
    <template v-slot:prepend>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>far fa-user</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{
            `${currentUser.forename} ${currentUser.surename}`
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider class="mt-0"></v-divider>

    <v-list expand dense>
      <!-- USER SHORTCUTS -->
      <v-list-group
        v-if="userShortcuts.length > 0"
        class="d-block d-md-none"
        prepend-icon="fas fa-link"
        append-icon="fas fa-angle-down"
        :color="drawerActiveColor"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ $t("settings.shortcuts") }}</v-list-item-title>
        </template>

        <v-list-item
          v-for="(entity, index) in userShortcuts"
          :key="index"
          :to="{ path: entity.path }"
          :color="drawerActiveColor"
        >
          <v-list-item-title v-text="entity.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>

      <!-- ROUTES -->
      <v-list-group
        v-if="allowedRouteLinks.length > 0"
        prepend-icon="fas fa-home"
        append-icon="fas fa-angle-down"
        :color="drawerActiveColor"
        :value="true"
      >
        <template v-slot:activator>
          <v-list-item-title>SARV2</v-list-item-title>
        </template>

        <v-list-group
          sub-group
          :color="drawerActiveColor"
          v-for="entity in allowedRouteLinks"
          :key="entity.title"
          v-model="entity.state"
        >
          <template v-slot:activator>
            <v-list-item-title
              v-text="$t(`header.${entity.title}`)"
            ></v-list-item-title>
          </template>

          <v-list-item
            v-for="(link, index) in entity.links"
            :to="{ path: link.path }"
            :key="index"
            :color="drawerActiveColor"
            exact
          >
            <v-list-item-title
              style="white-space: unset"
              v-text="$t(`header.${link.title}`)"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon v-text="link.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DrawerLeft",
  props: {
    drawerState: {
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    userShortcuts: {
      type: Array,
      required: false
    },
    isDrawerDark: {
      type: Boolean,
      required: false,
      default: false
    },
    drawerColor: {
      type: String,
      required: false,
      default: "white"
    },
    drawerActiveColor: {
      type: String,
      required: false,
      default: "black"
    }
  },
  data() {
    return {
      activeSite: false,
      activeSample: false,
      routeLinks: [
        {
          name: "attachment",
          title: "files",
          links: [
            { title: "myFiles", path: "/attachment", icon: "far fa-folder" },
            {
              title: "photoArchive",
              path: "/attachment/add/photo_archive",
              icon: "far fa-image"
            },
            {
              title: "specimenImage",
              path: "/attachment/add/specimen_image",
              icon: "fas fa-image"
            },
            {
              title: "otherFiles",
              path: "/attachment/add/other_file",
              icon: "far fa-file"
            },
            {
              title: "digitisedReference",
              path: "/attachment/add/digitised_reference",
              icon: "far fa-file-pdf"
            },
            { title: "imageset", path: "/imageset/add", icon: "far fa-images" }
          ]
        },
        {
          name: "reference",
          title: "references",
          links: [
            { title: "myReferences", path: "/reference", icon: "fas fa-book" },
            {
              title: "reference",
              path: "/reference/add",
              icon: "far fa-plus-square"
            },
            { title: "libraries", path: "/library", icon: "far fa-list-alt" },
            {
              title: "library",
              path: "/library/add",
              icon: "far fa-plus-square"
            },
            { title: "journals", path: "/journal", icon: "fas fa-newspaper" },
            {
              title: "journal",
              path: "/journal/add",
              icon: "far fa-plus-square"
            },
            { title: "keywords", path: "/keyword", icon: "fas fa-scroll" },
            {
              title: "keyword",
              path: "/keyword/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "doi",
          title: "dois",
          links: [
            { title: "dois", path: "/doi", icon: "fas fa-database" },
            { title: "doi", path: "/doi/add", icon: "far fa-plus-square" }
          ]
        },
        {
          name: "project",
          title: "projects",
          links: [
            { title: "editProject", path: "/project", icon: "fas fa-table" },
            {
              title: "addProject",
              path: "/project/add",
              icon: "far fa-plus-square"
            },
            { title: "activeProject", path: "", icon: "fas fa-globe-americas" }
          ]
        },
        {
          name: "site",
          title: "sites",
          links: [
            { title: "editSite", path: "/site", icon: "fas fa-globe" },
            { title: "addSite", path: "/site/add", icon: "far fa-plus-square" },
            { title: "activeSite", path: "", icon: "fas fa-map-marker-alt" }
          ]
        },
        {
          name: "locality",
          title: "localities",
          links: [
            {
              title: "localities",
              path: "/locality",
              icon: "fas fa-map-marked-alt"
            },
            {
              title: "locality",
              path: "/locality/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "sample",
          title: "samples",
          links: [
            { title: "samples", path: "/sample", icon: "fas fa-vials" },
            {
              title: "sample",
              path: "/sample/add",
              icon: "far fa-plus-square"
            },
            { title: "activeSample", path: "", icon: "fas fa-fill-drip" }
          ]
        },
        {
          name: "analysis",
          title: "analyses",
          links: [
            {
              title: "editAnalysis",
              path: "/analysis",
              icon: "far fa-chart-bar"
            },
            {
              title: "addAnalysis",
              path: "/analysis/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "taxon",
          title: "taxa",
          links: [
            { title: "taxa", path: "/taxon", icon: "fas fa-pastafarianism" },
            {
              title: "taxon",
              path: "/taxon/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "specimen",
          title: "specimens",
          links: [
            { title: "specimens", path: "/specimen", icon: "fas fa-fish" },
            {
              title: "specimen",
              path: "/specimen/add",
              icon: "far fa-plus-square"
            },
            { title: "collections", path: "/collection", icon: "fas fa-boxes" },
            {
              title: "collection",
              path: "/collection/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "selection_series",
          title: "selection_series",
          links: [
            {
              title: "selection_series",
              path: "/selection_series",
              icon: "fas fa-clipboard-list"
            },
            {
              title: "selection_series",
              path: "/selection_series/add",
              icon: "far fa-plus-square"
            }
          ]
        }
      ]
    };
  },
  computed: {
    allowedRouteLinks() {
      return this.routeLinks.filter(link =>
        this.isUserAllowedTo("add", link.name)
      );
    },

    activeProject() {
      if (this.$store.state["activeProject"] !== null)
        return this.$store.state["activeProject"];
      else return "";
    },

    ...mapGetters(["isUserAllowedTo"])
  },
  created() {
    // Todo: Add them to store because it needs to be updated
    this.activeSite = this.$localStorage.get("activeSite");
    if (this.activeSite) {
      this.routeLinks
        .find(linkObject => linkObject.name === "site")
        ["links"].find(link => link.title === "activeSite").path =
        "/site/" + this.activeSite;
    } else this.activeSite = "";

    this.activeSample = this.$localStorage.get("activeSample");
    if (this.activeSample) {
      this.routeLinks
        .find(linkObject => linkObject.name === "sample")
        ["links"].find(link => link.title === "activeSample").path =
        "/sample/" + this.activeSample;
    } else this.activeSample = "";
  },
  methods: {
    changeDrawerState(drawerState) {
      this.$emit("update:drawerState", drawerState);
    }
  }
};
</script>

<style scoped></style>
