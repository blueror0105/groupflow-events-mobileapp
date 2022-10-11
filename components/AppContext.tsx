import React from "react";
import { AppContextType } from "../types/auth";

export const AppContext = React.createContext<Partial<AppContextType>>({});
