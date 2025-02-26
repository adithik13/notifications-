import requests
import time

SERVER_URL = "http://localhost:5000/notify"

print("Simulating job execution...")

# Simulate job processing (waiting for 5 seconds)
time.sleep(5)

# Send fake completion notification
response = requests.post(SERVER_URL, json={"message": "🧪 Test Job Completed!"})

if response.status_code == 200:
    print("✅ Test job completed notification sent successfully!")
else:
    print("❌ Failed to send notification")
