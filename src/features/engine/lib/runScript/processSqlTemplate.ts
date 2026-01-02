export function processSqlTemplate(
  sql: string,
  variables: Record<string, any>
) {
  // Regex: Busca {{ seguido de cualquier espacio, captura el nombre, espacios y }}
  return sql.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_match, key) => {
    const varName = key.trim(); // Quitamos espacios extra: " parentId " -> "parentId"
    const value = variables[varName];

    // 1. Si no existe la variable, devolvemos NULL o dejamos el tag (tú decides)
    if (value === undefined) {
      console.warn(`Variable ${varName} no encontrada`);
      return "NULL";
    }

    // 2. Si es null
    if (value === null) return "NULL";

    // 3. Si es String, agregamos comillas simples para que sea SQL válido
    // 4. Si es Array (útil para IN (...)), los unimos por comas
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // 5. Números y booleanos se devuelven directos
    return String(value);
  });
}
