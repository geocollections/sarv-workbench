import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Geocollections Data Management',
      component: Login
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          component: () => import('./components/dashboard/FrontPage.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/settings',
          component: () => import('./views/Settings.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/attachment',
          component: () => import('./views/Attachments.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/attachment/:id(\\d+)',
          props: true,
          component: () => import('./views/EditAttachment.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/attachment/add',
          component: () => import('./views/AddAttachment.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            // /attachment/add --> is same as /attachment/add/photo_archive
            {
              path: '',
              component: () => import('./components/attachment/PhotoArchive.vue'),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'photo_archive',
              component: () => import('./components/attachment/PhotoArchive.vue'),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'specimen_image',
              component: () => import('./components/attachment/SpecimenImage.vue'),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'other_file',
              component: () => import('./components/attachment/OtherFiles.vue'),
              props: (route) => ({ from: route }),
              meta: {
                requiresAuth: true
              }
            },
            {
              path: 'digitised_reference',
              component: () => import('./components/attachment/DigitisedReference.vue'),
              meta: {
                requiresAuth: true
              }
            },
          ]
        },
        {
          path: '/reference',
          component: () => import('./views/References.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/reference/ReferenceTable.vue'),
              meta: {
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: '/reference/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/reference/Reference.vue'),
              meta: {
                isEdit: true,
                table: 'reference',
                title: 'titles.editReference',
                heading: 'editReference.heading',
                isBottomOptionShown: false,
                isSidebarShown: true,
                isNavigationShown: true,
                isCopyFormShown: false,
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: '/reference/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/reference/Reference.vue'),
              meta: {
                isEdit: false,
                title: 'titles.addReference',
                addNew: 'add.newReference',
                subForms: [
                  {
                    path: '/reference/add', name: 'add.reference'
                  }
                ],
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/imageset/add',
          component: () => import('./views/Imageset.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/journal/add',
          component: () => import('./views/Journal.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/locality',
          component: () => import('./views/Localities.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/locality/LocalityTable.vue'),
              meta: {
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/locality/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/locality/Locality.vue'),
              meta: {
                isEdit:true,
                table:'locality',
                title:'titles.editLocality',
                heading:'editLocality.heading',
                isBottomOptionShown: true,
                isNavigationShow: true,
                isCopyFormShown: true,
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/locality/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/locality/Locality.vue'),
              meta: {
                isEdit:false,
                title:'titles.addLocality',
                addNew:'add.newLocality',
                subForms:[
                  {path:'/locality/add',name:'add.locality'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/sample',
          component: () => import('./views/Samples.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/sample/SampleTable.vue'),
              meta: {
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/sample/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/sample/Sample.vue'),
              meta: {
                isEdit:true,
                table:'sample',
                title:'titles.editSample',
                heading:'editSample.heading',
                isBottomOptionShown: true,
                isNavigationShow: true,
                isCopyFormShown: true,
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/sample/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/sample/Sample.vue'),
              meta: {
                isEdit:false,
                title:'titles.addSample',
                addNew:'add.newSample',
                subForms:[
                  {path:'/sample/add',name:'add.sample'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/project',
          component: () => import('./views/Projects.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/project/ProjectTable.vue'),
              meta: {
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: '/project/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/project/Project.vue'),

              children: [
                {
                  path: '',
                  component: () => import('./components/site/SiteTable.vue'),

                  //belongs to project
                  meta: {
                    isEdit:false,
                    title:'titles.addProject',
                    subForms:[
                      {path:'/project/add',name:'editProject.heading'}
                    ],
                    requiresAuth: true
                  },
                }
              ]
            }
          ]
        },
        {
          path: '/project/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/project/Project.vue'),

              children: [
                {
                  path: '',
                  component: () => import('./components/site/SiteTable.vue'),
                  //belongs to project
                  meta: {
                    isEdit:true,
                    table:'project',
                    title:'titles.editProject',
                    heading:'editProject.heading',
                    isBottomOptionShown: false,
                    isNavigationShow: false,
                    isCopyFormShown: false,
                    isSidebarShown: true,
                    requiresAuth: true
                  },
                }
              ]
            }
          ]
        },
        {
          path: '/site/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/site/Site.vue'),
              meta: {
                isEdit:false,
                title:'titles.addSite',
                subForms:[
                  {path:'/site/add',name:'editSite.heading'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
        // {
        //   path: '/site',
        //   component: () => import('./views/Sites.vue'),
        //   meta: {
        //     requiresAuth: true
        //   },
        //   children: [
        //     {
        //       path: '',
        //       component: () => import('./components/site/SiteTable.vue'),
        //       meta: {
        //         requiresAuth: true
        //       },
        //     }
        //   ]
        // },
        {
          path: '/site/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/site/Site.vue'),
              meta: {
                isEdit:true,
                table:'site',
                title:'titles.editSite',
                heading:'editSite.heading',
                isBottomOptionShown: false,
                isNavigationShow: false,
                isCopyFormShown: false,
                isSidebarShown: true,
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/site/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/site/Site.vue'),
              meta: {
                isEdit:false,
                title:'titles.addSite',
                subForms:[
                  {path:'/site/add',name:'editSite.heading'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/library',
          component: () => import('./views/Libraries.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/library/LibraryTable.vue'),
              meta: {
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/library/:id(\\d+)',
          props: true,
          component: () => import('./views/EditForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/library/Library.vue'),
              meta: {
                isEdit:true,
                table:'library',
                title:'titles.editLibrary',
                heading:'editLibrary.heading',
                isBottomOptionShown: true,
                isNavigationShow:true,
                isCopyFormShown: false,
                requiresAuth: true
              },
            }
          ]
        },
        {
          path: '/library/add',
          component: () => import('./views/AddForm.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/library/Library.vue'),
              meta: {
                isEdit:false,
                title:'titles.addLibrary',
                addNew:'add.newLibrary',
                subForms:[
                  {path:'/library/add',name:'add.library'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
      ]
    },
  ],
  scrollBehavior() { return { x: 0, y: 0 };}
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  if (to.meta.requiresAuth) {
    if (router.app.$session.exists() && router.app.$session.get('authUser') != null) {
      const authUser = router.app.$session.get('authUser')
      // console.log(authUser)
      // TODO: Can do some extra checks from agent table or sth like that
      // TODO: Currently if user just enters random session id and name then route is available
      // TODO: Should implement some extra security or maybe block /dashboard from server side
      if (authUser) {
        next()
      } else {
        next({ path: '/' })
      }
    } else {
      next({ path: '/' })
    }
  } else {
    if (to.name === 'Geocollections Data Management') {
      if (router.app.$session.exists() && router.app.$session.get('authUser') != null) {
        next({ path: '/dashboard' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
