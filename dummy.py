import paho.mqtt.client as mqtt
import time
import json
import random

# Konfigurasi broker MQTT (gunakan broker publik Mosquitto)
BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "energy-monitoring/data"

# Fungsi untuk mengirim data dummy
def publish_data():
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)

    while True:
        data = {
            "voltage": round(random.uniform(210, 230), 2),
            "current": round(random.uniform(0.5, 5.0), 2),
            "power": round(random.uniform(100, 500), 2),
            "frequency": round(random.uniform(49.5, 50.5), 2),
            "energy": round(random.uniform(10, 1000), 2)
        }

        json_data = json.dumps(data)
        client.publish(TOPIC, json_data)
        print(f"Published: {json_data}")

        time.sleep(1)  # Kirim data setiap 2 detik

# Jalankan publisher
if __name__ == "__main__":
    publish_data()
