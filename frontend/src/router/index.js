import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import DashboardView      from '../views/DashboardView.vue'
import AnalysisCreateView from '../views/AnalysisCreateView.vue'
import AnalysisDetailView from '../views/AnalysisDetailView.vue'
import AnalysisListView   from '../views/AnalysisListView.vue'
import ScriptsView        from '../views/ScriptsView.vue'
import ScriptDetailView   from '../views/ScriptDetailView.vue'
import GenerateView       from '../views/GenerateView.vue'
import LoginView          from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/new-analysis',
    name: 'AnalysisCreate',
    component: AnalysisCreateView
  },
  {
    path: '/analysis',
    name: 'AnalysisList',
    component: AnalysisListView
  },
  {
    path: '/analysis/:id',
    name: 'AnalysisDetail',
    component: AnalysisDetailView
  },
  {
    path: '/scripts',
    name: 'Scripts',
    component: ScriptsView
  },
  {
    path: '/scripts/:id',
    name: 'ScriptDetail',
    component: ScriptDetailView
  },
  {
    path: '/generate',
    name: 'Generate',
    component: GenerateView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
