import fs from 'fs';
import path from 'path';

interface ConfigPreserver {
    restore: () => void;
}

/**
 * Preserves config files (Cargo.toml, package.json, etc.) during client generation.
 */
export function preserveConfigFiles(typescriptClientsDir: string, rustClientsDir: string): ConfigPreserver {
    const filesToPreserve = ['package.json', 'tsconfig.json', '.npmignore', 'pnpm-lock.yaml', 'Cargo.toml'];
    const preservedFiles = new Map<string, string>();

    filesToPreserve.forEach(filename => {
        const filePath = path.join(typescriptClientsDir, filename);
        const tempPath = path.join(typescriptClientsDir, `${filename}.temp`);

        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, tempPath);
            preservedFiles.set(filename, tempPath);
        }
    });

    const rustCargoPath = path.join(rustClientsDir, 'Cargo.toml');
    const rustCargoTempPath = path.join(rustClientsDir, 'Cargo.toml.temp');

    if (fs.existsSync(rustCargoPath)) {
        fs.copyFileSync(rustCargoPath, rustCargoTempPath);
        preservedFiles.set('rust_cargo', rustCargoTempPath);
    }

    return {
        restore: () => {
            preservedFiles.forEach((tempPath, filename) => {
                try {
                    if (filename === 'rust_cargo') {
                        const filePath = path.join(rustClientsDir, 'Cargo.toml');
                        if (fs.existsSync(tempPath)) {
                            fs.copyFileSync(tempPath, filePath);
                            fs.unlinkSync(tempPath);
                        }
                    } else {
                        const filePath = path.join(typescriptClientsDir, filename);
                        if (fs.existsSync(tempPath)) {
                            fs.copyFileSync(tempPath, filePath);
                            fs.unlinkSync(tempPath);
                        }
                    }
                } catch (error) {
                    // Silently handle cleanup errors - they shouldn't fail the build
                    console.warn(`Warning: Failed to cleanup temporary file ${tempPath}:`, (error as Error).message);
                }
            });
        },
    };
}
