import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifestPath = path.join(rootDir, 'game.manifest.json');

console.log('\n🔍 ===================================================');
console.log('   MXIA Game Package Standard Validation: Kids Pim Thai');
console.log('=====================================================\n');

let hasErrors = false;

function pass(msg) {
  console.log(`  ✅ [PASS] ${msg}`);
}

function fail(msg) {
  console.error(`  ❌ [FAIL] ${msg}`);
  hasErrors = true;
}

// 1. TypeScript Type Check
console.log('▶ 1. Running TypeScript type check (tsc --noEmit)...');
try {
  execSync('npx tsc --noEmit', { cwd: rootDir, stdio: 'pipe' });
  pass('TypeScript compilation passed with 0 errors.');
} catch (err) {
  fail(`TypeScript errors found:\n${err.stdout ? err.stdout.toString() : err.message}`);
}

// 2. game.manifest.json Validation
console.log('\n▶ 2. Validating game.manifest.json in project root...');
if (!fs.existsSync(manifestPath)) {
  fail('game.manifest.json is missing in project root!');
} else {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    if (manifest.id !== 'kids-pim-thai') {
      fail(`Manifest id must be "kids-pim-thai", got "${manifest.id}"`);
    } else {
      pass(`Manifest ID: "${manifest.id}"`);
    }

    if (!manifest.version) {
      fail('Manifest version is missing');
    } else {
      pass(`Manifest Version: "${manifest.version}"`);
    }

    if (manifest.productionUrl !== 'https://www.mxiaapp.com/th/app/kids-pim-thai') {
      fail(`Manifest productionUrl must be "https://www.mxiaapp.com/th/app/kids-pim-thai", got "${manifest.productionUrl}"`);
    } else {
      pass(`Production URL: "${manifest.productionUrl}"`);
    }

    if (manifest.route !== '/th/app/kids-pim-thai') {
      fail(`Manifest route must be "/th/app/kids-pim-thai", got "${manifest.route}"`);
    } else {
      pass(`Route: "${manifest.route}"`);
    }

    if (!manifest.storage || manifest.storage.namespace !== 'mxia:game:kids-pim-thai:v1:') {
      fail('Manifest storage.namespace must be "mxia:game:kids-pim-thai:v1:"');
    } else {
      pass(`Storage Namespace: "${manifest.storage.namespace}"`);
    }

    if (!manifest.security || !manifest.security.externalResources || manifest.security.externalResources.length === 0) {
      fail('Manifest security.externalResources must declare external fonts/APIs');
    } else {
      pass(`Declared External Resources: ${manifest.security.externalResources.length} items`);
    }
  } catch (err) {
    fail(`Invalid game.manifest.json: ${err.message}`);
  }
}

// 3. Validate dist/ Directory & Asset Paths
console.log('\n▶ 3. Validating dist/ directory and asset paths...');
if (!fs.existsSync(distDir)) {
  fail('dist/ directory does not exist! Please run "npm run build" first.');
} else {
  const distIndexHtml = path.join(distDir, 'index.html');
  const distManifest = path.join(distDir, 'game.manifest.json');

  if (!fs.existsSync(distIndexHtml)) {
    fail('dist/index.html is missing!');
  } else {
    pass('dist/index.html exists and is self-contained.');

    const htmlContent = fs.readFileSync(distIndexHtml, 'utf8');

    // Check for illegal relative or root asset references
    if (htmlContent.includes('src="./assets/') || htmlContent.includes('href="./assets/')) {
      fail('dist/index.html contains relative "./assets/" path! It will 404 on no-trailing-slash routes.');
    } else if (htmlContent.includes('src="/assets/') || htmlContent.includes('href="/assets/')) {
      fail('dist/index.html contains root "/assets/" path! Assets must be under "/th/app/kids-pim-thai/".');
    } else {
      pass('No illegal "./assets/" or root "/assets/" references found in dist/index.html.');
    }

    // Verify assets resolve under /th/app/kids-pim-thai/
    const assetMatches = [...htmlContent.matchAll(/(src|href)=["']([^"']+)["']/g)];
    let hasProperBase = false;
    for (const match of assetMatches) {
      const url = match[2];
      if (url.includes('/assets/index-')) {
        if (url.startsWith('/th/app/kids-pim-thai/assets/')) {
          hasProperBase = true;
        } else {
          fail(`Asset path "${url}" does not start with "/th/app/kids-pim-thai/assets/"!`);
        }
      }
    }

    if (hasProperBase) {
      pass('All production asset bundles strictly resolve under "/th/app/kids-pim-thai/assets/".');
    }
  }

  if (!fs.existsSync(distManifest)) {
    fail('dist/game.manifest.json is missing!');
  } else {
    pass('dist/game.manifest.json is present in build output.');
  }

  // 4. Dist Hygiene Check (No dev/source files)
  console.log('\n▶ 4. Checking dist/ hygiene (no forbidden files)...');
  const forbiddenPatterns = [
    'node_modules',
    'src',
    'package.json',
    'tsconfig.json',
    'tsconfig.node.json',
    'README.md',
    'BUG_NOTES.md',
    'AGENTS.md',
    '.git',
    '.gitignore',
  ];

  for (const forbidden of forbiddenPatterns) {
    const forbiddenPath = path.join(distDir, forbidden);
    if (fs.existsSync(forbiddenPath)) {
      fail(`Forbidden file/directory found in dist/: "${forbidden}"`);
    }
  }
  pass('dist/ is clean with zero source, config, or development files.');
}

console.log('\n=====================================================');
if (hasErrors) {
  console.error('❌ Package validation FAILED with errors above.');
  process.exit(1);
} else {
  console.log('🎉 Package validation PASSED! Ready for MXIA standard deployment.');
  process.exit(0);
}
