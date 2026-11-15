import { useContext } from "react";
import { TemaContext } from "../context/TemaContext.js";

export function useTema() {
  return useContext(TemaContext);
}