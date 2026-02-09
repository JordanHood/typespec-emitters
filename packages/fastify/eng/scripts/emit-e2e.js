#!/usr/bin/env node
import { exec } from "child_process";
import { promisify } from "util";
import { mkdir, rm, readFile, writeFile } from "fs/promises";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync, statSync, existsSync } from "fs";

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const specsPath = resolve(
  projectRoot,
  "node_modules/@typespec/http-specs/specs",
);
const outputBase = resolve(projectRoot, "test/e2e/generated");
const tspConfigPath = resolve(__dirname, "tspconfig.yaml");
const testIgnorePath = resolve(projectRoot, ".testignore");

async function getIgnoreList() {
  try {
    const content = await readFile(testIgnorePath, "utf8");
    return content
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim());
  } catch {
    return [];
  }
}

function findScenarios(dir, relativePath = "") {
  const scenarios = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const mainTsp = join(fullPath, "main.tsp");
      if (existsSync(mainTsp)) {
        const scenarioPath = relativePath ? `${relativePath}/${entry}` : entry;
        scenarios.push({ path: mainTsp, name: scenarioPath });
      } else {
        scenarios.push(
          ...findScenarios(
            fullPath,
            relativePath ? `${relativePath}/${entry}` : entry,
          ),
        );
      }
    }
  }

  return scenarios;
}

async function emitScenario(scenario, ignoreList, silent = false) {
  if (ignoreList.some((ignore) => scenario.name.startsWith(ignore))) {
    if (!silent) console.log(`⏭️  Skipped: ${scenario.name}`);
    return { status: "skipped", scenario: scenario.name };
  }

  const outputDir = join(outputBase, scenario.name);

  try {
    if (existsSync(outputDir)) {
      await rm(outputDir, { recursive: true, force: true });
    }
    await mkdir(outputDir, { recursive: true });

    const { stdout, stderr } = await execAsync(
      `npx tsp compile "${scenario.path}" --emit ${projectRoot} --config "${tspConfigPath}" --output-dir "${outputDir}"`,
      { cwd: projectRoot },
    );

    const hasError = stderr.includes("error") || stderr.includes("Failed");

    if (hasError) {
      if (!silent) console.error(`❌ ${scenario.name}`);
      const logDir = join(
        projectRoot,
        "temp/emit-e2e-logs",
        dirname(scenario.name),
      );
      await mkdir(logDir, { recursive: true });
      const logFile = join(logDir, "error.log");
      await writeFile(logFile, stdout + "\n" + stderr, "utf8");
      return { status: "failed", scenario: scenario.name, error: "Compilation failed" };
    }

    if (!silent) console.log(`✅ ${scenario.name}`);
    return { status: "success", scenario: scenario.name };
  } catch (error) {
    if (!silent) console.error(`❌ ${scenario.name}`);
    const logDir = join(
      projectRoot,
      "temp/emit-e2e-logs",
      dirname(scenario.name),
    );
    await mkdir(logDir, { recursive: true });
    const logFile = join(logDir, "error.log");
    const errorOutput = (error.stdout || "") + "\n" + (error.stderr || "") + "\n" + error.message;
    await writeFile(logFile, errorOutput, "utf8");
    return { status: "failed", scenario: scenario.name, error: error.message };
  }
}

async function main() {
  const silent = process.argv.includes("--silent");

  if (!silent) console.log("🔨 Emitting E2E test scenarios...\n");

  const ignoreList = await getIgnoreList();
  const scenarios = findScenarios(specsPath);

  if (!silent) console.log(`Found ${scenarios.length} scenarios\n`);

  const concurrencyLimit = 4;
  const results = [];

  for (let i = 0; i < scenarios.length; i += concurrencyLimit) {
    const batch = scenarios.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map((scenario) => emitScenario(scenario, ignoreList, silent))
    );
    results.push(...batchResults);
  }

  const succeeded = results.filter((r) => r.status === "success");
  const failed = results.filter((r) => r.status === "failed");
  const skipped = results.filter((r) => r.status === "skipped");

  if (!silent) {
    console.log("\n📊 Summary:");
    console.log(`  Succeeded: ${succeeded.length}`);
    console.log(`  Failed: ${failed.length}`);
    console.log(`  Skipped: ${skipped.length}`);
    console.log(`  Total: ${scenarios.length}`);
  }

  if (failed.length > 0) {
    if (!silent) {
      console.log("\n❌ Failed scenarios:");
      failed.forEach((f) => console.log(`  - ${f.scenario}`));
      console.log("\nSee temp/emit-e2e-logs/ for details");
    }
    process.exit(1);
  }

  if (!silent) console.log("\n✅ All scenarios emitted successfully!");
}

main();
