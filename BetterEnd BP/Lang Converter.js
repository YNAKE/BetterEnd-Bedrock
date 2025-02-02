const fs = require('fs');
const path = require('path');

// Rutas de las carpetas
const baseFolder = path.join(__dirname, 'project_folder');
const folders = ['entities', 'blocks', 'items'];

// Arrays para almacenar identificadores
const entitiesIdentifier = [];
const blocksIdentifier = [];
const itemsIdentifier = [];

// Función para leer archivos JSON en una carpeta específica y extraer identifiers
function extractIdentifiers(folderPath, type) {
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
  const identifiers = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const section = data[`minecraft:${type}`];

      if (section && section.description && section.description.identifier) {
        identifiers.push(section.description.identifier);
      }
    } catch (error) {
      console.error(`Error al procesar el archivo ${file}:`, error);
    }
  }

  return identifiers;
}

// Función para formatear el nombre del identifier
function formatIdentifier(identifier) {
  const namePart = identifier.split(':')[1];
  return namePart.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Función para generar contenido del archivo en_US.lang
function generateLangContent() {
  let langContent = '';

  // Entidades
  for (const id of entitiesIdentifier) {
    const formattedName = formatIdentifier(id);
    langContent += `entity.${id}.name=${formattedName}\n`;
    langContent += `item.spawn_egg.entity.${id}.name=${formattedName}\n`;
  }

  // Bloques
  for (const id of blocksIdentifier) {
    const formattedName = formatIdentifier(id);
    langContent += `tile.${id}.name=${formattedName}\n`;
  }

  // Items
  for (const id of itemsIdentifier) {
    const formattedName = formatIdentifier(id);
    langContent += `item.${id}.name=${formattedName}\n`;
  }

  return langContent;
}

// Función principal
function main() {
  for (const folder of folders) {
    const folderPath = path.join(baseFolder, folder);

    if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
      const type = folder.slice(0, -1); // entities -> entity, blocks -> block, etc.
      const identifiers = extractIdentifiers(folderPath, type);

      if (type === 'entity') {
        entitiesIdentifier.push(...identifiers);
      } else if (type === 'block') {
        blocksIdentifier.push(...identifiers);
      } else if (type === 'item') {
        itemsIdentifier.push(...identifiers);
      }
    } else {
      console.warn(`La carpeta ${folder} no existe o no es un directorio.`);
    }
  }

  const langContent = generateLangContent();
  const outputPath = path.join(__dirname, 'en_US.lang');
  fs.writeFileSync(outputPath, langContent);
  console.log(`Archivo en_US.lang generado en ${outputPath}`);
}

main();