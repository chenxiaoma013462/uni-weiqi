import { defineStore } from 'pinia'
const useAppStore = defineStore('app', {
  state: () => ({
    userToken: '',
  }),
  actions:{}
})
export default useAppStore