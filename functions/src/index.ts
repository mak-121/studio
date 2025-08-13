import { https } from 'firebase-functions';
import next from 'next';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';
const nextAppDir = path.join(__dirname, '.');

const nextApp = next({
  dev: isDev,
  conf: { distDir: '.next' },
  dir: nextAppDir,
});
const handle = nextApp.getRequestHandler();

export const nextServer = https.onRequest((req, res) => {
  return nextApp.prepare().then(() => handle(req, res));
});
