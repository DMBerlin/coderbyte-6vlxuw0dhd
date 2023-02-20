const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  let key = getPartitionKey(event);
  let jsonKey = stringifyKey(key);
  let safeKey = validateHashLength(jsonKey);
  return safeKey;
};

const getPartitionKey = (event = undefined) => {
  if (!event) return;
  if (event && event.partitionKey) return event.partitionKey;  
  const data = JSON.stringify(event);
  return crypto.createHash("sha3-512").update(data).digest("hex");
};

const stringifyKey = (hash, TRIVIAL_PARTITION_KEY = "0") => {
  if (hash && typeof hash !== "string") return JSON.stringify(hash);
  return TRIVIAL_PARTITION_KEY;
};

const validateHashLength = (hash, MAX_PARTITION_KEY_LENGTH = 256) => {
  if (hash && hash.length <= MAX_PARTITION_KEY_LENGTH) return hash;
  return crypto.createHash("sha3-512").update(hash).digest("hex");
}