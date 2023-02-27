import * as mqtt from "mqtt";

require("dotenv").config();
console.log(
  "MESSAGE_LOGGER_ENABLED=" + (process.env.MESSAGE_LOGGER_ENABLED ?? true)
);

let dataProcessingEnabled = false;
const processData = (val: number[]) =>
  val.reduce((partialSum, a) => partialSum + a, 0);

console.log(new Date().toISOString() + ":", "Starting Server ...");

const client = mqtt.connect(
  process.env.NEXT_PUBLIC_MQTT_SERVER ?? "tcp://localhost:1884",
  { clientId: `data-processing-server` }
);

console.log("set mqtt client ", client.options.host);

client.on("connect", () => {
  client.subscribe(
    "test",
    (err) => !err ?? client.publish("test", "Hello MQTT")
  );
});
client.on("message", (topic: string, message: any) =>
  console.log("topic: ", topic, " message: ", message.toString())
);
client.on("connect", async () => {
  // Subscribe to topics
  client.publish(
    `server/status`,
    JSON.stringify({ isUpdate: false, state: 0 }),
    {
      qos: 2,
    }
  );
  console.log("subscribing to topics");
  client.subscribe(`myapp/configuration`, { qos: 2 }, (err: any) => {
    if (!err) {
      client.publish(`server/debug`, "Subscribed to myapp/configuration", {
        qos: 2,
      });
    }
  });
  client.subscribe(`myapp/dataset`, { qos: 2 }, (err: any) => {
    if (!err) {
      client.publish(`server/debug`, "Subscribed to myapp/dataset", {
        qos: 2,
      });
    }
  });
});

client.on("message", (topic, payload, _) => {
  // handle incoming message data
  if (topic == "myapp/configuration") {
    const msg = JSON.parse(payload.toString());
    console.log("Recieved configuration: ", msg);
    dataProcessingEnabled = msg.isUpdate
      ? msg.state == 1
      : dataProcessingEnabled;
    client.publish(
      `server/status`,
      JSON.stringify({ isUpdate: false, state: msg.state }),
      {
        qos: 2,
      }
    );
    console.log(
      dataProcessingEnabled
        ? "Data processing enabled"
        : "Data processing not enabled"
    );
  }
  if (topic == "myapp/dataset" && dataProcessingEnabled) {
    const msg = JSON.parse(payload.toString());

    console.log("Recieved dataset: ", msg);
    const res = {
      data: processData(msg.data),
    };

    console.log("publishing results: ", res);
    client.publish(`server/result`, JSON.stringify(res), {
      qos: 2,
    });
  }
});

// client.end();
