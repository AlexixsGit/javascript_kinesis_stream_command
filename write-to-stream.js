const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({ region: 'us-west-2' });

const StreamName = 'toll-records';

(async function () {
  let i = 0;

  while (i < 50) {
    i++;

    const PartitionKey = getZipcode();
    const Data = Buffer.from(getLicensePlateNumber());

    const params = {
      StreamName,
      PartitionKey,
      Data
    };

    const result = await kinesis.putRecord(params).promise();
    console.log({ result });
  }
})();

function getLicensePlateNumber() {
  // Generates random strings for license plate numbers
  return Math.random().toString(36).slice(-6).toUpperCase();
}

function getZipcode() {
  const zipCodes = ['32801', '32802', '32803', '32804'];
  return zipCodes[Math.floor(Math.random() * zipCodes.length)];
}
