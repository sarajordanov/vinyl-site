import { useEffect, useState } from "react";

export default function App() {
  // A box that remembers the server's answer. At first it says "checking..."
  const [status, setStatus] = useState("checking...");

  // This runs once, when the page opens
  useEffect(() => {
    fetch("/api/health")                         // ask the server
      .then((res) => res.json())                 // read its answer
      .then((data) => setStatus(data.status))    // put the answer in the box
      .catch(() => setStatus("server not reachable")); // if something fails
  }, []);

  return <h1>VINYL. Server status: {status}</h1>;
}