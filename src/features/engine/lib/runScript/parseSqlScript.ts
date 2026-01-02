export function parseSqlScript(text) {
  const regex = /--\[(.*?)\]([\s\S]*?)(?=(?:--\[|$))/g;
  const queries = {};
  let match;
  while ((match = regex.exec(text)) !== null) {
    const key = match[1].trim();
    const query = match[2].trim();
    queries[key] = query;
  }
  return queries as Record<string, string>;
}
