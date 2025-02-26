import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    // Request permission for system notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    socket.on('job_done', (data) => {
      // Show system notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('Job Completed!', {
          body: data.message,
          icon: '/icon.png', // Optional: add a custom icon
        });
      } else {
        // Fallback to React Toast if permission denied
        toast.success(data.message);
      }
    });

    return () => socket.off('job_done');
  }, []);

  return (
    <div>
      <h1>HiPerGator Job Monitor</h1>
      <p>Waiting for job completion...</p>
      <ToastContainer position='top-right' autoClose={5000} />
    </div>
  );
}

export default App;
