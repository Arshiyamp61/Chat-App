

const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, it's working");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on('joined', ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);

    // Safely emit 'userJoined' event
    io.emit('userJoined', {
      user: "Admin",
      message: `${users[socket.id]} has joined`
    });
  });

  // Safely emit 'welcome' event
  socket.emit('welcome', {
    user: "Admin",
    message: `Welcome to the Chat, ${users[socket.id] || 'User'}`
    // Use 'User' as a default if the user is undefined
  });
  socket.on('message',({message,id})=>{
io.emit('sendMessage',{user:users[id],message,id})
  })

  // Handle disconnect event
  socket.on('disconnect', () => {
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
    console.log(`${users[socket.id]} left`);
    // Clean up user data on disconnect
   
  });
});

server.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
