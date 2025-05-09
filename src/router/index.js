import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WishlistView from '../views/WishlistView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/wishlist', component: WishlistView },
  { path: '/@:username', component: HomeView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;