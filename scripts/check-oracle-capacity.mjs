import { spawn } from "child_process";
import { oracleEnv, sshBaseArgs } from "./oracle-env.mjs";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with code ${code}`));
    });
  });
}

await run("ssh", [
  ...sshBaseArgs(),
  [
    "echo 'Oracle disk capacity';",
    "df -h /;",
    "echo;",
    `du -sh ${oracleEnv.remoteDir} 2>/dev/null || true;`,
  ].join(" "),
]);
