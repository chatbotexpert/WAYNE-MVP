const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bg-slate-950\/50/g, replace: 'bg-slate-50/50' },
  { search: /bg-slate-950/g, replace: 'bg-slate-50' },
  { search: /bg-slate-900/g, replace: 'bg-white' },
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /text-slate-400/g, replace: 'text-slate-600' },
  { search: /text-slate-300/g, replace: 'text-slate-500' },
  { search: /border-slate-800/g, replace: 'border-slate-200' },
  { search: /border-slate-700/g, replace: 'border-slate-300' },
  { search: /divide-slate-800/g, replace: 'divide-slate-200' },
  { search: /hover:bg-slate-800\/20/g, replace: 'hover:bg-slate-50' },
  { search: /hover:bg-slate-800/g, replace: 'hover:bg-slate-100' },
  { search: /Wayne CRM/g, replace: 'Pave Training' },
  { search: /Wayne MVP API/g, replace: 'Pave Training API' },
  { search: /wayne_user/g, replace: 'pave_user' },
  { search: /wayne\.com/g, replace: 'pavetraining.com' },
  { search: /Wayne/g, replace: 'Pave Training' }, // Catch any stragglers, but ensure case sensitivity
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [
  ...walk('./frontend/src'),
  ...walk('./backend/src'),
  './frontend/index.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Custom specific replace for 'Wayne' word if not matched
  
  replacements.forEach(({search, replace}) => {
    content = content.replace(search, replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
