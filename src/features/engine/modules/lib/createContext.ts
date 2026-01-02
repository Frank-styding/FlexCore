import { IContext } from "../types/component.type";

export const createContext = (): IContext => {
  const events: Record<string, { id: string; fn: (data: any) => any }[]> = {};

  const evensFuns = {
    register: (id, fn) => {
      if ((events[id]?.length ?? 0) == 1) return;
      events[id] ??= [];
      events[id].push({ id, fn });
    },
    unregister: (id) => {
      delete events[id];
    },
    suscribe: (id, fn) => {
      events[id] ??= [];
      events[id].push({ id, fn });
    },
    unSuscribe: (id) => {
      if (!events[id]) return;
      events[id] = events[id].filter((i) => i.id != id);
    },
    call: (id, data) => {
      if (!events[id] || events[id].length > 0) return;
      return events[id][0].fn(data);
    },
    trigger: (id, data) => {
      if (!events[id]) return;
      events[id].forEach((item) => item.fn(data));
    },
  };

  const context: IContext = {
    comp: {},
    events: evensFuns,
  };

  return context;
};
