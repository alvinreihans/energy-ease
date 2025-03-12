// Konfigurasi koneksi ke broker MQTT melalui WebSocket
const brokerUrl = "wss://test.mosquitto.org:8081"; // WebSocket MQTT
const topic = "energy-monitoring/data";

const client = mqtt.connect(brokerUrl);

// Saat terhubung ke broker
client.on("connect", function () {
  console.log("Terhubung ke MQTT broker");
  client.subscribe(topic, function (err) {
    if (!err) {
      console.log(`Berlangganan ke topik: ${topic}`);
    } else {
      console.error("Gagal berlangganan ke MQTT:", err);
    }
  });
});

// Saat menerima pesan MQTT
client.on("message", function (topic, message) {
  console.log(`Pesan dari ${topic}: ${message.toString()}`);

  try {
    const data = JSON.parse(message.toString());

    // Perbarui halaman pemantauan energi (index.html)
    if (document.getElementById("voltage")) {
      document.getElementById("voltage").textContent = `${data.voltage} V`;
      document.getElementById("current").textContent = `${data.current} A`;
      document.getElementById("power").textContent = `${data.power} W`;
      document.getElementById("frequency").textContent = `${data.frequency} Hz`;
      document.getElementById("energy").textContent = `${data.energy} kWh`;
    }

    // Perbarui halaman konsumsi daya (consumption.html)
    if (document.getElementById("consumption-status")) {
      let consumptionStatus = document.getElementById("consumption-status");
      let consumptionText = document.getElementById("consumption-text");
      let consumptionValue = document.getElementById("energy-consumption");

      let energyConsumption = data.energy; // Ambil data dari MQTT

      consumptionValue.textContent = `${energyConsumption} kWh/m²`;

      if (energyConsumption < 400) {
        consumptionStatus.className = "consumption-circle efficient";
        consumptionText.textContent = "EFISIEN";
      } else if (energyConsumption >= 400 && energyConsumption <= 800) {
        consumptionStatus.className = "consumption-circle normal";
        consumptionText.textContent = "NORMAL";
      } else {
        consumptionStatus.className = "consumption-circle wasteful";
        consumptionText.textContent = "BOROS";
      }
    }
  } catch (error) {
    console.error("Gagal mengurai data MQTT", error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ========================== Halaman Pemantauan Energi ==========================
  if (document.body.contains(document.getElementById("voltage"))) {
    updateEnergyMonitoring();
  }

  function updateEnergyMonitoring() {
    let voltage = 111; // Data tegangan (V)
    let current = 111; // Data arus (A)
    let power = 111; // Data daya (W)
    let frequency = 111; // Data frekuensi (Hz)
    let energy = 111; // Data energi (kWh)

    document.getElementById("voltage").textContent = voltage + " V";
    document.getElementById("current").textContent = current + " A";
    document.getElementById("power").textContent = power + " W";
    document.getElementById("frequency").textContent = frequency + " Hz";
    document.getElementById("energy").textContent = energy + " kWh";
  }

  // ========================== Halaman Konsumsi Daya ==========================
  if (document.body.contains(document.getElementById("consumption-status"))) {
    updateConsumptionStatus();
  }

  function updateConsumptionStatus() {
    let energyConsumption = 1111; // Data konsumsi energi (kWh/m²)

    let consumptionStatus = document.getElementById("consumption-status");
    let consumptionText = document.getElementById("consumption-text");
    let consumptionValue = document.getElementById("energy-consumption");

    consumptionValue.textContent = energyConsumption + " kWh / m²";

    if (energyConsumption < 500) {
      consumptionStatus.classList.add("efficient");
      consumptionText.textContent = "EFISIEN";
    } else if (energyConsumption >= 500 && energyConsumption <= 1000) {
      consumptionStatus.classList.add("normal");
      consumptionText.textContent = "NORMAL";
    } else {
      consumptionStatus.classList.add("wasteful");
      consumptionText.textContent = "BOROS";
    }
  }

  // ========================== Halaman Kontrol Perangkat IoT ==========================
  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.contains(document.getElementById("lamp-toggle"))) {
      setupControlButtons();
    }

    function setupControlButtons() {
      let lampToggle = document.getElementById("lamp-toggle");
      let acToggle = document.getElementById("ac-toggle");
      let motorToggle = document.getElementById("motor-toggle");

      [lampToggle, acToggle, motorToggle].forEach((button) => {
        button.addEventListener("click", function () {
          toggleDevice(button);
        });
      });
    }

    function toggleDevice(button) {
      if (button.classList.contains("on")) {
        button.classList.remove("on");
        button.classList.add("off");
        button.textContent = "OFF";
      } else {
        button.classList.remove("off");
        button.classList.add("on");
        button.textContent = "ON";
      }
    }
  });
});
