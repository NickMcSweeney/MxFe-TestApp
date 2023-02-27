require('dotenv').config()
console.log("MESSAGE_LOGGER_ENABLED=" + (process.env.MESSAGE_LOGGER_ENABLED ?? true))

import {AedesPublishPacket, Client, Subscription} from "aedes";
import * as protobuf from "protobufjs";

console.log((new Date()).toISOString() + ":", "Starting keyser ...")
console.log((new Date()).toISOString() + ":", "Initializing protobuf ...")
protobuf.load("../datastructs.proto", (error, root) => {
  if (error) {
    console.error((new Date()).toISOString() + ":", "Error loading protobuf:", error)
    throw error;
  }
  if (root === undefined) {
    console.error((new Date()).toISOString() + ":", "protobuf root undefined! There may be an issue with the protobuf schema itself.")
    throw new Error("protobuf root undefined! There may be an issue with the protobuf schema itself.");
  }

  const aedes = require('aedes')()
  const { createServer } = require('aedes-server-factory')
  const wsPort = 1883
  const httpPort = 1884

  let dataProcessingEnabled = false;
  const processData = (val: number[]) => val.reduce((partialSum, a) => partialSum + a,0);

  const wsServer = createServer(aedes, { ws: true })
  const httpServer = createServer(aedes)

  wsServer.listen(wsPort, function () {
    console.log((new Date()).toISOString() + ":", 'MQTT WS server listening on port ' + wsPort)
  })
  httpServer.listen(httpPort, function () {
    console.log((new Date()).toISOString() + ":", 'MQTT HTTP started and listening on port ' + httpPort)
  })

  // fired on subscribe
  aedes.on('subscribe', (subscriptions: Subscription[], client: Client) => {
    console.log((new Date()).toISOString() + ":", 'MQTT client \x1b[32m' + (client ? client.id : client) +
      '\x1b[0m subscribed to topic(s): ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  })

  // fired on unsubscribe
  aedes.on('unsubscribe', (subscriptions: string[], client: Client) => {
    console.log((new Date()).toISOString() + ":", 'MQTT client \x1b[32m' + (client ? client.id : client) +
      '\x1b[0m unsubscribed from topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
  })

  // fired when a client connects
  aedes.on('client', (client: Client) => {
    console.log((new Date()).toISOString() + ":", 'Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a client disconnects
  aedes.on('clientDisconnect', (client: Client) => {
    console.log((new Date()).toISOString() + ":", 'Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })

  // fired when a message is published
  if (process.env.MESSAGE_LOGGER_ENABLED ?? true)
    aedes.on('publish', async (packet: AedesPublishPacket, client: Client) => {
      console.log((new Date()).toISOString() + ":", 'Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published a packet of size', packet.payload.length, 'on', packet.topic, 'to broker', aedes.id)
    })
  
  aedes.on('publish', async (packet: AedesPublishPacket, client: Client) => {
    if (packet.topic == "myapp/configuration") {
      const msg = JSON.parse(packet.payload.toString());
      msg.isUpdate ?? (dataProcessingEnabled = msg.state);
    }
    if (packet.topic == "myapp/dataset") {
      const msg = JSON.parse(packet.payload.toString());
      const res = {
        uuid : msg.uuid,
        data: processData(msg.data)
      };
      client.publish(`server/processed` ,Buffer.from(JSON.stringify(res)));
    }
  })
});
