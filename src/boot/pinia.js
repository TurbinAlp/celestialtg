import { createPinia } from 'pinia';
import { useAuthStore } from '../store/auth';

export default ({ app }) => {
  const pinia = createPinia();
  app.use(pinia);
  const authStore = useAuthStore();
  authStore.initialize();
};
