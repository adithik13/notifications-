require("dotenv").config(); // load environment variables from .env file
const express = require("express"); // web framework to handle htp requests
const cors = require("cors"); // enables cross origin resource sharing
const http = require("http"); // enables http server
const { Server } = require("socket.io"); // enables websocket server
const postmark = require("postmark"); // Postmark email client

const app = express(); // create express app
const server = http.createServer(app); // create http server, needed for websockets
const io = new Server(server, { cors: { origin: "*" } }); // create websocket server, allow connections from any origin

app.use(cors()); // allows frontend to connect to backend
app.use(express.json()); // parse incoming request body as JSON

// initialize the Postmark client
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// function to send an email to ishan using Postmark
function sendEmailNotification(jobMessage = "HiPerGator Job Completed!") {
  postmarkClient.sendEmail({
    From: process.env.POSTMARK_SENDER_EMAIL, // verified Postmark email address 
    To: "patelishan@ufl.edu", // verified recipient email (must be @ufl.edu in test mode)
    Subject:  "HiPerGator Job Completed! Woohoo!", 
    HtmlBody: `<h2>${jobMessage} 🎉</h2><p>You can check the results now.</p>`,
    TextBody: `${jobMessage} - You can check the results now.`,
    MessageStream: "outbound"
  })
  .then(() => console.log("Email sent successfully via Postmark!"))
  .catch(error => console.error("Email sending failed:", error));
}

// endpoint to receive job completion notifications
app.post("/notify", (req, res) => { // POST request to /notify
  const message = req.body.message || "Job Completed!"; // get message from request body
  console.log("📩 Job Completion Message:", message); // log message to console 

  io.emit("job_done", { message }); // emit message to all connected clients

  sendEmailNotification(message); // call the function here to actually send it 

  res.status(200).send({ success: true });
});

// Dummy test endpoint
app.get("/test", (req, res) => { // GET request to /test
  const testMessage = "Dummy Job Finished! (Test Mode)"; // dummy message
  console.log("Dummy Job Notification:", testMessage); // log dummy message to console

  io.emit("job_done", { message: testMessage }); // emit dummy message to all connected clients

  sendEmailNotification(testMessage); // call the function here to actually send it

  res.status(200).send({ success: true, message: testMessage });  // send success response
});

io.on("connection", (socket) => { // when a client connects
  console.log("Client connected"); // log to console
});

server.listen(5000, () => console.log("Notification server running on port 5000")); // start server on port 5000
