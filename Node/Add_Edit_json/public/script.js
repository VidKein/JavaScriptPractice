// ➕ Добавление данных
async function addData() {
  const id = document.getElementById('id').value.trim();
  const positionX = document.getElementById('positionX').value.trim();
  const positionY = document.getElementById('positionY').value.trim();
  const vycka = document.getElementById('vycka').value;
  const date = document.getElementById('date').value;
  const systemCoordinates = document.getElementById('systemCoordinates').value.trim();
  const positionType = document.getElementById('positionType').value.trim();

  const response = await fetch('/api/data/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, positionX, positionY, vycka, date, systemCoordinates, positionType })
  });

  const result = await response.json();
  document.getElementById('response').innerText = result.message || result.error;

  systemCoordinates.value="";
  positionType.value="";
}

// ✏️ Редактирование данных
async function editData() {
  const id = document.getElementById('id').value.trim();
  const positionX = document.getElementById('positionX').value.trim();
  const positionY = document.getElementById('positionY').value.trim();
  const vycka = document.getElementById('vycka').value;
  const date = document.getElementById('date').value;
  const systemCoordinates = document.getElementById('systemCoordinates').value.trim();
  const positionType = document.getElementById('positionType').value.trim();

  const response = await fetch(`/api/data/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ positionX, positionY, vycka, date, systemCoordinates, positionType })
  });

  const result = await response.json();
  document.getElementById('response').innerText = result.message || result.error;

  systemCoordinates.value="";
  positionType.value="";
}

// 🗑️ Удаление данных
async function deleteData() {
  const id = document.getElementById('id').value.trim();

  const response = await fetch(`/api/data/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();
  document.getElementById('response').innerText = result.message || result.error;

  systemCoordinates.value="";
  positionType.value="";
}
