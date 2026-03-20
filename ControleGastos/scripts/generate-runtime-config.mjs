import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const apiBaseUrl = process.env.API_BASE_URL ?? '';
const normalizedApiBaseUrl = apiBaseUrl.trim().replace(/\/$/, '');

const runtimeConfig = {
  apiBaseUrl: normalizedApiBaseUrl,
};

const outputPath = join(process.cwd(), 'public', 'runtime-config.js');
const fileContent = `window.__RUNTIME_CONFIG__ = ${JSON.stringify(runtimeConfig, null, 2)};\n`;

writeFileSync(outputPath, fileContent, { encoding: 'utf-8' });

console.log(`runtime-config generated at ${outputPath}`);
console.log(`API_BASE_URL: ${normalizedApiBaseUrl || '(empty)'}`);
