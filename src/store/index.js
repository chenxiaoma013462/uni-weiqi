import useAppStore from './app'
export default function useStore() {
  return {
    app: useAppStore(),
  }
}
