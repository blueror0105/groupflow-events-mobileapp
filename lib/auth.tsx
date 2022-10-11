import { useAppContextStore } from "./appContext";

export function useLogout() {
  const store = useAppContextStore();
  function logout() {
    store?.clearAll();
  }

  return logout;
}
