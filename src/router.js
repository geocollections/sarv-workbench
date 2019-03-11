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
        },
        {
          path: '/reference/:id(\\d+)',
          props: true,
          component: () => import('./views/EditReference.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: '/reference/add',
          component: () => import('./views/AddReference.vue'),
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: () => import('./components/reference/Reference.vue'),
              meta: {
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
                subForms:[
                  {path:'/locality/add',name:'add.locality'}
                ],
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
                subForms:[
                  {path:'/sample/add',name:'add.sample'}
                ],
                requiresAuth: true
              },
            }
          ]
        },
      ]
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
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
