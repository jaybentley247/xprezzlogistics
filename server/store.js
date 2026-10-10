// JSON-file persistence. Every write goes to a temp file first and is then
// renamed over the real one, so a crash mid-write never corrupts the data.
// Writes are queued so concurrent requests can't interleave.
const fs = require("node:fs");
const path = require("node:path");

const EMPTY = { shipments: [], quotes: [], messages: [] };

function createStore(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });

  let data;
  if (fs.existsSync(file)) {
    data = { ...EMPTY, ...JSON.parse(fs.readFileSync(file, "utf8")) };
  } else {
    data = structuredClone(EMPTY);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  let queue = Promise.resolve();

  function persist() {
    const snapshot = JSON.stringify(data, null, 2);
    queue = queue.then(async () => {
      const tmp = `${file}.tmp`;
      await fs.promises.writeFile(tmp, snapshot);
      await fs.promises.rename(tmp, file);
    });
    return queue;
  }

  return {
    get data() {
      return data;
    },
    persist,
  };
}

module.exports = { createStore };
