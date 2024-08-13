// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const axios = require('axios');
// const cors = require('cors');
// const https = require('https');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:5173', // Your frontend origin
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   },
// });
// const port = 5000;

// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend origin
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true,
// }));

// const miniserverConfig = {
//   ip: '192.168.1.1', // Ensure this IP is correct for your setup
//   port: 443,
//   username: 'admin',
//   password: 'Modo@2023',
// };

// // Custom axios instance to ignore SSL warnings (useful for self-signed certificates)
// const axiosInstance = axios.create({
//   httpsAgent: new https.Agent({ rejectUnauthorized: false }),
// });

// // Function to get the authentication token
// const getAuthToken = async () => {
//   try {
//     const url = `https://${miniserverConfig.ip}:${miniserverConfig.port}/jdev/sys/getkey`;
//     const response = await axiosInstance.get(url, {
//       auth: {
//         username: miniserverConfig.username,
//         password: miniserverConfig.password,
//       },
//     });
//     console.log('Full response:', response.data); // Log the full response
//     if (response.data && response.data.LL && response.data.LL.value) {
//       const authToken = response.data.LL.value;
//       console.log('Received auth token:', authToken);
//       return authToken;
//     } else {
//       throw new Error('Unexpected response structure: ' + JSON.stringify(response.data));
//     }
//   } catch (error) {
//     console.error('Error getting auth token:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// // Function to toggle the light
// const toggleLight = async (authToken) => {
//   try {
//     const command = 'jdev/sps/io/LightControl/Toggle'; // Replace with correct command path
//     const toggleUrl = `https://${miniserverConfig.ip}:${miniserverConfig.port}/${command}?token=${authToken}`;
//     const response = await axiosInstance.get(toggleUrl);
//     console.log('Toggle light response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error toggling light:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// // Function to get the status of a device
// const getStatus = async (authToken) => {
//   try {
//     const command = 'jdev/sps/io/YourDeviceStatus'; // Replace with correct command path
//     const statusUrl = `https://${miniserverConfig.ip}:${miniserverConfig.port}/${command}?token=${authToken}`;
//     const response = await axiosInstance.get(statusUrl);
//     console.log('Device status response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error getting device status:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Handle toggle light command from the client
//   socket.on('toggleLight', async () => {
//     console.log('Received toggleLight event');
//     try {
//       const authToken = await getAuthToken();
//       const result = await toggleLight(authToken);
//       socket.emit('lightStatus', { message: 'Light toggled successfully', result });
//     } catch (error) {
//       console.error('Error in toggleLight:', error);
//       socket.emit('error', { error: 'Failed to toggle light' });
//     }
//   });

//   // Handle request for device status
//   socket.on('getDeviceStatus', async () => {
//     console.log('Received getDeviceStatus event');
//     try {
//       const authToken = await getAuthToken();
//       const result = await getStatus(authToken);
//       socket.emit('deviceStatus', { message: 'Device status retrieved successfully', result });
//     } catch (error) {
//       console.error('Error in getDeviceStatus:', error);
//       socket.emit('error', { error: 'Failed to retrieve device status' });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start server
// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});
const port = 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

const miniserverConfig = {
  ip: '192.168.1.1', // Ensure this IP is correct for your setup
  port: 443,
  username: 'admin',
  password: 'Modo@2023',
};

// Custom axios instance to ignore SSL warnings (useful for self-signed certificates)
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

// Function to get the authentication token
const getAuthToken = async () => {
  try {
    const url = `https://${miniserverConfig.ip}:${miniserverConfig.port}/jdev/sys/getkey`;
    const response = await axiosInstance.get(url, {
      auth: {
        username: miniserverConfig.username,
        password: miniserverConfig.password,
      },
    });
    console.log('Full response:', response.data); // Log the full response
    if (response.data && response.data.LL && response.data.LL.value) {
      const authToken = response.data.LL.value;
      console.log('Received auth token:', authToken);
      return authToken;
    } else {
      throw new Error('Unexpected response structure: ' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('Error getting auth token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to toggle the light
const toggleLight = async (authToken) => {
  try {
    const command = 'jdev/sps/io/LightControl/Toggle'; // Replace with correct command path
    const toggleUrl = `https://${miniserverConfig.ip}:${miniserverConfig.port}/${command}?token=${authToken}`;
    const response = await axiosInstance.get(toggleUrl);
    console.log('Toggle light response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error toggling light:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to get the status of a device
const getStatus = async (authToken) => {
  try {
    const command = 'jdev/sps/io/YourDeviceStatus'; // Replace with correct command path
    const statusUrl = `https://${miniserverConfig.ip}:${miniserverConfig.port}/${command}?token=${authToken}`;
    const response = await axiosInstance.get(statusUrl);
    console.log('Device status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting device status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle toggle light command from the client
  socket.on('toggleLight', async () => {
    console.log('Received toggleLight event');
    try {
      const authToken = await getAuthToken();
      const result = await toggleLight(authToken);
      socket.emit('lightStatus', { message: 'Light toggled successfully', result });
    } catch (error) {
      console.error('Error in toggleLight:', error);
      socket.emit('error', { error: 'Failed to toggle light' });
    }
  });

  // Handle request for device status
  socket.on('getDeviceStatus', async () => {
    console.log('Received getDeviceStatus event');
    try {
      const authToken = await getAuthToken();
      const result = await getStatus(authToken);
      socket.emit('deviceStatus', { message: 'Device status retrieved successfully', result });
    } catch (error) {
      console.error('Error in getDeviceStatus:', error);
      socket.emit('error', { error: 'Failed to retrieve device status' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
