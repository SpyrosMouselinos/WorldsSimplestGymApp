import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import electron from 'electron';
const server = await createServer();
await server.listen();
const env = { ...process.env, VITE_DEV_SERVER_URL: server.resolvedUrls.local[0] };
delete env.ELECTRON_RUN_AS_NODE;
const child = spawn(electron, ['.'], { env, stdio: 'inherit', windowsHide: true });
child.on('exit', async (code) => {
  await server.close();
  process.exit(code ?? 0);
});
process.on('SIGINT', () => child.kill());
