import subprocess
import time
import requests

# Your username on the HPC system
USERNAME = "patelish"

# Backend server URL
NOTIFICATION_URL = "http://localhost:5000/notify"

def is_job_running():
    """Check if there are any running jobs for the user in SLURM."""
    try:
        # Run `squeue -u <username>` to check active jobs
        result = subprocess.run(["squeue", "-u", USERNAME], capture_output=True, text=True)
        return len(result.stdout.strip().split("\n")) > 1  # More than just the header row
    except Exception as e:
        print(f"❌ Error checking job status: {e}")
        return False

def send_notification():
    """Send a notification to the backend when job completes."""
    message = f"HiPerGator Jobs for {USERNAME} have completed!"
    try:
        response = requests.post(NOTIFICATION_URL, json={"message": message})
        if response.status_code == 200:
            print("✅ Notification sent successfully!")
        else:
            print(f"❌ Failed to send notification: {response.text}")
    except Exception as e:
        print(f"❌ Error sending notification: {e}")

# 🔄 Poll every 30 seconds until jobs are finished
print(f"🔍 Monitoring SLURM jobs for {USERNAME}...")
while is_job_running():
    print("⏳ Jobs are still running... checking again in 30 seconds")
    time.sleep(30)

print("✅ All jobs completed! Sending notification...")
send_notification()
