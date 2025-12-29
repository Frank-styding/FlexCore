import { v4 as uuid } from "uuid";
import { Component, Context } from "./Component";

// Definición de las props que recibe la función constructora
type FragmentData = {
  id?: string; // Opcional, generamos uno si no viene
  children?: Component[] | Component; // Aceptamos uno o varios
  context?: Context;
};

type FragmentFactory = (data: FragmentData) => Component;

export const Fragment: FragmentFactory = ({ id, children, context }) => {
  return {
    id: id ?? uuid(), // ID único necesario para el key de React
    type: "Fragment",
    context,
    config: {}, // Sin config visual
    data: {}, // Sin data compleja por ahora
    events: {},
    subComponents: children, // Aquí guardamos los hijos
  };
};

// --- Definición para el Editor (Intellisense) ---
export const FragmentType = `
interface FragmentProps {
  id?: string;
  children?: Component[] | Component;
  context?: Context;
}

declare const Fragment: (data: FragmentProps) => Component;
`;
