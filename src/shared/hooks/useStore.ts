import { createContext, useContext } from "react";
import { rootStore } from "../../stores/RootStore";

const StoreContext = createContext(rootStore); 

export const StoreProvider = StoreContext.Provider;

export const useStore = () => useContext(StoreContext);