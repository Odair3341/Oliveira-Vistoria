// import fetch from 'node-fetch'; // Built-in in Node 22

async function run() {
  const inspectionId = 'e2352a67-d78a-49f7-852e-208f9fa02dac';
  const url = `http://localhost:3000/api/inspections`;

  console.log("2. Sending PUT request to update Origem to 'São Gabriel do Oeste'...");
  
  const body = {
    id: inspectionId,
    placa: "QJY-3266",
    origem: "São Gabriel do Oeste",
    destino: "Jardim",
    kmDeslocamento: 385,
    valorKm: 0,
    pedagio: 0,
    status: "concluida",
    dataVistoria: "2025-12-04" 
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Update Response:", JSON.stringify(data, null, 2));
    } else {
      console.log("Update Failed:", response.status, response.statusText);
      const text = await response.text();
      console.log(text);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

run();
