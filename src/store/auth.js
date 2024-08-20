import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null, 
  }),

  actions: {
    setUser(user, token, rememberMe) {
      this.user = user;
      this.token = token;

      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
      if (token) {
        storage.setItem('token', token);
      }
    },

    

    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },

    loadUserFromStorage() {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
      if (storedToken) {
        this.token = storedToken;
      }
    },

    initialize() {
        this.loadUserFromStorage();
      },
  },


  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
