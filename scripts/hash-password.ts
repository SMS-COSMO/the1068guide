import process from 'node:process';
import { Hash } from '@adonisjs/hash';
import { Scrypt } from '@adonisjs/hash/drivers/scrypt';
import { loadProjectEnv } from './load-env.ts';

loadProjectEnv();

const password = process.env.ADMIN_PASSWORD || process.argv[2];
if (!password) {
  console.error('Usage: ADMIN_PASSWORD=\'your-password\' pnpm auth:hash');
  process.exit(1);
}

const hash = await new Hash(new Scrypt({})).make(password);
console.log(hash);
