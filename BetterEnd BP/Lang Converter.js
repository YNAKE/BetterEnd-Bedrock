const fs = require('fs');
const path = require('path');

const ENTITIES_DIR = path.join(__dirname, 'entities');
const BLOCKS_DIR = path.join(__dirname, 'blocks');
const ITEMS_DIR = path.join(__dirname, 'items');
const OUTPUT_FILE = path.join(__dirname, 'en_US.lang');

const entitiesIdentifier = [];
const blocksIdentifier = [];
const itemsIdentifier = [];

function renameFilesToJsonc(directory) {
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            renameFilesToJsonc(filePath);
        } else if (filePath.endsWith('.json')) {
            fs.renameSync(filePath, filePath + 'c');
        }
    });
}

function renameFilesToJson(directory) {
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            renameFilesToJson(filePath);
        } else if (filePath.endsWith('.jsonc')) {
            fs.renameSync(filePath, filePath.slice(0, -1));
        }
    });
}

function traverseDirectory(directory, typeArray) {
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            traverseDirectory(filePath, typeArray);
        } else if (filePath.endsWith('.jsonc')) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(data.replace(/\/\/[^"]+/g, ''));
                let identifier = '';
                if (jsonData['minecraft:entity']) {
                    identifier = jsonData['minecraft:entity'].description.identifier;
                } else if (jsonData['minecraft:block']) {
                    identifier = jsonData['minecraft:block'].description.identifier;
                } else if (jsonData['minecraft:item']) {
                    identifier = jsonData['minecraft:item'].description.identifier;
                }
                if (identifier) {
                    typeArray.push(identifier);
                }
            } catch (error) {
                console.error(`Error al procesar el archivo ${filePath}:`, error);
            }
        }
    });
}

function formatIdentifier(identifier) {
    return identifier.split(':')[1]
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function writeLangFile() {
    let content = '';

    entitiesIdentifier.forEach(id => {
        const formattedName = formatIdentifier(id);
        content += `entity.${id}.name=${formattedName}\n`;
        content += `item.spawn_egg.entity.${id}.name=${formattedName}\n`;
    });

    blocksIdentifier.forEach(id => {
        const formattedName = formatIdentifier(id);
        content += `tile.${id}.name=${formattedName}\n`;
    });

    itemsIdentifier.forEach(id => {
        const formattedName = formatIdentifier(id);
        content += `item.${id}.name=${formattedName}\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`Archivo en_US.lang generado en ${OUTPUT_FILE}`);
}

function main() {
    try {
        renameFilesToJsonc(ENTITIES_DIR);
        renameFilesToJsonc(BLOCKS_DIR);
        renameFilesToJsonc(ITEMS_DIR);

        traverseDirectory(ENTITIES_DIR, entitiesIdentifier);
        traverseDirectory(BLOCKS_DIR, blocksIdentifier);
        traverseDirectory(ITEMS_DIR, itemsIdentifier);

        writeLangFile();

        renameFilesToJson(ENTITIES_DIR);
        renameFilesToJson(BLOCKS_DIR);
        renameFilesToJson(ITEMS_DIR);
    } catch (error) {
        console.warn('Error:', error);
    }
}

main();
