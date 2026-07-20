const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/app/(main)/dashboard/DashboardClient.tsx',
  'src/app/(main)/dashboard/InlineAddQueueForm.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/layout/Header.tsx',
  'src/components/ui/Table.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/Input.tsx',
  'src/components/ui/Select.tsx',
  'src/components/ui/Dialog.tsx',
  'src/components/ui/Drawer.tsx',
];

filePaths.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log('Skipping (not found):', filePath);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;
  
  // Replace text-white with text-[var(--text-primary)]
  content = content.replace(/\btext-white\b/g, 'text-[var(--text-primary)]');
  
  // Replace border-white/5, border-white/10, border-white/20 with border-[var(--border-default)]
  content = content.replace(/\bborder-white\/[0-9]+\b/g, 'border-[var(--border-default)]');
  
  // Replace bg-black/XX with bg-[var(--surface-2)]
  content = content.replace(/\bbg-black\/[0-9]+\b/g, 'bg-[var(--surface-2)]');
  
  // Replace bg-black with bg-[var(--surface-1)] (but carefully, might overlap with bg-black/40 if not careful, though \b handles it mostly)
  content = content.replace(/\bbg-black\b(?!\/)/g, 'bg-[var(--surface-1)]');
  
  // Replace text-gray-400 with text-muted
  content = content.replace(/\btext-gray-[0-9]+\b/g, 'text-muted');

  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', filePath);
  } else {
    console.log('No changes in', filePath);
  }
});
