const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(srcDir, function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Calculate relative path to src
        const fileDir = path.dirname(filePath);
        const relToSrc = path.relative(fileDir, srcDir);
        // if relToSrc is '', it means we're in src, so prefix './' 
        const prefix = relToSrc === '' ? './' : relToSrc + '/';

        const newContent = content.replace(/@\//g, prefix.replace(/\\/g, '/'));
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated imports in ${filePath}`);
        }
    }
});
