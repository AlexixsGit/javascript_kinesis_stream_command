Execute these commands to work with the project

/****Install dependencies*****/
* npm install

/****Create stream************/
* node create-stream.js

/****You must create a lambda with this code******/
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB();

exports.handler = (event) => {
  event.Records.forEach(async function (record) {
    const licensePlate = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
    const zipCode = record.kinesis.partitionKey;

    await writeToDB({ zipCode, licensePlate });
  });
};

async function writeToDB({ zipCode, licensePlate }) {
  const params = {
    Item: {
      zipCode: {
        N: zipCode,
      },
      licensePlate: {
        S: licensePlate,
      },
      timeStamp: {
        N: Date.now().toString(),
      },
    },
    TableName: 'toll-records',
  };

  return db.putItem(params).promise();
}

/*****Create a policy named 'writeTollRecords' with these permissions*****/
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action":   [ "dynamodb:PutItem" ],
      "Resource": [ "arn:aws:dynamodb:*:*:table/toll-records" ]
    }
  ]
}

/*****run this command to write in the stream*****/
* node write-to-stream.js