<template>
  <v-navigation-drawer
    :value="drawerState"
    app
    clipped
    @input="changeDrawerState"
    mobile-break-point="992"
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

    <v-divider class="mt-0" />

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
          <v-list-item-title v-text="entity.title" />
        </v-list-item>
      </v-list-group>

      <!-- ROUTES -->
      <v-list-group
        v-if="filteredRouteLinks.length > 0"
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
          v-for="entity in filteredRouteLinks"
          :key="entity.title"
          v-model="entity.state"
        >
          <template v-slot:activator>
            <v-list-item-title v-text="$t(`header.${entity.title}`)" />
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
            />
            <v-list-item-icon>
              <v-icon v-text="link.icon" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>

      <!-- ROUTES SPECIAL -->
      <v-list-group
        prepend-icon="fas fa-user-tag"
        append-icon="fas fa-angle-down"
        :color="drawerActiveColor"
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>{{
            $t("header.special_functions")
          }}</v-list-item-title>
        </template>

        <v-list-group
          sub-group
          :color="drawerActiveColor"
          v-for="entity in routeLinksSpecial"
          :key="entity.title"
          v-model="entity.state"
        >
          <template v-slot:activator>
            <v-list-item-title v-text="$t(`header.${entity.title}`)" />
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
            />
            <v-list-item-icon>
              <v-icon v-text="link.icon" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-group>

      <!-- TEST-DEV -->
      <v-list-item
        v-if="isDevUrl && isDevUser"
        :to="{ path: '/test-dev' }"
        :color="drawerActiveColor"
      >
        <v-list-item-title>Test POST interface</v-list-item-title>
        <v-list-item-icon>
          <v-icon>fas fa-code</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from "vuex";

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
            { title: "editProject", path: "/project", icon: "fas fa-tasks" },
            {
              title: "addProject",
              path: "/project/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "site",
          title: "sites",
          links: [
            { title: "editSite", path: "/site", icon: "fas fa-globe" },
            { title: "addSite", path: "/site/add", icon: "far fa-plus-square" },
            {
              title: "areas",
              path: "/area",
              icon: "fas fa-chart-area"
            },
            {
              title: "area",
              path: "/area/add",
              icon: "far fa-plus-square"
            }
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
          name: "stratigraphy",
          title: "stratigraphies",
          links: [
            {
              title: "stratigraphies",
              path: "/stratigraphy",
              icon: "fas fa-layer-group"
            },
            {
              title: "stratigraphy",
              path: "/stratigraphy/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "sample",
          title: "samples",
          links: [
            { title: "samples", path: "/sample", icon: "fas fa-vial" },
            {
              title: "sample",
              path: "/sample/add",
              icon: "far fa-plus-square"
            },
            {
              title: "editAnalysis",
              path: "/analysis",
              icon: "far fa-chart-bar"
            },
            {
              title: "addAnalysis",
              path: "/analysis/add",
              icon: "far fa-plus-square"
            },
            {
              title: "editPreparation",
              path: "/preparation",
              icon: "fas fa-vials"
            },
            {
              title: "addPreparation",
              path: "/preparation/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "taxon",
          title: "classifications",
          links: [
            { title: "taxa", path: "/taxon", icon: "fas fa-pastafarianism" },
            {
              title: "taxon",
              path: "/taxon/add",
              icon: "far fa-plus-square"
            },
            { title: "rocks", path: "/rock", icon: "far fa-gem" },
            {
              title: "rock",
              path: "/rock/add",
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
            },
            {
              title: "locations",
              path: "/location",
              icon: "fas fa-location-arrow"
            },
            {
              title: "location",
              path: "/location/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "selection_series",
          title: "selectionSeries",
          links: [
            {
              title: "selectionSeries",
              path: "/selection_series",
              icon: "fas fa-clipboard-list"
            },
            {
              title: "selectionSerie",
              path: "/selection_series/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "agent",
          title: "agents",
          links: [
            {
              title: "agents",
              path: "/agent",
              icon: "fas fa-users"
            },
            {
              title: "agent",
              path: "/agent/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "drillcore",
          title: "drillcores",
          links: [
            {
              title: "drillcores",
              path: "/drillcore",
              icon: "fas fa-box"
            },
            {
              title: "drillcore",
              path: "/drillcore/add",
              icon: "far fa-plus-square"
            },
            {
              title: "drillcoreBoxes",
              path: "/drillcore_box",
              icon: "fas fa-boxes"
            },
            {
              title: "drillcoreBox",
              path: "/drillcore_box/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "dataset",
          title: "datasets",
          links: [
            {
              title: "datasets",
              path: "/dataset",
              icon: "fas fa-database"
            },
            {
              title: "dataset",
              path: "/dataset/add",
              icon: "far fa-plus-square"
            }
          ]
        }
      ],
      routeLinksSpecial: [
        {
          name: "accession",
          title: "accessions",
          links: [
            {
              title: "accessions",
              path: "/accession",
              icon: "far fa-handshake"
            },
            {
              title: "accession",
              path: "/accession/add",
              icon: "far fa-plus-square"
            }
          ]
        },
        {
          name: "deaccession",
          title: "deaccessions",
          links: [
            {
              title: "deaccessions",
              path: "/deaccession",
              icon: "fas fa-handshake-slash"
            },
            {
              title: "deaccession",
              path: "/deaccession/add",
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

    filteredRouteLinks() {
      return this.allowedRouteLinks.filter(parentLink => {
        if (parentLink.name === "project") {
          if (this.activeProject && this.activeProject.id) {
            if (parentLink.links.length === 2) {
              parentLink.links.push({
                title: "activeProject",
                path: `/project/${this.activeProject.id}`,
                icon: "fas fa-tag"
              });
            }
          } else parentLink.links.splice(2, 1);
        } else if (parentLink.name === "site") {
          if (this.activeSite && this.activeSite.id) {
            if (parentLink.links.length === 4) {
              parentLink.links.push({
                title: "activeSite",
                path: `/site/${this.activeSite.id}`,
                icon: "fas fa-map-marker-alt"
              });
            }
          } else parentLink.links.splice(4, 1);
        } else if (parentLink.name === "sample") {
          if (this.activeSample && this.activeSample.id) {
            if (parentLink.links.length === 6) {
              parentLink.links.push({
                title: "activeSample",
                path: `/sample/${this.activeSample.id}`,
                icon: "fas fa-fill-drip"
              });
            }
          } else parentLink.links.splice(6, 1);
        }
        return true;
      });
    },

    isDevUrl() {
      return (
        document.location.origin.includes("localhost") ||
        document.location.origin.includes("edit2")
      );
    },

    isDevUser() {
      return (
        this.currentUser &&
        (this.currentUser.user === "enar" ||
          this.currentUser.user === "olle" ||
          this.currentUser.user === "urtson")
      );
    },

    ...mapState(["activeProject", "activeSite", "activeSample"]),
    ...mapGetters(["isUserAllowedTo"])
  },
  methods: {
    changeDrawerState(drawerState) {
      this.$emit("update:drawerState", drawerState);
    }
  }
};
</script>

<style scoped />
