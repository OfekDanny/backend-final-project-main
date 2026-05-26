"""Run the official spec test script against deployed Render URLs."""
import requests
import sys

a = "https://process-logs.onrender.com"
b = "https://process-users.onrender.com"
c = "https://process-costs.onrender.com"
d = "https://process-about.onrender.com"

print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)
print()

print("testing getting the about")
print("-------------------------")
try:
    url = d + "/api/about/"
    data = requests.get(url, timeout=60)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.text)
except Exception as e:
    print("problem", e)
print()

print("testing getting the report - 1")
print("------------------------------")
try:
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url, timeout=60)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.text)
except Exception as e:
    print("problem", e)
print()

print("testing adding cost item")
print("----------------------------------")
try:
    url = c + "/api/add/"
    data = requests.post(url, json={'userid': 123123, 'description': 'milk 9', 'category': 'food', 'sum': 8}, timeout=60)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.text)
except Exception as e:
    print("problem", e)
print()

print("testing getting the report - 2")
print("------------------------------")
try:
    url = c + "/api/report/?id=123123&year=2026&month=5"
    data = requests.get(url, timeout=60)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.text)
except Exception as e:
    print("problem", e)
print()
