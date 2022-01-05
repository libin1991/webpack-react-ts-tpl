
const routes = [
  {
    path: '/',
    component: () => import("@/pages/home/index")
  },
  {
    path: '/detail',
    component: () => import("@/pages/detail/index")
  },
  {
    path: '/list',
    component: () => import("@/pages/list/index")
  }
]
export default routes