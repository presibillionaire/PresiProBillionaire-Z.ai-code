import { spawn } from "child_process";

const log = (msg: string) => console.log(`[supervisor ${new Date().toISOString()}] ${msg}`);

log("Starting Vite supervisor...");

function startVite() {
  const child = spawn("bun", ["run", "dev"], {
    cwd: "/home/z/my-project",
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  child.on("exit", (code, signal) => {
    log(`Vite exited (code=${code}, signal=${signal}). Restarting in 3s...`);
    setTimeout(startVite, 3000);
  });

  child.on("error", (err) => {
    log(`Vite error: ${err.message}. Restarting in 3s...`);
    setTimeout(startVite, 3000);
  });

  log(`Vite started (PID: ${child.pid})`);
  return child;
}

startVite();
