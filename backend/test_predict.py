import json, requests

url = "http://localhost:8000/predict"
payload = {
    "Avg. Session Length": 30.0,
    "Time on App": 12.0,
    "Time on Website": 40.0,
    "Length of Membership": 3.0
}
headers = {"Content-Type": "application/json"}
response = requests.post(url, data=json.dumps(payload), headers=headers)
print("Status:", response.status_code)
print("Response:", response.json())
