// Variables globales
let appointmentForm
let modalConfirmacion
let modalError

// Inicialización cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  appointmentForm = document.getElementById("appointment-form")
  modalConfirmacion = document.getElementById("modal-confirmacion")
  modalError = document.getElementById("modal-error")

  // Configurar fecha mínima (hoy)
  const fechaCita = document.getElementById("fecha-cita")
  const today = new Date().toISOString().split("T")[0]
  fechaCita.min = today

  // Event listener para el formulario
  appointmentForm.addEventListener("submit", handleFormSubmit)

  // Event listeners para cerrar modales al hacer clic fuera
  modalConfirmacion.addEventListener("click", (e) => {
    if (e.target === modalConfirmacion) {
      cerrarModal()
    }
  })

  modalError.addEventListener("click", (e) => {
    if (e.target === modalError) {
      cerrarModalError()
    }
  })
})

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault()

  // Obtener datos del formulario
  const formData = new FormData(appointmentForm)
  const appointmentData = {
    especialidad: formData.get("especialidad"),
    fechaCita: formData.get("fecha-cita"),
    horarios: formData.get("horarios"),
    motivoCita: formData.get("motivo-cita"),
  }

  // Validar datos
  if (!validateAppointmentData(appointmentData)) {
    return
  }

  // Simular envío al servidor
  submitAppointment(appointmentData)
}

// Validar datos de la cita
function validateAppointmentData(data) {
  if (!data.especialidad || !data.fechaCita || !data.horarios || !data.motivoCita.trim()) {
    alert("Por favor, complete todos los campos requeridos.")
    return false
  }

  // Validar que la fecha no sea en el pasado
  const selectedDate = new Date(data.fechaCita)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    alert("La fecha de la cita no puede ser anterior a hoy.")
    return false
  }

  return true
}

// Simular envío de cita al servidor
function submitAppointment(appointmentData) {
  // Mostrar loading (opcional)
  const submitBtn = document.querySelector(".btn-solicitar")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Enviando..."
  submitBtn.disabled = true

  // Simular llamada al servidor
  setTimeout(() => {
    // Restaurar botón
    submitBtn.textContent = originalText
    submitBtn.disabled = false

    // Simular respuesta del servidor (80% éxito, 20% error)
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
      // Simular envío de correo y mostrar modal de éxito
      console.log("Cita solicitada exitosamente:", appointmentData)
      mostrarModalConfirmacion()

      // Limpiar formulario
      appointmentForm.reset()
    } else {
      // Mostrar modal de error (horario no disponible)
      console.log("Error: Horario no disponible")
      mostrarModalError()
    }
  }, 1500)
}

// Mostrar modal de confirmación
function mostrarModalConfirmacion() {
  modalConfirmacion.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Mostrar modal de error
function mostrarModalError() {
  modalError.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Cerrar modal de confirmación
function cerrarModal() {
  modalConfirmacion.style.display = "none"
  document.body.style.overflow = "auto"

  // Redirigir a la página principal o dashboard del usuario
  setTimeout(() => {
    window.location.href = "user.html"
  }, 500)
}

// Cerrar modal de error
function cerrarModalError() {
  modalError.style.display = "none"
  document.body.style.overflow = "auto"
}

// Ver horarios disponibles (desde modal de error)
function verHorarios() {
  cerrarModalError()

  // Enfocar el campo de horarios
  const horariosSelect = document.getElementById("horarios")
  horariosSelect.focus()
  horariosSelect.scrollIntoView({ behavior: "smooth", block: "center" })

  // Opcional: Resaltar el campo temporalmente
  horariosSelect.style.borderColor = "#F44336"
  setTimeout(() => {
    horariosSelect.style.borderColor = ""
  }, 3000)
}

// Función para actualizar horarios disponibles según la fecha seleccionada
document.getElementById("fecha-cita").addEventListener("change", function () {
  const selectedDate = this.value
  const horariosSelect = document.getElementById("horarios")

  // Aquí se podría hacer una llamada al servidor para obtener horarios disponibles
  // Por ahora, simulamos la actualización de horarios
  console.log("Fecha seleccionada:", selectedDate)

  // Ejemplo de actualización dinámica de horarios
  // En una implementación real, esto vendría del servidor
  updateAvailableSchedules(selectedDate)
})

// Actualizar horarios disponibles
function updateAvailableSchedules(date) {
  const horariosSelect = document.getElementById("horarios")
  const dayOfWeek = new Date(date).getDay()

  // Limpiar opciones actuales (excepto la primera)
  while (horariosSelect.children.length > 1) {
    horariosSelect.removeChild(horariosSelect.lastChild)
  }

  // Horarios base
  let schedules = []

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Lunes a Viernes
    schedules = [
      { value: "8:00-9:30", text: "8:00 - 9:30 am" },
      { value: "10:30-11:00", text: "10:30 - 11:00 am" },
      { value: "12:00-1:00", text: "12:00 - 1:00 pm" },
      { value: "2:00-3:30", text: "2:00 - 3:30 pm" },
      { value: "4:00-5:30", text: "4:00 - 5:30 pm" },
    ]
  } else if (dayOfWeek === 6) {
    // Sábado
    schedules = [
      { value: "8:00-9:30", text: "8:00 - 9:30 am" },
      { value: "10:30-11:00", text: "10:30 - 11:00 am" },
      { value: "12:00-1:00", text: "12:00 - 1:00 pm" },
    ]
  }
  // Domingo no hay horarios disponibles

  // Agregar opciones al select
  schedules.forEach((schedule) => {
    const option = document.createElement("option")
    option.value = schedule.value
    option.textContent = schedule.text
    horariosSelect.appendChild(option)
  })

  // Mostrar mensaje si no hay horarios disponibles
  if (schedules.length === 0) {
    const option = document.createElement("option")
    option.value = ""
    option.textContent = "No hay horarios disponibles para este día"
    option.disabled = true
    horariosSelect.appendChild(option)
  }
}
