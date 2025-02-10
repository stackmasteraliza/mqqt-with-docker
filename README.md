# React Native MQTT with Docker

This project demonstrates how to integrate MQTT with a React Native app using Docker.

## Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)

## Setting Up MQTT Broker with Docker

1. Pull the Mosquitto MQTT broker image:
   ```sh
   docker pull eclipse-mosquitto
   ```

2. Create a configuration file for Mosquitto:
   ```sh
   mkdir mosquitto
   cd mosquitto
   echo "listener 1883
   allow_anonymous true" > mosquitto.conf
   ```

3. Run the Mosquitto MQTT broker in a Docker container:
   ```sh
   docker run -d --name mosquitto -p 1883:1883 -v $(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
   ```

## Setting Up React Native with MQTT

1. Create a new React Native project (if not already created):
   ```sh
   npx react-native init MqttApp
   cd MqttApp
   ```

2. Install the MQTT library:
   ```sh
   npm install precompiled-mqtt
   ```

3. Implement MQTT in your React Native app:

   ```javascript
   import React, { useEffect, useState } from 'react';
   import { View, Text } from 'react-native';
   import mqtt from 'precompiled-mqtt';

   const MQTT_BROKER = 'mqtt://localhost:1883';
   const TOPIC = 'test/topic';

   const App = () => {
       const [message, setMessage] = useState('');
       
       useEffect(() => {
           const client = mqtt.connect(MQTT_BROKER);
           
           client.on('connect', () => {
               console.log('Connected to MQTT Broker');
               client.subscribe(TOPIC);
           });

           client.on('message', (topic, payload) => {
               setMessage(payload.toString());
           });

           return () => client.end();
       }, []);

       return (
           <View>
               <Text>MQTT Message: {message}</Text>
           </View>
       );
   };

   export default App;
   ```

## Running the Application

1. Start the MQTT broker (if not already running):
   ```sh
   docker start mosquitto
   ```

2. Run the React Native application:
   ```sh
   npx react-native run-android # For Android
   npx react-native run-ios # For iOS
   ```

3. Publish a test message to the MQTT broker:
   ```sh
   docker exec -it mosquitto mosquitto_pub -h localhost -t test/topic -m "Hello MQTT"
   ```

## Troubleshooting

- If the React Native app cannot connect to the broker, ensure Docker is running and the MQTT broker is accessible.
- For Android, update `MQTT_BROKER` to `mqtt://10.0.2.2:1883` when using an emulator.
- For iOS, update `MQTT_BROKER` to `mqtt://localhost:1883` and ensure the iOS simulator has network access.

## License
This project is licensed under the MIT License.
