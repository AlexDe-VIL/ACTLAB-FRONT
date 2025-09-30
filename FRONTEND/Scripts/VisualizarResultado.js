// Estado de la aplicación
let resultadoActual = null

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Inicializando visualizador de resultados")
  cargarResultado()
})

// Cargar resultado desde sessionStorage
function cargarResultado() {
  const pdfLoading = document.getElementById("pdfLoading")
  const pdfError = document.getElementById("pdfError")
  const pdfViewerContainer = document.getElementById("pdfViewerContainer")

  try {
    // Obtener datos del resultado desde sessionStorage
    const resultadoData = sessionStorage.getItem("resultadoActual")

    if (!resultadoData) {
      throw new Error("No se encontró información del resultado")
    }

    resultadoActual = JSON.parse(resultadoData)
    console.log("[v0] Resultado cargado:", resultadoActual)

    // Simular carga del PDF
    setTimeout(() => {
      cargarPDF(resultadoActual.pdfUrl)
    }, 1000)
  } catch (error) {
    console.error("[v0] Error al cargar resultado:", error)
    pdfLoading.style.display = "none"
    pdfError.style.display = "block"
    document.getElementById("pdfErrorMessage").textContent =
      "No se pudo cargar la información del resultado. Por favor, regrese a la lista de resultados e intente nuevamente."
  }
}

// Cargar PDF en el visor
function cargarPDF(pdfUrl) {
  const pdfLoading = document.getElementById("pdfLoading")
  const pdfError = document.getElementById("pdfError")
  const pdfViewerContainer = document.getElementById("pdfViewerContainer")
  const pdfViewer = document.getElementById("pdfViewer")

  try {
    console.log("[v0] Cargando PDF:", pdfUrl)

    // En producción, aquí se cargaría el PDF real
    // Por ahora, usamos un PDF de ejemplo o Google Docs Viewer

    // Opción 1: Si tienes un PDF real en la carpeta Assets/pdfs/
    // pdfViewer.src = pdfUrl;

    // Opción 2: Usar Google Docs Viewer (para PDFs externos)
    // pdfViewer.src = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

    // Opción 3: PDF de ejemplo (para demostración)
    // Usamos un PDF de muestra de laboratorio
    pdfViewer.src = pdfUrl

    // Manejar carga exitosa
    pdfViewer.onload = () => {
      console.log("[v0] PDF cargado exitosamente")
      pdfLoading.style.display = "none"
      pdfViewerContainer.style.display = "block"
    }

    // Manejar error de carga
    pdfViewer.onerror = () => {
      console.error("[v0] Error al cargar el PDF")
      pdfLoading.style.display = "none"
      pdfError.style.display = "block"
      document.getElementById("pdfErrorMessage").textContent =
        "El documento no se pudo cargar. El archivo puede estar dañado o no disponible."
    }
  } catch (error) {
    console.error("[v0] Error al configurar visor PDF:", error)
    pdfLoading.style.display = "none"
    pdfError.style.display = "block"
  }
}

// Reintentar carga del PDF
function retryLoadPDF() {
  const pdfError = document.getElementById("pdfError")
  const pdfLoading = document.getElementById("pdfLoading")

  pdfError.style.display = "none"
  pdfLoading.style.display = "block"

  if (resultadoActual) {
    setTimeout(() => {
      cargarPDF(resultadoActual.pdfUrl)
    }, 500)
  } else {
    cargarResultado()
  }
}

// Descargar PDF
function downloadPDF() {
  if (!resultadoActual) {
    mostrarInfo("Error", "No se puede descargar el documento en este momento.")
    return
  }

  console.log("[v0] Descargando PDF:", resultadoActual.pdfUrl)

  // En producción, esto descargaría el PDF real
  // const link = document.createElement('a');
  // link.href = resultadoActual.pdfUrl;
  // link.download = `Resultado_${resultadoActual.tipoExamen}_${resultadoActual.fecha}.pdf`;
  // link.click();

  mostrarInfo("Descarga Iniciada", "El documento se está descargando. Por favor, revise su carpeta de descargas.")
}

// Imprimir PDF
function printPDF() {
  if (!resultadoActual) {
    mostrarInfo("Error", "No se puede imprimir el documento en este momento.")
    return
  }

  console.log("[v0] Imprimiendo PDF")

  // Intentar imprimir el iframe
  const pdfViewer = document.getElementById("pdfViewer")

  try {
    pdfViewer.contentWindow.print()
  } catch (error) {
    console.error("[v0] Error al imprimir:", error)
    mostrarInfo("Imprimir", "Por favor, descargue el documento y ábralo para imprimirlo.")
  }
}

// Mostrar modal de información
function mostrarInfo(titulo, mensaje) {
  const modal = document.getElementById("infoModal")
  const infoTitle = document.getElementById("infoTitle")
  const infoMessage = document.getElementById("infoMessage")

  infoTitle.textContent = titulo
  infoMessage.textContent = mensaje
  modal.style.display = "block"
}

// Cerrar modal de información
function closeInfoModal() {
  const modal = document.getElementById("infoModal")
  modal.style.display = "none"
}

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
  const infoModal = document.getElementById("infoModal")
  if (event.target === infoModal) {
    infoModal.style.display = "none"
  }
}
