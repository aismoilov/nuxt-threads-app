import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    isMenuOverlay:  false,
    isLogoutOverlay: false,
  }),
})