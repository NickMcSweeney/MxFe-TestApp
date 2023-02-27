'use client';

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
// import { v4 as uuidv4 } from "uuid";
import { selectDataset, selectProc, setDatasetLoad, setProcResult, hasData, hasResult } from "../store/datasetSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DataProcessingHandler() {
  const dispatch = useDispatch();

  const dataLoaded = useSelector(hasData);
  const dataProcessed = useSelector(hasResult);
  const dataset = useSelector(selectDataset);
  const dataResult = useSelector(selectProc);

  const loadData = (data: number[]) => dispatch(setDatasetLoad(data));
  const loadResult = (res: number) => dispatch(setProcResult(res));

  useEffect(() => {
    // Publish configuration message here
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
    return () => {
      client.end();
    };
  }, []);

  return (
    <div></div>
  );
}