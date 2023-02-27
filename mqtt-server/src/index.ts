import mqtt from "mqtt";

require('dotenv').config()
console.log("MESSAGE_LOGGER_ENABLED=" + (process.env.MESSAGE_LOGGER_ENABLED ?? true))

const wsPort = 1883
const httpPort = 1884

console.log((new Date()).toISOString() + ":", "Starting Server ...")

const client = mqtt.connect(
    process.env.NEXT_PUBLIC_MQTT_SERVER ?? "tcp://localhost:1883",{clientId: `myapp-configuration-pub`}
);

client.on("connect", async () => {
    const msg = {
        isUpdate: true,
        state: 1
    };
    console.log("made new message: ", msg);
    client.publish(
        `myapp/configuration`,
        Buffer.from(JSON.stringify(msg)),
        { qos: 2 }
    );
});


client.end();