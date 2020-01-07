import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import { fetchIsLoggedIn, fetchLogout } from "./assets/js/api/apiCalls";

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
        return { x: from.meta.scrollbar.x, y: from.meta.scrollbar.y };
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
                title: "titles.editAttachment",
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
                title: "titles.addAttachment",
                addNew: "add.newAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "add.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "add.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "add.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "add.digitisedReference"
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
                title: "titles.addAttachment",
                addNew: "add.newAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "add.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "add.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "add.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "add.digitisedReference"
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
                title: "titles.addAttachment",
                addNew: "add.newAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "add.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "add.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "add.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "add.digitisedReference"
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
                title: "titles.addAttachment",
                addNew: "add.newAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "add.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "add.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "add.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "add.digitisedReference"
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
                title: "titles.addAttachment",
                addNew: "add.newAttachment",
                subForms: [
                  {
                    path: "/attachment/add/photo_archive",
                    name: "add.photoArchive"
                  },
                  {
                    path: "/attachment/add/specimen_image",
                    name: "add.specimenImage"
                  },
                  {
                    path: "/attachment/add/other_file",
                    name: "add.otherFiles"
                  },
                  {
                    path: "/attachment/add/digitised_reference",
                    name: "add.digitisedReference"
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
                title: "titles.editReference",
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
                title: "titles.addReference",
                addNew: "add.newReference",
                subForms: [
                  {
                    path: "/reference/add",
                    name: "add.reference"
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
                title: "titles.addImageset",
                addNew: "add.newImageset",
                subForms: [{ path: "/imageset/add", name: "add.imageset" }],
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
                title: "titles.editJournal",
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
                title: "titles.addJournal",
                addNew: "add.newJournal",
                subForms: [{ path: "/journal/add", name: "add.journal" }],
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
                title: "titles.editLocality",
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
                title: "titles.addLocality",
                addNew: "add.newLocality",
                subForms: [{ path: "/locality/add", name: "add.locality" }],
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
                title: "titles.editSample",
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
                title: "titles.addSample",
                addNew: "add.newSample",
                subForms: [{ path: "/sample/add", name: "add.sample" }],
                requiresAuth: true,
                object: "sample"
              }
            }
          ]
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
                    title: "titles.addProject",
                    addNew: "add.newProject",
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
                    title: "titles.editProject",
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
                title: "titles.editSite",
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
                title: "titles.addSite",
                addNew: "add.newSite",
                subForms: [{ path: "/site/add", name: "editSite.heading" }],
                requiresAuth: true,
                object: "site"
              }
            }
          ]
        },
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
                title: "titles.editLibrary",
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
                title: "titles.addLibrary",
                addNew: "add.newLibrary",
                subForms: [{ path: "/library/add", name: "add.library" }],
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
                title: "titles.editDoi",
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
                title: "titles.addDoi",
                addNew: "add.newDoi",
                subForms: [{ path: "/doi/add", name: "add.doi" }],
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
                    title: "titles.addDoi",
                    addNew: "add.newDoiEgf",
                    subForms: [{ path: "/doi/add", name: "add.doi" }],
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
                title: "titles.editAnalysis",
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
                title: "titles.addAnalysis",
                addNew: "add.newAnalysis",
                subForms: [{ path: "/analysis/add", name: "add.analysis" }],
                requiresAuth: true,
                object: "analysis"
              }
            }
          ]
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
                title: "titles.editSpecimen",
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
                title: "titles.addSpecimen",
                addNew: "add.newSpecimen",
                subForms: [{ path: "/specimen/add", name: "add.specimen" }],
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
                title: "titles.editKeyword",
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
                title: "titles.addKeyword",
                addNew: "add.newKeyword",
                subForms: [{ path: "/keyword/add", name: "add.keyword" }],
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
                title: "titles.editCollection",
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
                title: "titles.addCollection",
                addNew: "add.newCollection",
                subForms: [{ path: "/collection/add", name: "add.collection" }],
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
                title: "titles.editTaxon",
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
                title: "titles.addTaxon",
                addNew: "add.newTaxon",
                subForms: [{ path: "/taxon/add", name: "add.taxon" }],
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
                import("./components/selectionSeries/SelectionSeriesTable.vue"),
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
                import("./components/selectionSeries/SelectionSeries.vue"),
              meta: {
                isEdit: true,
                table: "selection_series",
                title: "titles.editSelectionSeries",
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
                import("./components/selectionSeries/SelectionSeries.vue"),
              meta: {
                isEdit: false,
                title: "titles.addSelectionSeries",
                addNew: "add.newSelectionSeries",
                subForms: [
                  { path: "/selection_series/add", name: "add.selectionSeries" }
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
                title: "titles.editAgent",
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
                title: "titles.addAgent",
                addNew: "add.newAgent",
                subForms: [{ path: "/agent/add", name: "add.agent" }],
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
                title: "titles.editDrillcore",
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
                title: "titles.addDrillcore",
                addNew: "add.newDrillcore",
                subForms: [{ path: "/drillcore/add", name: "add.drillcore" }],
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
                title: "titles.editPreparation",
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
                title: "titles.addPreparation",
                addNew: "add.newPreparation",
                subForms: [
                  { path: "/preparation/add", name: "add.preparation" }
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
                title: "titles.editDataset",
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
                title: "titles.addDataset",
                addNew: "add.newDataset",
                subForms: [{ path: "/dataset/add", name: "add.dataset" }],
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
                title: "titles.editStratigraphy",
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
                title: "titles.addStratigraphy",
                addNew: "add.newStratigraphy",
                subForms: [
                  { path: "/stratigraphy/add", name: "add.stratigraphy" }
                ],
                requiresAuth: true,
                object: "stratigraphy"
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
        }
      ]
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
      if (!to.params.dontShowSessionExpired) {
        Vue.prototype.toast.error("Please log back in", "Session expired", {
          position: "bottomRight",
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
    let authUser = Vue.localStorage.get("authUser");

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
  Vue.localStorage.remove("authUser");

  // Sending logout request to API
  fetchLogout().then(
    () => {
      Vue.prototype.toast.error("Please log back in", "Session expired", {
        position: "bottomRight",
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
    if (
      response.data &&
      response.data.results &&
      response.data.results.success
    ) {
      return response.data.results.success;
    } else return false;
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
