import { spawn } from "child_process";

const steps = [
  ["npm", ["run", "check:uploads"]],
  ["npm", ["run", "build"]],
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

for (const [command, args] of steps) {
  await run(command, args);
}
