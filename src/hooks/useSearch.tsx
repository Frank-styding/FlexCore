import { useMemo, useDeferredValue, useState } from "react";

export const useSearch = <T,>(
  data: T[],
  filterFn: (item: T, query: string) => boolean
) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredData = useMemo(() => {
    if (!deferredQuery) return data;
    return data.filter((item) => filterFn(item, deferredQuery));
  }, [data, deferredQuery, filterFn]);

  const isSearching = query !== deferredQuery;

  return {
    results: filteredData,
    query,
    setQuery,
    isSearching,
  };
};
