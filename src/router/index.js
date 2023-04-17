import { createRouter, createWebHistory } from 'vue-router';
import Categories from '@/views/Categories.vue';
import Themes from "@/views/Themes.vue";
import Cards from "@/views/Cards.vue";
import Revision from "@/views/Revision.vue";

const routes = [
  {
    path: '/',
    name: 'categories',
    component: Categories,
  },
  {
    path: '/categories/:id/',
    name: 'themes',
    component: Themes,
  },
  {
    path: '/categories/:id/themes/:themeId/',
    name: 'cards',
    component: Cards,
  },
  {
    path: '/revision',
    name: 'revision',
    component: Revision,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
