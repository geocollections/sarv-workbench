import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import { fetchIsLoggedIn, fetchLogout } from "./assets/js/api/apiCalls";
import store from "./store";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    // savedPosition is only available for popstate navigations https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event, for example forward and back buttons.
    if (savedPosition) {
      return savedPosition;
    } else {
      // if same route like /doi or /reference and only id changes then sets previous scrollbar location
      if (isSameRoute(to, from))
        return {
          x: from?.meta?.scrollbar?.x || 0,
          y: from?.meta?.scrollbar?.y || 0
        };
      else return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      name: "Geocollections Data Management",
      component: Login,
      meta: {
        isLogin: true,
        requiresAuth: false
      }
    },
    {
      path: "/dashboard",
      component: Dashboard,
      children: [
        {
          path: "",
          component: () => import("./components/dashboard/FrontPage.vue"),
          meta: {
            requiresAuth: true,
            object: "dashboard"
          }
        },
        {
          path: "/settings",
          component: () => import("./views/Settings.vue"),
          meta: {
            requiresAuth: true,
            object: "settings"
          }
        },
        {
          path: "/admin",
          component: () => import("./views/Admin.vue"),
          meta: {
            requiresAuth: true,
            object: "admin"
          },
          beforeEnter: (to, from, next) => {
            if (store?.getters?.["user/isUserSuperuser"]) next();
            else next("/");
          }
        },
        {
          path: "/attachment",
          component: () => import("./views/Attachments.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/attachment/AttachmentTable.vue"),
              meta: {
                requiresAuth: true,
                object: "attachment",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/attachment/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: true,
                table: "attachment",
                heading: "editAttachment.heading",
                requiresAuth: true,
                object: "attachment"
              }
            }
          ]
        },
        {
          path: "/attachment/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              redirect: "photo_archive",
              name: "Attachment add",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "header.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "header.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "header.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "header.digitisedReference"
                  }
                ],
                requiresAuth: true,
                object: "attachment"
              }
            },
            {
              path: "photo_archive",
              name: "photo_archive add",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "header.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "header.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "header.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "header.digitisedReference"
                  }
                ],
                requiresAuth: true,
                object: "attachment",
                child: "photo_archive"
              }
            },
            {
              path: "specimen_image",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "header.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "header.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "header.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "header.digitisedReference"
                  }
                ],
                requiresAuth: true,
                object: "attachment",
                child: "specimen_image"
              }
            },
            {
              path: "other_file",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "header.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "header.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "header.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "header.digitisedReference"
                  }
                ],
                requiresAuth: true,
                object: "attachment",
                child: "other_file"
              }
            },
            {
              path: "digitised_reference",
              component: () => import("./components/attachment/Attachment.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "header.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "header.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "header.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "header.digitisedReference"
                  }
                ],
                requiresAuth: true,
                object: "attachment",
                child: "digitised_reference"
              }
            }
          ]
        },
        {
          path: "/reference",
          component: () => import("./views/References.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/reference/ReferenceTable.vue"),
              meta: {
                requiresAuth: true,
                table: "reference",
                isTableView: true,
                object: "reference"
              }
            }
          ]
        },
        {
          path: "/reference/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/reference/Reference.vue"),
              meta: {
                isEdit: true,
                table: "reference",
                heading: "editReference.heading",

                requiresAuth: true,
                object: "reference"
              }
            }
          ]
        },
        {
          path: "/reference/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "reference add",
              component: () => import("./components/reference/Reference.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addReference",
                subForms: [
                  {
                    path: "/reference/add",
                    name: "common.reference"
                  }
                ],
                requiresAuth: true,
                object: "reference"
              }
            }
          ]
        },
        {
          path: "/imageset/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/imageset/Imageset.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addImageset",
                subForms: [{ path: "/imageset/add", name: "header.imageset" }],
                requiresAuth: true,
                object: "imageset"
              }
            }
          ]
        },
        {
          path: "/journal",
          component: () => import("./views/Journals.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/journal/JournalTable.vue"),
              meta: {
                requiresAuth: true,
                object: "journal",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/journal/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/journal/Journal.vue"),
              meta: {
                isEdit: true,
                table: "journal",
                heading: "editJournal.heading",
                requiresAuth: true,
                object: "journal"
              }
            }
          ]
        },
        {
          path: "/journal/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/journal/Journal.vue"),
              meta: {
                isEdit: false,
                addNew: "header.journal",
                subForms: [{ path: "/journal/add", name: "header.journal" }],
                requiresAuth: true,
                object: "journal"
              }
            }
          ]
        },
        {
          path: "/locality",
          component: () => import("./views/Localities.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/locality/LocalityTable.vue"),
              meta: {
                requiresAuth: true,
                object: "locality",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/locality/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/locality/Locality.vue"),
              meta: {
                isEdit: true,
                table: "locality",
                heading: "editLocality.heading",
                requiresAuth: true,
                object: "locality"
              }
            }
          ]
        },
        {
          path: "/locality/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/locality/Locality.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addLocality",
                subForms: [{ path: "/locality/add", name: "header.locality" }],
                requiresAuth: true,
                object: "locality"
              }
            }
          ]
        },
        {
          path: "/sample",
          component: () => import("./views/Samples.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/sample/SampleTable.vue"),
              meta: {
                requiresAuth: true,
                table: "sample",
                object: "sample",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/sample/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Sample edit",
              component: () => import("./components/sample/Sample.vue"),
              meta: {
                isEdit: true,
                table: "sample",
                heading: "editSample.heading",
                requiresAuth: true,
                object: "sample"
              }
            }
          ]
        },
        {
          path: "/sample/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Sample add",
              component: () => import("./components/sample/Sample.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addSample",
                subForms: [{ path: "/sample/add", name: "header.sample" }],
                requiresAuth: true,
                object: "sample"
              }
            }
          ]
        },
        {
          path: "/sample/import",
          name: "Sample import",
          component: () => import("./views/Import.vue"),
          meta: {
            requiresAuth: true,
            object: "sample"
          }
        },
        {
          path: "/project",
          component: () => import("./views/Projects.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/project/ProjectTable.vue"),
              meta: {
                requiresAuth: true,
                object: "project",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/project/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/project/Project.vue"),

              children: [
                {
                  path: "",
                  component: () => import("./components/site/SiteTable.vue"),

                  //belongs to project
                  meta: {
                    isEdit: false,
                    addNew: "header.addProject",
                    subForms: [
                      { path: "/project/add", name: "editProject.heading" }
                    ],
                    requiresAuth: true,
                    object: "project"
                  }
                }
              ]
            }
          ]
        },
        {
          path: "/project/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/project/Project.vue"),

              children: [
                {
                  path: "",
                  component: () => import("./components/site/SiteTable.vue"),
                  //belongs to project
                  meta: {
                    isEdit: true,
                    table: "project",
                    heading: "editProject.heading",
                    // isSidebarShown: true,
                    requiresAuth: true,
                    object: "project"
                  }
                }
              ]
            }
          ]
        },
        {
          path: "/site",
          component: () => import("./views/Sites.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/site/SiteTable.vue"),
              meta: {
                requiresAuth: true,
                object: "site",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/site/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Site edit",
              component: () => import("./components/site/Site.vue"),
              meta: {
                isEdit: true,
                table: "site",
                heading: "editSite.heading",
                // isSidebarShown: true,
                requiresAuth: true,
                object: "site"
              }
            }
          ]
        },
        {
          path: "/site/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Site add",
              component: () => import("./components/site/Site.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addSite",
                subForms: [{ path: "/site/add", name: "editSite.heading" }],
                requiresAuth: true,
                object: "site"
              }
            }
          ]
        },
        // {
        //   path: "/site/import",
        //   name: "Site import",
        //   component: () => import("./views/Import.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     object: "site"
        //   }
        // },
        {
          path: "/library",
          component: () => import("./views/Libraries.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/library/LibraryTable.vue"),
              meta: {
                requiresAuth: true,
                object: "library",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/library/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/library/Library.vue"),
              meta: {
                isEdit: true,
                table: "library",
                heading: "editLibrary.heading",
                requiresAuth: true,
                object: "library"
              }
            }
          ]
        },
        {
          path: "/library/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/library/Library.vue"),
              meta: {
                isEdit: false,
                addNew: "header.library",
                subForms: [{ path: "/library/add", name: "header.library" }],
                requiresAuth: true,
                object: "library"
              }
            }
          ]
        },
        {
          path: "/doi",
          component: () => import("./views/Dois.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/doi/DoiTable.vue"),
              meta: {
                requiresAuth: true,
                object: "doi",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/doi/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/doi/Doi.vue"),
              meta: {
                isEdit: true,
                table: "doi",
                heading: "editDoi.heading",
                requiresAuth: true,
                object: "doi"
              }
            }
          ]
        },
        {
          path: "/doi/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/doi/Doi.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addDoi",
                subForms: [{ path: "/doi/add", name: "header.doi" }],
                requiresAuth: true,
                object: "doi"
              },
              children: [
                {
                  path: "egf/:id(\\d+)",
                  component: () => import("./components/doi/Doi.vue"),
                  meta: {
                    isEdit: false,
                    isEGF: true,
                    addNew: "header.addDoiEgf",
                    subForms: [{ path: "/doi/add", name: "header.doi" }],
                    requiresAuth: true,
                    object: "doi"
                  }
                }
              ]
            }
          ]
        },
        {
          path: "/analysis",
          component: () => import("./views/Analyses.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/analysis/AnalysisTable.vue"),
              meta: {
                requiresAuth: true,
                object: "analysis",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/analysis/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/analysis/Analysis.vue"),
              meta: {
                isEdit: true,
                table: "analysis",
                heading: "editAnalysis.heading",
                requiresAuth: true,
                object: "analysis"
              }
            }
          ]
        },
        {
          path: "/analysis/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Analysis add",
              component: () => import("./components/analysis/Analysis.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAnalysis",
                subForms: [{ path: "/analysis/add", name: "header.analysis" }],
                requiresAuth: true,
                object: "analysis"
              }
            }
          ]
        },
        {
          path: "/analysis/import",
          name: "Analysis import",
          component: () => import("./views/Import.vue"),
          meta: {
            requiresAuth: true,
            object: "analysis"
          }
        },
        {
          path: "/specimen",
          component: () => import("./views/Specimens.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/specimen/SpecimenTable.vue"),
              meta: {
                requiresAuth: true,
                object: "specimen",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/specimen/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/specimen/Specimen.vue"),
              meta: {
                isEdit: true,
                table: "specimen",
                heading: "editSpecimen.heading",
                requiresAuth: true,
                object: "specimen"
              }
            }
          ]
        },
        {
          path: "/specimen/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Specimen add",
              component: () => import("./components/specimen/Specimen.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addSpecimen",
                subForms: [{ path: "/specimen/add", name: "header.specimen" }],
                requiresAuth: true,
                object: "specimen"
              }
            }
          ]
        },
        {
          path: "/keyword",
          component: () => import("./views/Keywords.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/keyword/KeywordTable.vue"),
              meta: {
                requiresAuth: true,
                object: "keyword",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/keyword/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/keyword/Keyword.vue"),
              meta: {
                isEdit: true,
                table: "keyword",
                heading: "editKeyword.heading",
                requiresAuth: true,
                object: "keyword"
              }
            }
          ]
        },
        {
          path: "/keyword/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Keyword add",
              component: () => import("./components/keyword/Keyword.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addKeyword",
                subForms: [{ path: "/keyword/add", name: "header.keyword" }],
                requiresAuth: true,
                object: "keyword"
              }
            }
          ]
        },
        {
          path: "/collection",
          component: () => import("./views/Collections.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/collection/CollectionTable.vue"),
              meta: {
                requiresAuth: true,
                object: "collection",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/collection/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/collection/Collection.vue"),
              meta: {
                isEdit: true,
                table: "collection",
                heading: "editCollection.heading",
                requiresAuth: true,
                object: "collection"
              }
            }
          ]
        },
        {
          path: "/collection/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Collection add",
              component: () => import("./components/collection/Collection.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addCollection",
                subForms: [
                  { path: "/collection/add", name: "header.collection" }
                ],
                requiresAuth: true,
                object: "collection"
              }
            }
          ]
        },
        {
          path: "/taxon",
          component: () => import("./views/Taxa.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/taxon/TaxonTable.vue"),
              meta: {
                requiresAuth: true,
                object: "taxon",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/taxon/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/taxon/Taxon.vue"),
              meta: {
                isEdit: true,
                table: "taxon",
                heading: "editTaxon.heading",
                requiresAuth: true,
                object: "taxon"
              }
            }
          ]
        },
        {
          path: "/taxon/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Taxon add",
              component: () => import("./components/taxon/Taxon.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addTaxon",
                subForms: [{ path: "/taxon/add", name: "header.taxon" }],
                requiresAuth: true,
                object: "taxon"
              }
            }
          ]
        },
        {
          path: "/selection_series",
          component: () => import("./views/SelectionSeries.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import(
                  "./components/selection_series/SelectionSeriesTable.vue"
                ),
              meta: {
                requiresAuth: true,
                object: "selection_series",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/selection_series/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/selection_series/SelectionSeries.vue"),
              meta: {
                isEdit: true,
                table: "selection_series",
                heading: "editSelectionSeries.heading",
                requiresAuth: true,
                object: "selection_series"
              }
            }
          ]
        },
        {
          path: "/selection_series/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Selection series add",
              component: () =>
                import("./components/selection_series/SelectionSeries.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addSelectionSeries",
                subForms: [
                  {
                    path: "/selection_series/add",
                    name: "header.selectionSeries"
                  }
                ],
                requiresAuth: true,
                object: "selection_series"
              }
            }
          ]
        },
        {
          path: "/agent",
          component: () => import("./views/Agents.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/agent/AgentTable.vue"),
              meta: {
                requiresAuth: true,
                object: "agent",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/agent/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/agent/Agent.vue"),
              meta: {
                isEdit: true,
                table: "agent",
                heading: "editAgent.heading",
                requiresAuth: true,
                object: "agent"
              }
            }
          ]
        },
        {
          path: "/agent/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Agent add",
              component: () => import("./components/agent/Agent.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addAgent",
                subForms: [{ path: "/agent/add", name: "header.agent" }],
                requiresAuth: true,
                object: "agent"
              }
            }
          ]
        },
        {
          path: "/drillcore",
          component: () => import("./views/Drillcores.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/drillcore/DrillcoreTable.vue"),
              meta: {
                requiresAuth: true,
                object: "drillcore",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/drillcore/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/drillcore/Drillcore.vue"),
              meta: {
                isEdit: true,
                table: "drillcore",
                heading: "editDrillcore.heading",
                requiresAuth: true,
                object: "drillcore"
              }
            }
          ]
        },
        {
          path: "/drillcore/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Drillcore add",
              component: () => import("./components/drillcore/Drillcore.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addDrillcore",
                subForms: [
                  { path: "/drillcore/add", name: "header.drillcore" }
                ],
                requiresAuth: true,
                object: "drillcore"
              }
            }
          ]
        },
        {
          path: "/preparation",
          component: () => import("./views/Preparations.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/preparation/PreparationTable.vue"),
              meta: {
                requiresAuth: true,
                object: "preparation",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/preparation/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/preparation/Preparation.vue"),
              meta: {
                isEdit: true,
                table: "preparation",
                heading: "editPreparation.heading",
                requiresAuth: true,
                object: "preparation"
              }
            }
          ]
        },
        {
          path: "/preparation/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Preparation add",
              component: () =>
                import("./components/preparation/Preparation.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addPreparation",
                subForms: [
                  { path: "/preparation/add", name: "header.preparation" }
                ],
                requiresAuth: true,
                object: "preparation"
              }
            }
          ]
        },
        {
          path: "/dataset",
          component: () => import("./views/Datasets.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/dataset/DatasetTable.vue"),
              meta: {
                requiresAuth: true,
                object: "dataset",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/dataset/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/dataset/Dataset.vue"),
              meta: {
                isEdit: true,
                table: "dataset",
                heading: "editDataset.heading",
                requiresAuth: true,
                object: "dataset"
              }
            }
          ]
        },
        {
          path: "/dataset/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Dataset add",
              component: () => import("./components/dataset/Dataset.vue"),
              meta: {
                isEdit: false,
                addNew: "header.addDataset",
                subForms: [{ path: "/dataset/add", name: "header.dataset" }],
                requiresAuth: true,
                object: "dataset"
              }
            }
          ]
        },
        {
          path: "/stratigraphy",
          component: () => import("./views/Stratigraphies.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/stratigraphy/StratigraphyTable.vue"),
              meta: {
                requiresAuth: true,
                object: "stratigraphy",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/stratigraphy/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/stratigraphy/Stratigraphy.vue"),
              meta: {
                isEdit: true,
                table: "stratigraphy",
                heading: "editStratigraphy.heading",
                requiresAuth: true,
                object: "stratigraphy"
              }
            }
          ]
        },
        {
          path: "/stratigraphy/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Stratigraphy add",
              component: () =>
                import("./components/stratigraphy/Stratigraphy.vue"),
              meta: {
                isEdit: false,
                addNew: "header.stratigraphy",
                subForms: [
                  { path: "/stratigraphy/add", name: "header.stratigraphy" }
                ],
                requiresAuth: true,
                object: "stratigraphy"
              }
            }
          ]
        },
        {
          path: "/stratigraphy_catalogue",
          component: () =>
            import("./components/stratigraphy/StratigraphyCatalogue.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "/area",
          component: () => import("./views/Areas.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/area/AreaTable.vue"),
              meta: {
                requiresAuth: true,
                object: "area",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/area/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/area/Area.vue"),
              meta: {
                isEdit: true,
                table: "area",
                heading: "editArea.heading",
                requiresAuth: true,
                object: "area"
              }
            }
          ]
        },
        {
          path: "/area/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Area add",
              component: () => import("./components/area/Area.vue"),
              meta: {
                isEdit: false,
                addNew: "header.area",
                subForms: [{ path: "/area/add", name: "header.area" }],
                requiresAuth: true,
                object: "area"
              }
            }
          ]
        },
        // {
        //   path: "/area/import",
        //   name: "Area import",
        //   component: () => import("./views/Import.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     object: "area"
        //   }
        // },
        {
          path: "/drillcore_box",
          component: () => import("./views/DrillcoreBoxes.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/drillcore_box/DrillcoreBoxTable.vue"),
              meta: {
                requiresAuth: true,
                object: "drillcore_box",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/drillcore_box/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/drillcore_box/DrillcoreBox.vue"),
              meta: {
                isEdit: true,
                table: "drillcore_box",
                heading: "editDrillcoreBox.heading",
                requiresAuth: true,
                object: "drillcore_box"
              }
            }
          ]
        },
        {
          path: "/drillcore_box/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Drillcore box add",
              component: () =>
                import("./components/drillcore_box/DrillcoreBox.vue"),
              meta: {
                isEdit: false,
                addNew: "header.drillcoreBox",
                subForms: [
                  { path: "/drillcore_box/add", name: "header.drillcore_box" }
                ],
                requiresAuth: true,
                object: "drillcore_box"
              }
            }
          ]
        },
        {
          path: "/location",
          component: () => import("./views/Locations.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/location/LocationTable.vue"),
              meta: {
                requiresAuth: true,
                object: "location",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/location/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/location/Location.vue"),
              meta: {
                isEdit: true,
                table: "location",
                heading: "editLocation.heading",
                requiresAuth: true,
                object: "location"
              }
            }
          ]
        },
        {
          path: "/location/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Location add",
              component: () => import("./components/location/Location.vue"),
              meta: {
                isEdit: false,
                addNew: "header.location",
                subForms: [{ path: "/location/add", name: "header.location" }],
                requiresAuth: true,
                object: "location"
              }
            }
          ]
        },
        {
          path: "/rock",
          component: () => import("./views/Rocks.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/rock/RockTable.vue"),
              meta: {
                requiresAuth: true,
                object: "rock",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/rock/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/rock/Rock.vue"),
              meta: {
                isEdit: true,
                table: "rock",
                heading: "editRock.heading",
                requiresAuth: true,
                object: "rock"
              }
            }
          ]
        },
        {
          path: "/rock/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Rock add",
              component: () => import("./components/rock/Rock.vue"),
              meta: {
                isEdit: false,
                addNew: "header.rock",
                subForms: [{ path: "/rock/add", name: "header.rock" }],
                requiresAuth: true,
                object: "rock"
              }
            }
          ]
        },
        {
          path: "/deaccession",
          component: () => import("./views/Deaccessions.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/deaccession/DeaccessionTable.vue"),
              meta: {
                requiresAuth: true,
                object: "deaccession",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/deaccession/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/deaccession/Deaccession.vue"),
              meta: {
                isEdit: true,
                table: "deaccession",
                heading: "editDeaccession.heading",
                requiresAuth: true,
                object: "deaccession"
              }
            }
          ]
        },
        {
          path: "/deaccession/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Deaccession add",
              component: () =>
                import("./components/deaccession/Deaccession.vue"),
              meta: {
                isEdit: false,
                addNew: "header.deaccession",
                subForms: [
                  { path: "/deaccession/add", name: "header.deaccession" }
                ],
                requiresAuth: true,
                object: "deaccession"
              }
            }
          ]
        },
        {
          path: "/accession",
          component: () => import("./views/Accessions.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/accession/AccessionTable.vue"),
              meta: {
                requiresAuth: true,
                object: "accession",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/accession/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/accession/Accession.vue"),
              meta: {
                isEdit: true,
                table: "accession",
                heading: "editAccession.heading",
                requiresAuth: true,
                object: "accession"
              }
            }
          ]
        },
        {
          path: "/accession/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Accession add",
              component: () => import("./components/accession/Accession.vue"),
              meta: {
                isEdit: false,
                addNew: "header.accession",
                subForms: [
                  { path: "/accession/add", name: "header.accession" }
                ],
                requiresAuth: true,
                object: "accession"
              }
            }
          ]
        },
        {
          path: "/visit",
          component: () => import("./views/Visits.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/visit/VisitTable.vue"),
              meta: {
                requiresAuth: true,
                object: "visit",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/visit/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/visit/Visit.vue"),
              meta: {
                isEdit: true,
                table: "visit",
                heading: "editVisit.heading",
                requiresAuth: true,
                object: "visit"
              }
            }
          ]
        },
        {
          path: "/visit/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Visit add",
              component: () => import("./components/visit/Visit.vue"),
              meta: {
                isEdit: false,
                addNew: "header.visit",
                subForms: [{ path: "/visit/add", name: "header.visit" }],
                requiresAuth: true,
                object: "visit"
              }
            }
          ]
        },
        {
          path: "/loan",
          component: () => import("./views/Loans.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/loan/LoanTable.vue"),
              meta: {
                requiresAuth: true,
                object: "loan",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/loan/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/loan/Loan.vue"),
              meta: {
                isEdit: true,
                table: "loan",
                heading: "editLoan.heading",
                requiresAuth: true,
                object: "loan"
              }
            }
          ]
        },
        {
          path: "/loan/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Loan add",
              component: () => import("./components/loan/Loan.vue"),
              meta: {
                isEdit: false,
                addNew: "header.loan",
                subForms: [{ path: "/loan/add", name: "header.loan" }],
                requiresAuth: true,
                object: "loan"
              }
            }
          ]
        },
        {
          path: "/web_news",
          component: () => import("./views/WebNews.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/web_news/WebNewsTable.vue"),
              meta: {
                requiresAuth: true,
                object: "web_news",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/web_news/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/web_news/WebNews.vue"),
              meta: {
                isEdit: true,
                table: "web_news",
                heading: "editWebNews.heading",
                requiresAuth: true,
                object: "web_news"
              }
            }
          ]
        },
        {
          path: "/web_news/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Web news add",
              component: () => import("./components/web_news/WebNews.vue"),
              meta: {
                isEdit: false,
                addNew: "header.web_news",
                subForms: [{ path: "/web_news/add", name: "header.web_news" }],
                requiresAuth: true,
                object: "web_news"
              }
            }
          ]
        },
        {
          path: "/web_pages",
          component: () => import("./views/WebPages.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/web_pages/WebPagesTable.vue"),
              meta: {
                requiresAuth: true,
                object: "web_pages",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/web_pages/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/web_pages/WebPages.vue"),
              meta: {
                isEdit: true,
                table: "web_pages",
                heading: "editWebPages.heading",
                requiresAuth: true,
                object: "web_pages"
              }
            }
          ]
        },
        {
          path: "/web_pages/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Web pages add",
              component: () => import("./components/web_pages/WebPages.vue"),
              meta: {
                isEdit: false,
                addNew: "header.web_pages",
                subForms: [
                  { path: "/web_pages/add", name: "header.web_pages" }
                ],
                requiresAuth: true,
                object: "web_pages"
              }
            }
          ]
        },
        {
          path: "/taxon_page",
          component: () => import("./views/TaxonPages.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/taxon_pages/TaxonPagesTable.vue"),
              meta: {
                requiresAuth: true,
                object: "taxon_pages",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/taxon_page/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/taxon_pages/TaxonPage.vue"),
              meta: {
                isEdit: true,
                table: "taxon_page",
                heading: "editTaxonPages.heading",
                requiresAuth: true,
                object: "taxon_page"
              }
            }
          ]
        },
        {
          path: "/taxon_page/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Taxon pages add",
              component: () => import("./components/taxon_pages/TaxonPage.vue"),
              meta: {
                isEdit: false,
                addNew: "header.taxon_pages",
                subForms: [
                  { path: "/taxon_pages/add", name: "header.taxon_pages" }
                ],
                requiresAuth: true,
                object: "taxon_page"
              }
            }
          ]
        },
        {
          path: "/sample_series",
          component: () => import("./views/SampleSeries.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/sample_series/SampleSeriesTable.vue"),
              meta: {
                requiresAuth: true,
                object: "sample_series",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/sample_series/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/sample_series/SampleSeries.vue"),
              meta: {
                isEdit: true,
                table: "sample_series",
                heading: "editSampleSeries.heading",
                requiresAuth: true,
                object: "sample_series"
              }
            }
          ]
        },
        {
          path: "/sample_series/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Sample series add",
              component: () =>
                import("./components/sample_series/SampleSeries.vue"),
              meta: {
                isEdit: false,
                addNew: "header.sample_series",
                subForms: [
                  { path: "/sample_series/add", name: "header.sample_series" }
                ],
                requiresAuth: true,
                object: "sample_series"
              }
            }
          ]
        },
        {
          path: "/sarv_issue",
          component: () => import("./views/SarvIssues.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/sarv_issue/SarvIssueTable.vue"),
              meta: {
                requiresAuth: true,
                object: "sarv_issue",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/sarv_issue/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () => import("./components/sarv_issue/SarvIssue.vue"),
              meta: {
                isEdit: true,
                table: "sarv_issue",
                heading: "editSarvIssue.heading",
                requiresAuth: true,
                object: "sarv_issue"
              }
            }
          ]
        },
        {
          path: "/sarv_issue/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Sarv issue add",
              component: () => import("./components/sarv_issue/SarvIssue.vue"),
              meta: {
                isEdit: false,
                addNew: "header.sarv_issue",
                subForms: [
                  { path: "/sarv_issue/add", name: "header.sarv_issue" }
                ],
                requiresAuth: true,
                object: "sarv_issue"
              }
            }
          ]
        },
        {
          path: "/analysis_parameter",
          component: () => import("./views/AnalysisParameters.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import(
                  "./components/analysis_parameter/AnalysisParameterTable.vue"
                ),
              meta: {
                requiresAuth: true,
                object: "analysis_parameter",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/analysis_parameter/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/analysis_parameter/AnalysisParameter.vue"),
              meta: {
                isEdit: true,
                table: "analysis_parameter",
                heading: "editAnalysisParameter.heading",
                requiresAuth: true,
                object: "analysis_parameter"
              }
            }
          ]
        },
        {
          path: "/analysis_parameter/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Analysis parameter add",
              component: () =>
                import("./components/analysis_parameter/AnalysisParameter.vue"),
              meta: {
                isEdit: false,
                addNew: "header.analysis_parameter",
                subForms: [
                  {
                    path: "/analysis_parameter/add",
                    name: "header.analysis_parameter"
                  }
                ],
                requiresAuth: true,
                object: "analysis_parameter"
              }
            }
          ]
        },
        {
          path: "/analysis_method",
          component: () => import("./views/AnalysisMethods.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/analysis_method/AnalysisMethodTable.vue"),
              meta: {
                requiresAuth: true,
                object: "analysis_method",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/analysis_method/:id(\\d+)",
          props: true,
          component: () => import("./views/EditForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import("./components/analysis_method/AnalysisMethod.vue"),
              meta: {
                isEdit: true,
                table: "analysis_method",
                heading: "editAnalysisMethod.heading",
                requiresAuth: true,
                object: "analysis_method"
              }
            }
          ]
        },
        {
          path: "/analysis_method/add",
          component: () => import("./views/AddForm.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              name: "Analysis method add",
              component: () =>
                import("./components/analysis_method/AnalysisMethod.vue"),
              meta: {
                isEdit: false,
                addNew: "header.analysis_method",
                subForms: [
                  {
                    path: "/analysis_method/add",
                    name: "header.analysis_method"
                  }
                ],
                requiresAuth: true,
                object: "analysis_method"
              }
            }
          ]
        },
        {
          path: "/site_groundwater",
          component: () => import("./views/SiteGroundwaters.vue"),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "",
              component: () =>
                import(
                  "./components/site_groundwater/SiteGroundwaterTable.vue"
                ),
              meta: {
                requiresAuth: true,
                object: "site_groundwater",
                isTableView: true
              }
            }
          ]
        },
        {
          path: "/test-dev",
          component: () => import("./components/partial/test/Test.vue"),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: "/hierarchy_update",
          name: "Hierarchy update",
          component: () =>
            import("./components/partial/hierarchy_update/HierarchyUpdate.vue"),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: "/loan_print/:id(\\d+)",
      name: "Loan print",
      component: () => import("./components/loan/LoanPrint.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/drillcore_print/:id(\\d+)",
      name: "Drillcore print",
      component: (data) => import("./components/drillcore/DrillcorePrint.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // Adding scrollbar location to fromRoute
  from.meta.scrollbar = {
    x: document.documentElement.scrollLeft,
    y: document.documentElement.scrollTop
  };
  // console.log('--- FROM ---');
  // console.log(from);
  // console.log('--- TO ---');
  // console.log(to);

  const loginPath = window.location.pathname;

  const loginStateResponse = await fetchIsLoggedIn().then(
    response => response,
    errResponse => errResponse
  );

  const isLoggedIn = handleResponse(loginStateResponse);

  if (isLoggedIn) {
    const loggedInUser = getLoggedInUser(loginStateResponse);

    if (checkCookiesAndStorage(loggedInUser)) {
      if (to.meta.requiresAuth) next();
      else {
        if (to.name === "Geocollections Data Management")
          next({ path: "/dashboard" });
        else next();
      }
    } else {
      removeBrowserDataAndLogout();
      next({ path: "/" });
    }
  } else {
    if (from.fullPath !== "/") {
      if (to.params.dontShowSessionExpired === false) {
        Vue.prototype.toast.error("Please log back in", "Session expired", {
          position: "topCenter",
          timeout: 5000,
          closeOnEscape: true,
          pauseOnHover: false,
          displayMode: "replace"
        });
      }
    }

    if (to.meta.requiresAuth) next({ path: "/", query: { from: loginPath } });
    else next();
  }
});

function checkCookiesAndStorage(user) {
  if (user.length > 0) {
    // Getting user data from cookies and storage
    let csrftoken = Vue.$cookies.get("csrftoken");
    let csrftokenLocalhost = Vue.$cookies.get("csrftokenLocalhost");
    let authUser = store?.state?.user?.authUser;

    if ((csrftoken || csrftokenLocalhost) && authUser) {
      if (authUser.user) return authUser.user === user;
      else return false; // User field does not exist in authUser
    }
    return false; // Some user data is missing or it has been tampered
  } else return false; // User is empty
}

function removeBrowserDataAndLogout() {
  // Deleting cookies and local storage
  Vue.$cookies.remove("csrftokenLocalhost", null, "localhost");
  Vue.$cookies.remove("csrftoken", null, "geocollections.info");

  // Sending logout request to API
  fetchLogout().then(
    () => {
      Vue.prototype.toast.error("Please log back in", "Session expired", {
        position: "topCenter",
        timeout: 5000,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace"
      });
    },
    errResponse => console.log("LOGOUT ERROR: " + JSON.stringify(errResponse))
  );
}

function handleResponse(response) {
  if (response.status === 200) {
    return !!response?.data?.results?.success;
  } else return false;
}

function getLoggedInUser(response) {
  if (handleResponse(response)) return response.data.results.user;
  else return "";
}

function isSameRoute(routeTo, routeFrom) {
  let toPath = routeTo.path.split("/")[1];
  let fromPath = routeFrom.path.split("/")[1];
  return toPath === fromPath;
}

export default router;
