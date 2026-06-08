const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const testFiles = [];
const nextCacheMock = {
  calls: [],
  reset() {
    this.calls = [];
  },
  revalidateTag(tag, profile) {
    this.calls.push([tag, profile]);
  },
};

globalThis.__nextCacheMock = nextCacheMock;

const originalResolveFilename = Module._resolveFilename;
const originalLoad = Module._load;

function resolveWithExtensions(candidate) {
  const extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"];

  for (const extension of extensions) {
    const filePath = `${candidate}${extension}`;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  for (const extension of [".ts", ".tsx", ".js", ".jsx"]) {
    const filePath = path.join(candidate, `index${extension}`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  return null;
}

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const resolvedAlias = resolveWithExtensions(path.join(srcRoot, request.slice(2)));
    if (resolvedAlias) return resolvedAlias;
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

Module._load = function load(request, parent, isMain) {
  if (request === "next/cache") {
    return {
      revalidateTag: nextCacheMock.revalidateTag.bind(nextCacheMock),
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });

  module._compile(output.outputText, filename);
}

require.extensions[".ts"] = compileTypeScript;
require.extensions[".tsx"] = compileTypeScript;

function collectTests(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      collectTests(entryPath);
      continue;
    }

    if (/\.test\.tsx?$/.test(entry.name)) {
      testFiles.push(entryPath);
    }
  }
}

collectTests(srcRoot);
testFiles.sort().forEach((filePath) => require(filePath));
