import { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';

// Define the type for your custom events
interface ServerToClientEvents {
  lightStatus: (data: any) => void;
  deviceStatus: (data: any) => void;
  error: (data: any) => void;
}

interface ClientToServerEvents {
  toggleLight: () => void;
  getDeviceStatus: () => void;
}

// Initialize the Socket.IO client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

function App() {
  const [lightStatus, setLightStatus] = useState<string>('Unknown');
  const [deviceStatus, setDeviceStatus] = useState<string>('Unknown');

  useEffect(() => {
    // Listen for light status updates from the server
    socket.on('lightStatus', (data: any) => {
      console.log('Light status received:', data);
      setLightStatus(data.message);
    });

    // Listen for device status updates from the server
    socket.on('deviceStatus', (data: any) => {
      console.log('Device status received:', data);
      setDeviceStatus(JSON.stringify(data.result)); // Adjust this according to your status structure
    });

    // Listen for error messages from the server
    socket.on('error', (data: any) => {
      console.error('Socket error:', data.error);
    });

    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Handle reconnection attempts
    socket.on('reconnect_attempt', (attempt: any) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    socket.on('reconnect', (attempt: any) => {
      console.log(`Reconnected successfully after ${attempt} attempts`);
    });

    socket.on('reconnect_error', (error: any) => {
      console.error('Reconnection error:', error);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Emit toggle light event to the server
  const handleToggleLight = () => {
    console.log('Emitting toggleLight event');
    socket.emit('toggleLight');
  };

  // Request device status from the server
  const handleGetDeviceStatus = () => {
    console.log('Emitting getDeviceStatus event');
    socket.emit('getDeviceStatus');
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Loxone Light Control
      </Typography>
      <Button variant="contained" color="primary" onClick={handleToggleLight}>
        Toggle Light
      </Button>
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Light Status: {lightStatus}
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleGetDeviceStatus} style={{ marginTop: '20px' }}>
        Get Device Status
      </Button>
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Device Status: {deviceStatus}
      </Typography>
    </Container>
  );
}

export default App;
