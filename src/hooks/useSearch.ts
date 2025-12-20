/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useDeferredValue, useState } from "react";

export const useSearch = <T>(
  data: T[],
  callback: (item: T, value: string) => boolean
): [T[], string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState("");
  const deferredValue = useDeferredValue(value);
  const filteredData = data.filter((item) => callback(item, deferredValue));
  return [filteredData, value, setValue];
};
