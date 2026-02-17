import * as vitest from 'vitest';

console.log('Vitest exports:', Object.keys(vitest));
console.log('describe type:', typeof vitest.describe);
console.log('it type:', typeof vitest.it);
console.log('test type:', typeof vitest.test);
console.log('expect type:', typeof vitest.expect);
