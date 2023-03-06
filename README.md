# Project Description

### `mqtt_broker`

_this is an aedes mqtt broker that handles message passing with the mqtt protocol._

+ https://github.com/moscajs/aedes
+ https://mqtt.org

This application needs to be run to allow the other applications to "speak" with each other, but should not need to be modified.

### `mqtt-server`

_this is a barebones mock server. It handles communication over mqtt protocol._

This application emulates what a data analysis server would be doing, it listens for configuration and dataset messages from the front end application `my-app`.

### `my-app`

_this is a React application using nextjs and typescript. It contains a mock data processing handler that renders a data processing button. It communicates with the `mqtt-server` using mqtt protocol and the `mqtt_broker`._

This application sends data on the dataset topic, configuration on the configuration topic and gets data analysis on the results topic. Data is sent as JSON objects.

## Setup

+ install node 16
    - https://github.com/nodesource/distributions/blob/master/README.md#debinstall
+ install yarn
+ each of the 3 apps have readme's with setup instructions

## Instructions

+ Complete a *Task* and submit a PR for the changes.
+ Share progress as part of daily meeting (~5min)

## Task

_We need our data to be processed as soon as it is loaded, and then displayed as soon as it is available. Data processing requires *enabling* the data processing instance and then data can be sent to be processed._

#### requirements

- [ ] data sent to data processing server.
- [ ] processed data displayed in the web app.