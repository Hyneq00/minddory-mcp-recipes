#!/usr/bin/env node
// Print the MindDory MCP tool list, live, straight from the server.
//
// No account, no OAuth, no dependencies. `tools/list` is unauthenticated on this
// server, so this is the one thing in the repo you can run before you decide
// whether you want an account at all. `tools/call` is a different matter and
// answers 401 with a WWW-Authenticate header, which is what the --probe flag
// checks.
//
// Usage:
//   node scripts/list-tools.mjs            names, kinds and the first line of each description
//   node scripts/list-tools.mjs --json     the raw tools/list result, unmodified
//   node scripts/list-tools.mjs --probe    also confirm that calling a tool requires auth
//   node scripts/list-tools.mjs --schemas  rewrite schemas/ from what the server says today
//
// Exits 1 if the server cannot be reached or answers something other than a
// tool list, so it is usable as a check in CI.

import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENDPOINT = process.env.MINDDORY_MCP_URL || 'https://api.minddory.com/v1/brain/mcp';
const SCHEMA_DIR = join(dirname(dirname(fileURLToPath(import.meta.url))), 'schemas');

const args = new Set(process.argv.slice(2));
const wantJson = args.has('--json');
const wantProbe = args.has('--probe');
const wantSchemas = args.has('--schemas');

async function rpc(method, params) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, ...(params ? { params } : {}) }),
  });
  return res;
}

function firstLine(text) {
  const line = String(text || '').split(/(?<=\.)\s/)[0].trim();
  return line.length > 150 ? `${line.slice(0, 147)}...` : line;
}

async function main() {
  let res;
  try {
    res = await rpc('tools/list');
  } catch (err) {
    console.error(`Could not reach ${ENDPOINT}: ${err.message}`);
    process.exit(1);
  }

  if (!res.ok) {
    console.error(`${ENDPOINT} answered HTTP ${res.status}`);
    process.exit(1);
  }

  const body = await res.json();
  const tools = body?.result?.tools;
  if (!Array.isArray(tools) || tools.length === 0) {
    console.error('Response carried no tool list. Raw body:');
    console.error(JSON.stringify(body, null, 2));
    process.exit(1);
  }

  if (wantJson) {
    console.log(JSON.stringify(body.result, null, 2));
  } else {
    const reads = tools.filter((t) => t.annotations?.readOnlyHint);
    const writes = tools.filter((t) => !t.annotations?.readOnlyHint);
    console.log(`${ENDPOINT}`);
    console.log(`${tools.length} tools: ${reads.length} read, ${writes.length} write\n`);
    for (const group of [['READ', reads], ['WRITE', writes]]) {
      const [label, list] = group;
      console.log(label);
      for (const tool of list) {
        console.log(`  ${tool.name.padEnd(26)} ${firstLine(tool.description)}`);
      }
      console.log('');
    }
  }

  if (wantSchemas) {
    // Blow the directory away first. A stale file for a tool the server no
    // longer publishes is the failure mode that matters here: it reads as
    // documentation and it is a lie.
    await rm(SCHEMA_DIR, { recursive: true, force: true });
    await mkdir(SCHEMA_DIR, { recursive: true });
    for (const tool of tools) {
      const doc = {
        name: tool.name,
        title: tool.title ?? null,
        kind: tool.annotations?.readOnlyHint ? 'read' : 'write',
        annotations: tool.annotations ?? {},
        description: tool.description,
        inputSchema: tool.inputSchema,
      };
      await writeFile(join(SCHEMA_DIR, `${tool.name}.json`), `${JSON.stringify(doc, null, 2)}\n`);
    }
    const written = (await readdir(SCHEMA_DIR)).length;
    console.log(`\nwrote ${written} schema files to schemas/`);
    if (written !== tools.length) {
      console.error(`Expected ${tools.length} files, found ${written}`);
      process.exit(1);
    }
  }

  if (wantProbe) {
    const call = await rpc('tools/call', { name: 'get_user_profile', arguments: {} });
    const auth = call.headers.get('www-authenticate');
    console.log(`tools/call without a token -> HTTP ${call.status}`);
    if (auth) console.log(`www-authenticate: ${auth}`);
    if (call.status !== 401) {
      console.error(`Expected 401 from an unauthenticated tools/call, got ${call.status}`);
      process.exit(1);
    }
  }
}

main();
