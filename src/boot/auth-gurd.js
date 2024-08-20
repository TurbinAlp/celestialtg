// src/boot/auth-guard.js
import {
  boot
} from 'quasar/wrappers';
import {
  useAuthStore
} from '../store/auth';

export default boot(({
  router
}) => {
  const authStore = useAuthStore();

  router.beforeEach((to, from, next) => {
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirect to login if not authenticated
      next({
        name: 'login'
      });
    } else {
      next();
    }
  });
});
