const rocksdb = require('rocksdb');
const path = require('path');

// Path to RocksDB database directory
const dbPath = path.join(__dirname, '../db/rocksdb');
const db = rocksdb(dbPath);

// Function to open the database
function openDatabase() {
  return new Promise((resolve, reject) => {
    db.open({ createIfMissing: true }, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Database opened successfully');
        resolve();
      }
    });
  });
}

// Asynchronous write function
function asyncWrite(key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, value, (err) => {
      if (err) {
        console.error(`Error writing key: ${key}`, err);
        reject(err);
      } else {
        console.log(`Written: ${key} -> ${value}`);
        resolve();
      }
    });
  });
}

// Simulate high-write traffic by writing many records
async function simulateHighWriteTraffic(writeCount = 10000) {
  const writePromises = [];
  for (let i = 0; i < writeCount; i++) {
    writePromises.push(asyncWrite(`key${i}`, `value${i}`));
  }

  // Wait for all writes to complete
  await Promise.all(writePromises);
  console.log(`${writeCount} writes completed successfully!`);
}

// Main function to handle the flow
async function main() {
  try {
    await openDatabase();
    await simulateHighWriteTraffic(10000);  // Adjust the count as needed
  } catch (error) {
    console.error('Error in high-write simulation:', error);
  } finally {
    db.close(() => {
      console.log('Database closed.');
    });
  }
}

// Start the application
main();
