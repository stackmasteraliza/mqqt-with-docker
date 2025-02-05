// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, TextInput, Button, StyleSheet } from "react-native";
// import { Buffer } from "buffer";
// import mqtt from "precompiled-mqtt";

// global.Buffer = global.Buffer || Buffer;

// const MQTT_BROKER_URL = "ws://broker.emqx.io:8083/mqtt"; // Correct WebSocket URL
// const MQTT_TOPIC = "test/topic"; // Change this to your topic

// const App = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState(""); // State for input message
//   const [client, setClient] = useState(null);

//   useEffect(() => {
//     const options = {
//       clientId: "react-native-" + Math.random().toString(16).substr(2, 8),
//       clean: true,
//       reconnectPeriod: 1000, 
//     };

//     const mqttClient = mqtt.connect(MQTT_BROKER_URL, options);
//     setClient(mqttClient);

//     mqttClient.on("connect", () => {
//       console.log("Connected to MQTT broker");
//       mqttClient.subscribe(MQTT_TOPIC, (err) => {
//         if (err) console.log("Subscription error:", err);
//         else console.log(`Subscribed to ${MQTT_TOPIC}`);
//       });
//     });

//     mqttClient.on("message", (topic, payload) => {
//       console.log(`Received: ${payload.toString()} on ${topic}`);
//       setMessages((prevMessages) => [...prevMessages, payload.toString()]);
//     });

//     mqttClient.on("error", (err) => console.error("MQTT Error:", err));
//     mqttClient.on("close", () => console.log("Connection closed"));
//     mqttClient.on("offline", () => console.log("Client is offline"));
//     mqttClient.on("reconnect", () => console.log("Attempting to reconnect..."));

//     return () => mqttClient.end();
//   }, []);

//   // Function to publish message
//   const sendMessage = () => {
//     if (client && message.trim() !== "") {
//       client.publish(MQTT_TOPIC, message, { qos: 0 }, (err) => {
//         if (err) console.error("Publish error:", err);
//         else console.log(`Message sent: ${message}`);
//       });
//       setMessage(""); // Clear input field
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MQTT Messages</Text>
//       <ScrollView style={styles.messageContainer}>
//         {messages.map((msg, index) => (
//           <Text key={index} style={styles.message}>{msg}</Text>
//         ))}
//       </ScrollView>

//       {/* Input field and button */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter message"
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Send Message" onPress={sendMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
//   messageContainer: { backgroundColor: "#fff", padding: 10, borderRadius: 5, elevation: 2, marginBottom: 10, maxHeight: 200 },
//   message: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
// });

// export default App;
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import mqtt from "precompiled-mqtt";

const MQTT_BROKER = "ws://192.168.64.244:9005/mqtt"; // Use local IP instead of localhost
const MQTT_TOPIC = "test/topic";

export default function App() {
  const [message, setMessage] = useState("Waiting for MQTT messages...");
  const [status, setStatus] = useState("Disconnected");
  const [inputMessage, setInputMessage] = useState(""); // State to manage input message

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `react-native-client-${Math.random().toString(16).substr(2, 8)}`,
      reconnectPeriod: 1000, 
    });

    // 🔹 Connection Events
    client.on("connect", () => {
      console.log("✅ Connected to MQTT Broker");
      setStatus("Connected");
      client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) console.log(`📡 Subscribed to ${MQTT_TOPIC}`);
      });
    });

    client.on("reconnect", () => {
      console.log("🔄 Reconnecting...");
      setStatus("Reconnecting...");
    });

    client.on("offline", () => {
      console.warn("⚠️ Client is offline");
      setStatus("Offline");
    });

    client.on("error", (err) => {
      console.error("❌ MQTT Error:", err);
      setStatus("Error");
    });

    client.on("end", () => {
      console.log("🔌 Connection closed");
      setStatus("Disconnected");
    });

    // 🔹 Message Event
    client.on("message", (topic, payload) => {
      console.log(`📨 Received: ${payload.toString()}`);
      setMessage(payload.toString());
    });

    return () => {
      client.end();
    };
  }, []);

  // Function to send a message
  const sendMessage = () => {
    const client = mqtt.connect(MQTT_BROKER);
    if (inputMessage.trim() !== "") {
      client.publish(MQTT_TOPIC, inputMessage, { qos: 0 }, (err) => {
        if (err) {
          console.error("❌ Publish Error:", err);
        } else {
          console.log(`📩 Message Sent: ${inputMessage}`);
        }
      });
      setInputMessage(""); // Clear input field after sending
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MQTT React Native Client</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.message}>Latest Message: {message}</Text>

      {/* Input field and button */}
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 250,
  },
});
