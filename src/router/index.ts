
const routes=[
  {
    path:'/',
    component:()=>import("@/pages/home/index")
  },
  {
    path:'/detail',
    component:()=>import("@/pages/detail/index")
  }
]
export default routes