const rewire = require('rewire');
const { deterministicPartitionKey } = require("./dpk");
const dkp = rewire('./dpk.js');

const INVALID_HASH = 'e35eea006bad740f85ee38cb3cd94c1b71ceebaaf1be1aee4c7e976a29c0d719e35eea006bad740f85ee38cb3cd94c1b71ceebaaf1be1aee4c7e976a29c0d719e35eea006bad740f85ee38cb3cd94c1b71ceebaaf1be1aee4c7e976a29c0d719e35eea006bad740f85ee38cb3cd94c1b71ceebaaf1be1aee4c7e976a29c0d719e35eea006bad740f85ee38cb3cd94c1b71ceebaaf1be1aee4c7e976a29c0d719';

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Sould return empty for no valid event", () => {
    const getPartitionKey = dkp.__get__('getPartitionKey');
    const hash = getPartitionKey();
    expect(hash).toBe(undefined);
  });

  it("Sould return invalid hash for empty event partitonKey", () => {
    const getPartitionKey = dkp.__get__('getPartitionKey');
    const event = {
      partitionKey: null,
    }
    const hash = getPartitionKey(event);
    const validation = isValidSHA256(hash);
    expect(validation).toBe(false);
  });

  it("Sould return default key on stringifyHash if no key is given", () => {
    const stringifyKey = dkp.__get__('stringifyKey');
    const key = stringifyKey(null);
    expect(key).toBe("0");
  });

  it("Hash lenght should be 256 max on length", () => {
    const dkp = rewire('./dpk.js');
    const validateHashLength = dkp.__get__('validateHashLength');
    const hash = validateHashLength(INVALID_HASH);
    expect(hash.length).toBeLessThanOrEqual(256);
  });
});

// Helper Functions
function isValidSHA256(str) {
  // Regular expression to check if string is a SHA256 hash
  const regexExp = /^[a-f0-9]{64}$/gi;
  return regexExp.test(str) === true;
}
