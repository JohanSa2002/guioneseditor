import { createRouter, createWebHistory } from 'vue-router'
import DashboardView      from '../views/DashboardView.vue'
import AnalysisCreateView from '../views/AnalysisCreateView.vue'
import AnalysisDetailView from '../views/AnalysisDetailView.vue'
import ScriptsView        from '../views/ScriptsView.vue'
import SettingsView       from '../views/SettingsView.vue'

const routes = [
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
    path: '/analysis/:id',
    name: 'AnalysisDetail',
    component: AnalysisDetailView
  },
  {
    path: '/analysis',
    name: 'AnalysisList',
    redirect: '/scripts'
  },
  {
    path: '/scripts',
    name: 'Scripts',
    component: ScriptsView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
