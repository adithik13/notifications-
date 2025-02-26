require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { MailerSend, EmailParams, Recipient } = require("mailersend");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY, // 🔥 Uses an environment variable (safer)
});

// Function to send an email notification
function sendEmailNotification(jobMessage = "HiPerGator Job Completed!") {
  const recipients = [new Recipient("patelishan@ufl.edu", "Ishan Patel")];

  const emailParams = new EmailParams()
    .setFrom("akatikhaneni@ufl.edu") // 🔥 Ensure this sender is verified in MailerSend
    .setFromName("Adithi Katikhaneni")
    .setRecipients(recipients)
    .setSubject("🚀 HiPerGator Job Completed!")
    .setHtml(`<h2>${jobMessage} 🎉</h2><p>You can check the results now.</p>`)
    .setText(`${jobMessage} - You can check the results now.`);

  mailerSend
    .send(emailParams)
    .then(() => console.log("✅ Email sent successfully!"))
    .catch((error) => console.error("❌ Email sending failed:", error));
}

// Endpoint to receive job completion notifications
app.post("/notify", (req, res) => {
  const message = req.body.message || "Job Completed!";

  console.log("📩 Job Completion Message:", message);

  // Emit WebSocket event for frontend
  io.emit("job_done", { message });

  // Send email notification
  sendEmailNotification(message);

  res.status(200).send({ success: true });
});

// 🔥 Dummy test endpoint
app.get("/test", (req, res) => {
  const testMessage = "🔥 Dummy Job Finished! (Test Mode)";

  console.log("📩 Dummy Job Notification:", testMessage);

  // Emit WebSocket event for frontend
  io.emit("job_done", { message: testMessage });

  // Send test email
  sendEmailNotification(testMessage);

  res.status(200).send({ success: true, message: testMessage });
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

server.listen(5000, () => console.log("🚀 Notification server running on port 5000"));
