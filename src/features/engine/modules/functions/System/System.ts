import { uuid } from "zod";

export const System = () => {
  return {
    uuid: () => uuid(),
  };
};
