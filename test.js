const http = require("http");

// Start the server temporarily for testing
const server = require("./server");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "GET",
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// Wait for server to be ready then run tests
setTimeout(() => {
  console.log("\n🧪 Running tests...\n");

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      assert(res.statusCode === 200, `Status code is 200 (got ${res.statusCode})`);
      assert(data.startsWith("Hello From the Server "), `Response starts with "Hello From the Server "`);

      const timePart = data.replace("Hello From the Server ", "").trim();
      const parsedDate = new Date(timePart);
      assert(!isNaN(parsedDate.getTime()), `Response contains a valid ISO timestamp (got "${timePart}")`);

      console.log(`\n📋 Response received: "${data}"`);
      console.log(`\n✨ Results: ${passed} passed, ${failed} failed\n`);

      server.close();
      process.exit(failed > 0 ? 1 : 0);
    });
  });

  req.on("error", (err) => {
    console.error("Request failed:", err.message);
    server.close();
    process.exit(1);
  });

  req.end();
}, 200);
