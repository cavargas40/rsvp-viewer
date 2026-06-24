import * as path from "path";
import Mocha from "mocha";
import { glob } from "glob";

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((c, e) => {
    try {
      // Discover test files synchronously using glob
      const files = glob.sync("**/**.test.js", { cwd: testsRoot });
      
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

      mocha.run((failures) => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error("Error setting up or running tests:", err);
      e(err);
    }
  });
}
