import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Buffer } from "buffer";
import mqtt from "precompiled-mqtt";

global.Buffer = global.Buffer || Buffer;
const MQTT_BROKER_URL = "mqtt://192.168.100.73:9002"; 


const App = () => {
  const [messages, setMessages] = useState([]);

  
  useEffect(() => {
    console.log(mqtt);
    const options = {
      clientId: "react-native-" + Math.random().toString(16).substr(2, 8),
      protocol: "ws",
      keepalive_interval: 300,
      reconnectPeriod: 1000, 
      clean: true,
    };

    const client = mqtt.connect(MQTT_BROKER_URL, options);

    console.log(client);
    
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("test/topic", (err) => {
        if (err) {
          console.log("Subscription error:", err);
        } else {
          console.log("Subscribed to topic test/topic");
        }
      });
    });
    
    client.on("error", (err) => {
      console.error("MQTT Connection Error:", err);  // Log the specific error here
    });
    
    client.on("close", () => {
      console.log("Connection closed");
    });
    
    client.on("offline", () => {
      console.log("Client is offline");
    });
    
    client.on("reconnect", () => {
      console.log("Attempting to reconnect...");
    });


    console.log(client);
    client.on("message", (topic, payload) => {
      console.log(`Received: ${payload.toString()} on ${topic}`);
      setMessages((prevMessages) => [...prevMessages, payload.toString()]);
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MQTT Messages</Text>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.message}>
            {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  messageContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // zIndex: 100
  },
});

export default App;
