// Datos de ejemplo de resultados de laboratorio
const resultadosEjemplo = [
  {
    id: 1,
    tipoExamen: "Análisis de Sangre",
    fecha: "15/06/2025",
    estado: "disponible",
    pdfUrl: "https://www.turnerlibros.com/wp-content/uploads/2021/02/ejemplo.pdf",
  },
  {
    id: 2,
    tipoExamen: "Perfil Lipídico",
    fecha: "10/06/2025",
    estado: "disponible",
    pdfUrl: "Assets/pdfs/resultado-lipidos.pdf",
  },
  {
    id: 3,
    tipoExamen: "Hemograma Completo",
    fecha: "05/06/2025",
    estado: "disponible",
    pdfUrl: "Assets/pdfs/resultado-hemograma.pdf",
  },
  {
    id: 4,
    tipoExamen: "Glucosa en Ayunas",
    fecha: "01/06/2025",
    estado: "disponible",
    pdfUrl: "Assets/pdfs/resultado-glucosa.pdf",
  },
]

// Estado de la aplicación
let resultados = []
const isLoading = true

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Inicializando página de resultados")
  cargarResultados()
})

// Cargar resultados desde el servidor (simulado)
async function cargarResultados() {
  const loadingState = document.getElementById("loadingState")
  const resultsTable = document.getElementById("resultsTable")
  const noResultsMessage = document.getElementById("noResultsMessage")

  try {
    console.log("[v0] Cargando resultados...")

    // Mostrar estado de carga
    loadingState.style.display = "block"
    resultsTable.style.display = "none"
    noResultsMessage.style.display = "none"

    // Simular llamada al servidor
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // En producción, esto sería una llamada real al backend
    // const response = await fetch('/api/resultados');
    // resultados = await response.json();

    // Por ahora usamos datos de ejemplo
    resultados = resultadosEjemplo

    console.log("[v0] Resultados cargados:", resultados.length)

    // Ocultar estado de carga
    loadingState.style.display = "none"

    // Mostrar resultados o mensaje de vacío
    if (resultados.length > 0) {
      mostrarResultados()
      resultsTable.style.display = "block"
    } else {
      noResultsMessage.style.display = "block"
    }
  } catch (error) {
    console.error("[v0] Error al cargar resultados:", error)
    loadingState.style.display = "none"
    mostrarError(
      "Error de Conexión",
      "No se pudieron cargar los resultados. Por favor, verifique su conexión e intente nuevamente.",
    )
  }
}

// Mostrar resultados en la tabla
function mostrarResultados() {
  const tbody = document.getElementById("resultsTableBody")
  tbody.innerHTML = ""

  resultados.forEach((resultado) => {
    const row = document.createElement("tr")

    row.innerHTML = `
            <td class="exam-type">${resultado.tipoExamen}</td>
            <td class="exam-date">${resultado.fecha}</td>
            <td>
                <span class="status-badge status-${resultado.estado}">
                    ${getEstadoTexto(resultado.estado)}
                </span>
            </td>
            <td>
                <button class="btn-view" onclick="verResultado(${resultado.id})">
                    Ver Resultados
                </button>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Obtener texto del estado
function getEstadoTexto(estado) {
  const estados = {
    disponible: "Disponible",
    pendiente: "Pendiente",
    procesando: "Procesando",
  }
  return estados[estado] || estado
}

// Ver resultado específico
function verResultado(id) {
  console.log("[v0] Visualizando resultado ID:", id)

  const resultado = resultados.find((r) => r.id === id)

  if (!resultado) {
    mostrarError("Resultado No Encontrado", "No se pudo encontrar el resultado solicitado.")
    return
  }

  if (resultado.estado !== "disponible") {
    mostrarError("Resultado No Disponible", "Este resultado aún no está disponible para visualización.")
    return
  }

  // Guardar información del resultado en sessionStorage para la siguiente página
  sessionStorage.setItem("resultadoActual", JSON.stringify(resultado))

  // Redirigir a la página de visualización
  window.location.href = "visualizar-resultado.html"
}

// Mostrar modal de error
function mostrarError(titulo, mensaje) {
  const modal = document.getElementById("errorModal")
  const errorTitle = document.getElementById("errorTitle")
  const errorMessage = document.getElementById("errorMessage")

  errorTitle.textContent = titulo
  errorMessage.textContent = mensaje
  modal.style.display = "block"
}

// Cerrar modal de error y reintentar
function closeErrorModal() {
  const modal = document.getElementById("errorModal")
  modal.style.display = "none"
  cargarResultados()
}

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
  const modal = document.getElementById("errorModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}
