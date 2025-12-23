// utils/sqlHelpers.ts
export const interpolateQuery = (
  query: string,
  variables: Record<string, any>
) => {
  return query.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key] !== undefined ? `'${variables[key]}'` : "NULL";
  });
};
