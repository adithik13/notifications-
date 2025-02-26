const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const {MailerSend, EmailParams, Recipient} = require('mailersend');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());


const mailerSend = new MailerSend({
  apiKey: 'mailersend-api-key',
});

function sendEmailNotification() {
  const recipients = [new Recipient('patelishan@ufl.edu', 'Ishan Patel')];
  const emailParams = new EmailParams()
    .setFrom('akatikhaneni@ufl.edu')
    .setFromName('Adithi Katikhaneni')
    .setRecipients(recipients) 
    .setSubject('HiPerGator Job Completed!')
    setHtml('Your job has completed successfully!')
    .setText('Your job has completed successfully!');
  mailerSend.send(emailParams)
  .then(() => {console.log('Email sent successfully!');})
  .catch(error => {console.error('Email sending failed:', error);});
}


// Endpoint to receive job completion notifications
app.post('/notify', (req, res) => {
  const message = req.body.message || 'Job Completed!';
  // emit the websocket event for frontend 
  io.emit('job_done', { message });
  console.log('Notification sent:', message);

sendEmailNotification(message);
res.status(200).send({ success: true });
});

// 🔥 DUMMY TEST ENDPOINT
app.get('/test', (req, res) => {
  const testMessage = '🔥 Dummy Job Finished! (Test Mode)';
  // emit websocket event for frontend
  io.emit('job_done', { message: testMessage });
  console.log('Dummy Notification Sent:', testMessage);
  //send  email notification
  sendEmailNotification(testMessage);
  // set status and message
  res.status(200).send({ success: true, message: testMessage });
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(5000, () =>
  console.log('Notification server running on port 5000')
);

