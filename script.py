import os

# --- CONFIGURACIÓN ---
# Extensiones de archivo que queremos leer
INCLUDED_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".prisma", ".sql"}

# Carpetas que DEFINITIVAMENTE queremos ignorar
IGNORED_DIRS = {
    "node_modules",
    ".next",  # Ignoramos el build
    ".git",
    ".vscode",
    "dist",
    "build",
    "public",  # Generalmente son assets binarios
    "coverage",
}

# Archivos específicos a ignorar (opcional)
IGNORED_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "project_context.txt",  # No leer el archivo de salida
    "export_project.py",  # No leerse a sí mismo
}


def is_text_file(filename):
    return any(filename.endswith(ext) for ext in INCLUDED_EXTENSIONS)


def scan_project(start_path, output_filename):
    total_files = 0

    with open(output_filename, "w", encoding="utf-8") as outfile:
        # Escribir cabecera
        outfile.write(f"--- PROJECT EXPORT ---\n")
        outfile.write(f"Root: {os.path.abspath(start_path)}\n\n")

        for root, dirs, files in os.walk(start_path):
            # Filtrar carpetas ignoradas en el recorrido
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

            for file in files:
                if file in IGNORED_FILES:
                    continue

                if is_text_file(file):
                    file_path = os.path.join(root, file)
                    # Ruta relativa para que sea legible
                    relative_path = os.path.relpath(file_path, start_path)

                    try:
                        with open(file_path, "r", encoding="utf-8") as infile:
                            content = infile.read()

                            # Escribir delimitador y contenido
                            outfile.write(f"\n{'='*60}\n")
                            outfile.write(f"FILE_PATH: {relative_path}\n")
                            outfile.write(f"{'='*60}\n")
                            outfile.write(content + "\n")

                            print(f"Leído: {relative_path}")
                            total_files += 1
                    except Exception as e:
                        print(f"Error leyendo {relative_path}: {e}")

    print(f"\n--- COMPLETADO ---")
    print(f"Se escanearon {total_files} archivos.")
    print(f"El resultado está en: {output_filename}")


if __name__ == "__main__":
    # Escanea el directorio actual donde pongas este script
    current_directory = os.getcwd()
    output_file = "project_context.txt"

    print(f"Escaneando proyecto en: {current_directory}...")
    scan_project(current_directory, output_file)
