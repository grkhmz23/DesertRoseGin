import { execSync, spawn } from "node:child_process";

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
  } catch {
    return "";
  }
}

function kill5000() {
  // Try lsof
  const pids = run("lsof -ti tcp:5000");
  if (pids) {
    run(`kill -9 ${pids.split("\n").join(" ")}`);
    return;
  }
  // Try fuser
  run("fuser -k 5000/tcp || true");
  // Fallback, kill common dev server
  run('pkill -f "tsx server/index.ts" || true');
  run('pkill -f "node dist/index.cjs" || true');
}

kill5000();

const child = spawn("npm", ["run", "dev:raw"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
