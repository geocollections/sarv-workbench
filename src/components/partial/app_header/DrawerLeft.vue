<template>
  <v-navigation-drawer
    v-model="drawerState"
    app
    clipped
    mobile-breakpoint="992"
    :dark="isDrawerDark"
    :color="drawerColor"
    style="z-index: 1100"
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
          <v-list-item-title>{{ $t("header.title") }}</v-list-item-title>
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
        v-if="allowedRouteLinksSpecial && allowedRouteLinksSpecial.length > 0"
        prepend-icon="fas fa-university"
        append-icon="fas fa-angle-down"
        :color="drawerActiveColor"
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ $t("header.curation") }}</v-list-item-title>
        </template>

        <v-list-group
          sub-group
          :color="drawerActiveColor"
          v-for="entity in allowedRouteLinksSpecial"
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
        v-if="isDevUrl && isUserSuperuser"
        :to="{ path: '/test-dev' }"
        :color="drawerActiveColor"
      >
        <v-list-item-title>Test interface</v-list-item-title>
        <v-list-item-icon>
          <v-icon>fas fa-code</v-icon>
        </v-list-item-icon>
      </v-list-item>

      <!-- HIERARCHY UPDATE -->
      <v-list-item
        v-if="isDevUrl && isUserSuperuser"
        :to="{ path: '/hierarchy_update' }"
        :color="drawerActiveColor"
      >
        <v-list-item-title>Hierarchy update</v-list-item-title>
        <v-list-item-icon>
          <v-icon>fas fa-sitemap</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";

export default {
  name: "DrawerLeft",
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
    userShortcuts: {
      type: Array,
      required: false,
    },
    isDrawerDark: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawerColor: {
      type: String,
      required: false,
      default: "white",
    },
    drawerActiveColor: {
      type: String,
      required: false,
      default: "black",
    },
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
              icon: "far fa-image",
            },
            {
              title: "specimenImage",
              path: "/attachment/add/specimen_image",
              icon: "fas fa-image",
            },
            {
              title: "otherFiles",
              path: "/attachment/add/other_file",
              icon: "far fa-file",
            },
            {
              title: "digitisedReference",
              path: "/attachment/add/digitised_reference",
              icon: "far fa-file-pdf",
            },
            { title: "imagesets", path: "/imageset", icon: "fas fa-images" },
          ],
        },
        {
          name: "reference",
          title: "references",
          links: [
            { title: "myReferences", path: "/reference", icon: "fas fa-book" },
            { title: "libraries", path: "/library", icon: "far fa-list-alt" },
            { title: "journals", path: "/journal", icon: "fas fa-newspaper" },
            { title: "keywords", path: "/keyword", icon: "fas fa-scroll" },
          ],
        },
        {
          name: "project",
          title: "projects",
          links: [
            { title: "editProject", path: "/project", icon: "fas fa-tasks" },
          ],
        },
        {
          name: "locality",
          title: "localities",
          links: [
            {
              title: "localities",
              path: "/locality",
              icon: "fas fa-map-marked-alt",
            },
          ],
        },
        {
          name: "drillcore",
          title: "drillcores",
          links: [
            {
              title: "drillcores",
              path: "/drillcore",
              icon: "fas fa-box",
            },
            {
              title: "drillcoreBoxes",
              path: "/drillcore_box",
              icon: "fas fa-boxes",
            },
          ],
        },
        {
          name: "site",
          title: "sites",
          links: [
            { title: "editSite", path: "/site", icon: "fas fa-globe" },
            {
              title: "editSiteGroundwater",
              path: "/site_groundwater",
              icon: "fas fa-water",
            },
            {
              title: "areas",
              path: "/area",
              icon: "fas fa-chart-area",
            },
          ],
        },
        {
          name: "sample",
          title: "samples",
          links: [
            { title: "samples", path: "/sample", icon: "fas fa-vial" },
            {
              title: "sample_import",
              path: "/sample/import",
              icon: "fas fa-file-import",
            },
            {
              title: "sample_series",
              path: "/sample_series",
              icon: "fas fa-vials",
            },
            {
              title: "editPreparation",
              path: "/preparation",
              icon: "fas fa-prescription-bottle",
            },
          ],
        },
        {
          name: "analysis",
          title: "analyses",
          links: [
            {
              title: "editAnalysis",
              path: "/analysis",
              icon: "far fa-chart-bar",
            },
            {
              title: "analysis_import",
              path: "/analysis/import",
              icon: "fas fa-file-import",
            },
            {
              title: "editAnalysisParameter",
              path: "/analysis_parameter",
              icon: "fas fa-percent",
            },
            {
              title: "editAnalysisMethod",
              path: "/analysis_method",
              icon: "fas fa-screwdriver",
            },
          ],
        },
        {
          name: "dataset",
          title: "datasets",
          links: [
            {
              title: "datasets",
              path: "/dataset",
              icon: "fas fa-database",
            },
          ],
        },
        {
          name: "doi",
          title: "dois",
          links: [{ title: "dois", path: "/doi", icon: "fas fa-database" }],
        },
        {
          name: "specimen",
          title: "specimens",
          links: [
            { title: "specimens", path: "/specimen", icon: "fas fa-fish" },
            { title: "collections", path: "/collection", icon: "fas fa-boxes" },
          ],
        },
        {
          name: "taxon",
          title: "classifications",
          links: [
            { title: "taxa", path: "/taxon", icon: "fas fa-pastafarianism" },
            { title: "rocks", path: "/rock", icon: "far fa-gem" },
          ],
        },
        {
          name: "stratigraphy",
          title: "stratigraphies",
          links: [
            {
              title: "stratigraphies",
              path: "/stratigraphy",
              icon: "fas fa-layer-group",
            },
            {
              title: "stratigraphy_catalogue",
              path: "/stratigraphy_catalogue",
              icon: "fas fa-th-list",
            },
          ],
        },
        {
          name: "selection_series",
          title: "selectionSeries",
          links: [
            {
              title: "selectionSeries",
              path: "/selection_series",
              icon: "fas fa-clipboard-list",
            },
          ],
        },
        {
          name: "agent",
          title: "agents",
          links: [
            {
              title: "agents",
              path: "/agent",
              icon: "fas fa-users",
            },
          ],
        },
      ],
      routeLinksSpecial: [
        {
          name: "location",
          title: "locations",
          links: [
            {
              title: "locations",
              path: "/location",
              icon: "fas fa-location-arrow",
            },
          ],
        },
        {
          name: "visit",
          title: "visits",
          links: [
            {
              title: "visits",
              path: "/visit",
              icon: "fas fa-user-friends",
            },
          ],
        },
        {
          name: "loan",
          title: "loans",
          links: [
            {
              title: "loans",
              path: "/loan",
              icon: "fas fa-people-carry",
            },
          ],
        },
        {
          name: "accession",
          title: "accessions",
          links: [
            {
              title: "accessions",
              path: "/accession",
              icon: "far fa-handshake",
            },
          ],
        },
        {
          name: "deaccession",
          title: "deaccessions",
          links: [
            {
              title: "deaccessions",
              path: "/deaccession",
              icon: "fas fa-handshake-slash",
            },
          ],
        },
        {
          name: "web_news",
          title: "web_news",
          links: [
            {
              title: "web_news",
              path: "/web_news",
              icon: "far fa-newspaper",
            },
          ],
        },
        {
          name: "web_pages",
          title: "web_pages",
          links: [
            {
              title: "web_pages",
              path: "/web_pages",
              icon: "fas fa-pager",
            },
            {
              title: "editTaxonPage",
              path: "/taxon_page",
              icon: "fas fa-pager",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapFields("settings", ["drawerState"]),

    ...mapGetters("user", ["isUserSuperuser"]),

    allowedRouteLinks() {
      return this.routeLinks.filter((link) =>
        this.isUserAllowedTo("add", link.name)
      );
    },

    allowedRouteLinksSpecial() {
      return this.routeLinksSpecial.filter((link) =>
        this.isUserAllowedTo("add", link.name)
      );
    },

    filteredRouteLinks() {
      return this.allowedRouteLinks.filter((parentLink) => {
        if (parentLink.name === "project") {
          if (this.activeProject && this.activeProject.id) {
            if (parentLink.links.length === 2) {
              parentLink.links.push({
                title: "activeProject",
                path: `/project/${this.activeProject.id}`,
                icon: "fas fa-tag",
              });
            }
          } else parentLink.links.splice(2, 1);
        } else if (parentLink.name === "site") {
          if (this.activeSite && this.activeSite.id) {
            if (parentLink.links.length === 4) {
              parentLink.links.push({
                title: "activeSite",
                path: `/site/${this.activeSite.id}`,
                icon: "fas fa-map-marker-alt",
              });
            }
          } else parentLink.links.splice(4, 1);
        } else if (parentLink.name === "sample") {
          if (this.activeSample && this.activeSample.id) {
            if (parentLink.links.length === 6) {
              parentLink.links.push({
                title: "activeSample",
                path: `/sample/${this.activeSample.id}`,
                icon: "fas fa-fill-drip",
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
        document.location.origin.includes("edit2") ||
        document.location.origin.includes("edit3")
      );
    },

    ...mapState("search", ["activeProject", "activeSite", "activeSample"]),
    ...mapGetters("user", ["isUserAllowedTo"]),
  },
};
</script>
