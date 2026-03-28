import { createRouter, createWebHistory } from 'vue-router'
import DashboardView      from '../views/DashboardView.vue'
import AnalysisCreateView from '../views/AnalysisCreateView.vue'
import AnalysisDetailView from '../views/AnalysisDetailView.vue'

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
  // Placeholders for sidebar consistency
  { 
    path: '/analysis', 
    name: 'AnalysisList',
    redirect: '/' 
  },
  { 
    path: '/scripts', 
    name: 'Scripts',
    component: () => import('../views/DashboardView.vue') // Placeholder
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: () => import('../views/DashboardView.vue') // Placeholder
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
