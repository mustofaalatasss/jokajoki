const fs = require('fs');
const path = 'src/app/(main)/dashboard/actions.ts';
let code = fs.readFileSync(path, 'utf-8');

const importStatement = `import { checkDemoMutation } from "@/lib/checkDemo"\n`;
if (!code.includes('checkDemoMutation')) {
  code = importStatement + code;
}

const functionsToBlock = [
  'addToQueue',
  'pullToSquad',
  'removeFromQueue',
  'kickFromSquad',
  'startMatch',
  'endMatch',
  'cancelMatch',
  'removePlayerFromMatch',
  'grantBonusMatch',
  'blacklistCustomer',
  'quickProcessMatches',
  'closeSession',
  'editQueueItem'
];

for (const fn of functionsToBlock) {
  const regex = new RegExp(`(export async function ${fn}\\([^)]*\\) \\{\\n)`);
  code = code.replace(regex, `$1  await checkDemoMutation();\n`);
}

fs.writeFileSync(path, code);
console.log('Successfully patched actions.ts');
