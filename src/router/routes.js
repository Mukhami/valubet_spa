const routes = [
  {
    path: '/dashboard',
    component: () => import('layouts/Dashboard.vue'),

    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard/Overview.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'games',
        name: 'dashboard.games',
        component: () => import('pages/dashboard/games/Games.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'users',
        name: 'dashboard.users',
        component: () => import('pages/dashboard/users/Users.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'user-bets/:id',
        name: 'dashboard.user-bets',
        component: () => import('pages/dashboard/users/UserBets.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'my-bets',
        name: 'dashboard.my-bets',
        component: () => import('pages/dashboard/users/UserBets.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'supplier/:id',
        name: 'dashboard.supplier',
        component: () => import('pages/dashboard/suppliers/Supplier.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'all-products',
        name: 'dashboard.all-products',
        component: () => import('pages/dashboard/products/Products.vue'),
        meta: {requiresAuth: true}
      }
      ,{
        path: 'orders',
        name: 'dashboard.orders',
        component: () => import('pages/dashboard/orders/Orders.vue'),
        meta: {requiresAuth: true}
      },
    ]
  },

  {
    path: '',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Auth/Login.vue'),
        meta: {guest: true}
      }
    ]
  },

  {
    path: '/auth',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        name: 'auth.landing',
        component: () => import('pages/Auth/Login.vue'),
        meta: {guest: true}
      },
      {
        path: 'register',
        name: 'auth.register',
        component: () => import('pages/Auth/Register.vue'),
        meta: {guest: true}
      },
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('pages/Auth/Login.vue'),
        meta: {guest: true}
      }
    ]
  }
]


if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
