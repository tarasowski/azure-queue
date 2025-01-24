const { QueueServiceClient } = require('@azure/storage-queue');
require('dotenv').config()

const CONNECTION_STRING = process.env.CONNECTION_STRING

const queueServiceClient = QueueServiceClient.fromConnectionString(CONNECTION_STRING);

async function listQueues() {
  console.log("my main function")
  const iter1 = queueServiceClient.listQueues();
  let i = 1
  for await (const item of iter1) {
    console.log("Meine Queues", item.name)
    i++
  }
}

//listQueues()

async function addToQ(queueName, messageText) {
 const queueClient = queueServiceClient.getQueueClient(queueName)
 const sendMessageResponse = await queueClient.sendMessage(messageText);
 console.log(`Sent message: ${messageText}, Message ID: ${sendMessageResponse.messageId}`);
}

//addToQ("amazonorderservice", "Hey! Die Nachricht ist von Dimi")

async function processMessage(queueName) {
  const queueClient = queueServiceClient.getQueueClient(queueName);
  const response = await queueClient.receiveMessages();
  if (response.receivedMessageItems.length === 1) {
    const receivedMessageItem = response.receivedMessageItems[0];
    console.log(`Processing & deleting message with content: ${receivedMessageItem.messageText}`);
    const deleteMessageResponse = await queueClient.deleteMessage(
      receivedMessageItem.messageId,
      receivedMessageItem.popReceipt
    );
    console.log(
      `Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`
    );
  }
}

//processMessage("amazonorderservice")

