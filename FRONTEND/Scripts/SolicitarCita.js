// Variables globales
let appointmentForm
let modalConfirmacion
let modalError

const peruvianHolidays2025 = [
  "2025-01-01", // Año Nuevo
  "2025-04-17", // Jueves Santo
  "2025-04-18", // Viernes Santo
  "2025-05-01", // Día del Trabajador
  "2025-07-28", // Día de la Independencia
  "2025-07-29", // Día de la Independencia
  "2025-08-30", // Santa Rosa de Lima
  "2025-10-08", // Combate de Angamos
  "2025-11-01", // Todos los Santos
  "2025-12-08", // Inmaculada Concepción
  "2025-12-25", // Navidad
]

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

function validateAppointmentData(data) {
  if (!data.especialidad || !data.fechaCita || !data.horarios || !data.motivoCita.trim()) {
    return false;
  }

  // Validar que la fecha no sea en el pasado
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalizar la fecha seleccionada a UTC
  const [year, month, day] = data.fechaCita.split('-');
  const selectedDate = new Date(Date.UTC(year, month - 1, day));

  if (selectedDate < today) {
    return false;
  }

  // Validar que no sea domingo (0 = domingo)
  const dayOfWeek = selectedDate.getUTCDay();
  if (dayOfWeek === 0) {
    alert("No atendemos los domingos. Por favor, seleccione otro día.");
    return false;
  }

  // Validar que no sea feriado
  if (peruvianHolidays2025.includes(data.fechaCita)) {
    alert("No atendemos en feriados. Por favor, seleccione otro día.");
    return false;
  }

  return true;
}

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

    // Check if the selected date/time is available
    const isAvailable = checkAvailability(appointmentData.fechaCita, appointmentData.horarios)

    if (isAvailable) {
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

function checkAvailability(date, time) {
  // Crear la fecha como UTC para evitar desfase de zona horaria
  const [year, month, day] = date.split('-');
  const selectedDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = selectedDate.getUTCDay();

  // Check if it's a business day (Monday to Saturday)
  if (dayOfWeek === 0) return false; // Sunday

  // Check if it's a holiday
  if (peruvianHolidays2025.includes(date)) return false;

  // Simular 90% de disponibilidad para días válidos
  return Math.random() > 0.1;
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

function cerrarModal() {
  modalConfirmacion.style.display = "none"
  document.body.style.overflow = "auto"

  // Redirigir a la página principal
  setTimeout(() => {
    window.location.href = "index.html"
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

function updateAvailableSchedules(date) {
  const horariosSelect = document.getElementById("horarios");

  // Limpiar opciones actuales (excepto la primera)
  while (horariosSelect.children.length > 1) {
    horariosSelect.removeChild(horariosSelect.lastChild);
  }

  // Normalizar la fecha a formato YYYY-MM-DD
  let normalizedDate = date;
  if (date instanceof Date) {
    normalizedDate = date.toISOString().split("T")[0];
  }

  // Crear la fecha como UTC para evitar desfase de zona horaria
  const [year, month, day] = normalizedDate.split('-');
  const selectedDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = selectedDate.getUTCDay();

  let schedules = [];

  if (peruvianHolidays2025.includes(normalizedDate)) {
    schedules = [];
  } else if (dayOfWeek >= 1 && dayOfWeek <= 6) {
    // Lunes a sábado: horarios disponibles
    schedules = [
      { value: "8:00-8:30", text: "8:00 - 8:30 am" },
      { value: "8:30-9:00", text: "8:30 - 9:00 am" },
      { value: "9:00-9:30", text: "9:00 - 9:30 am" },
      { value: "9:30-10:00", text: "9:30 - 10:00 am" },
      { value: "10:00-10:30", text: "10:00 - 10:30 am" },
      { value: "10:30-11:00", text: "10:30 - 11:00 am" },
      { value: "11:00-11:30", text: "11:00 - 11:30 am" },
      { value: "11:30-12:00", text: "11:30 - 12:00 pm" },
      { value: "12:00-12:30", text: "12:00 - 12:30 pm" },
      { value: "12:30-13:00", text: "12:30 - 1:00 pm" },
      { value: "13:00-13:30", text: "1:00 - 1:30 pm" },
      { value: "13:30-14:00", text: "1:30 - 2:00 pm" },
      { value: "14:00-14:30", text: "2:00 - 2:30 pm" },
      { value: "14:30-15:00", text: "2:30 - 3:00 pm" },
      { value: "15:00-15:30", text: "3:00 - 3:30 pm" },
      { value: "15:30-16:00", text: "3:30 - 4:00 pm" },
      { value: "16:00-16:30", text: "4:00 - 4:30 pm" },
      { value: "16:30-17:00", text: "4:30 - 5:00 pm" },
      { value: "17:00-17:30", text: "5:00 - 5:30 pm" },
      { value: "17:30-18:00", text: "5:30 - 6:00 pm" },
    ];
  }

  // Agregar opciones al select
  schedules.forEach((schedule) => {
    const option = document.createElement("option");
    option.value = schedule.value;
    option.textContent = schedule.text;
    horariosSelect.appendChild(option);
  });

  // Mostrar mensaje si no hay horarios disponibles
  if (schedules.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    if (dayOfWeek === 0) {
      option.textContent = "No atendemos los domingos";
    } else if (peruvianHolidays2025.includes(normalizedDate)) {
      option.textContent = "No atendemos en feriados";
    } else {
      option.textContent = "No hay horarios disponibles para este día";
    }
    option.disabled = true;
    horariosSelect.appendChild(option);
  }
}