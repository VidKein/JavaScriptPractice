let runExportAplikac = document.querySelector("#runExportAplikac");
runExportAplikac.addEventListener("click", importLispPoint);

async function importLispPoint(e) {
  e.preventDefault(); // Всегда останавливаем поведение по умолчанию

  let type = document.querySelector("#firstSelectEmport").value;
  let place = document.querySelector("#secondSelectEmport").value;
  let tapeFain = document.querySelector("#tapeFailExport").value;
    console.log(type, place, tapeFain);

  if (!type || !place || !tapeFain) {
    alert("Пожалуйста, выберите все параметры");
    return;
  }

  try {
    const API_URL = 'http://localhost:4000/exportLispPoint';
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, place, tapeFain })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Ошибка сервера");
    }

    const blob = await response.blob();
    const downloadName = `${place}${tapeFain}`;
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

  } catch (error) {
    alert('Ошибка при скачивании: ' + error.message);
  }
}
