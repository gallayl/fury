import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback
} from "react";
import { Checkbox, Button, TextField } from "@material-ui/core";
import { MqttContext } from "../context/mqtt-context";

export const Mqtt: React.FunctionComponent = () => {
  const mqtt = useContext(MqttContext);
  const [mqttDump, setMqttDump] = useState("");
  const [allDumps, setAllDumps] = useState(mqttDump);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllDumps(`${allDumps}${mqttDump}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttDump]);

  const onMessage = useCallback((topic: string, message: Buffer) => {
    // message is Buffer
    setMqttDump(`${topic} - ${message.toString()}\r\n`);
    termRef.current &&
      termRef.current.scrollTo({
        top: termRef.current.scrollHeight,
        behavior: "smooth"
      });
  }, []);

  useEffect(() => {
    mqtt.subscribe("console");
    mqtt.on("message", onMessage);
    mqtt.on("error", e => console.warn(e));
    return () => {
      mqtt.unsubscribe("console");
      mqtt.off("message", onMessage);
    };
  }, [mqtt, onMessage]);

  const sendMsg = useCallback(
    (topic: string, msg: string, retain: boolean) => {
      mqtt &&
        mqtt.publish(topic, msg, {
          retain,
          qos: 0
        });
    },
    [mqtt]
  );

  const [newMsg, setNewMsg] = useState("");
  const [newTopic, setNewTopic] = useState("console");
  const [retainNew, setRetainNew] = useState(false);

  return (
    <div
      ref={termRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "'Cascadia Code', 'Courier New', monospace",
        backgroundColor: "black",
        color: "lightgray",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <pre style={{ overflow: "auto" }}>{allDumps}</pre>
      <form
        onSubmit={ev => {
          ev.preventDefault();
          sendMsg(newTopic, newMsg, retainNew);
          setNewMsg("");
        }}
      >
        <TextField
          type="text"
          value={newTopic}
          placeholder="Topic"
          label="Topic"
          onChange={ev => setNewTopic(ev.currentTarget.value)}
          autoFocus
        />

        <TextField
          type="text"
          placeholder="Message"
          label="Message"
          value={newMsg}
          onChange={ev => setNewMsg(ev.currentTarget.value)}
          autoFocus
        />
        <Checkbox
          onChange={(_ev, value) => setRetainNew(value)}
          title="Retain"
        />
        <Button type="submit">send</Button>
      </form>
    </div>
  );
};
