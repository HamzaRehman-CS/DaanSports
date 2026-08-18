const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');

async function runGitSync() {
  console.log('🔍 Checking git status in:', dir);
  
  // Get list of changed files
  const matrix = await git.statusMatrix({ fs, dir });
  const changedFiles = matrix
    .filter(row => row[1] !== row[2] || row[2] !== row[3])
    .map(row => row[0])
    .filter(file => !file.startsWith('.system_generated') && !file.includes('node_modules'));

  console.log(`📋 Found ${changedFiles.length} modified/new files:`, changedFiles);

  for (const file of changedFiles) {
    try {
      if (fs.existsSync(path.join(dir, file))) {
        await git.add({ fs, dir, filepath: file });
      } else {
        await git.remove({ fs, dir, filepath: file });
      }
    } catch (e) {
      console.warn(`Warning adding ${file}:`, e.message);
    }
  }

  console.log('💾 Creating commit...');
  let sha;
  try {
    sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'HamzaRehman-CS',
        email: 'hamzarehman.cs@gmail.com'
      },
      message: 'Redesign hero section with full-bleed background slider, DS logo, and Admin CMS controls'
    });
    console.log('✅ Commit created successfully:', sha);
  } catch (cErr) {
    console.log('Commit notice:', cErr.message);
  }

  console.log('🚀 Pushing to remote repository (main)...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main'
  });

  console.log('🎉 Push completed successfully!', JSON.stringify(pushResult));
}

runGitSync().catch(err => {
  console.error('❌ Git sync failed:', err);
  process.exit(1);
});
