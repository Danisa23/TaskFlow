
class Tarea {
  constructor(id, titulo, descripcion, fechaCreacion) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaCreacion = fechaCreacion;
    this.estado = false;
  }

  cambiarEstado() {
    this.estado = !this.estado;
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  agregarTarea(tarea) {
    this.tareas.push(tarea);
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
  }

  obtenerTareas() {
    return this.tareas;
  }
}

const gestor = new GestorTareas();
const persona = {
  nombre: "Daniela",
  rol: "Estudiante"
};

const { nombre, rol } = persona;

console.log(`Usuario: ${nombre} - ${rol}`);

const numeros = [1, 2, 3];
const copia = [...numeros];

const sumar = (a, b) => a + b;

console.log(sumar(2, 3));
console.log(copia);
const formulario = document.getElementById("formTarea");
const lista = document.getElementById("listaTareas");
const notificacion = document.getElementById("notificacion");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const fecha = document.getElementById("fecha").value;

  // Validación
  if (titulo.trim() === "") {
    alert("El título es obligatorio");
    return;
  }

  const nuevaTarea = new Tarea(
    Date.now(),
    titulo,
    descripcion,
    fecha
  );

  gestor.agregarTarea(nuevaTarea);

  guardarLocalStorage();
  mostrarTareas();

  mostrarNotificacion("Tarea agregada correctamente");

  formulario.reset();
});
function diasRestantes(fecha) {
  const hoy = new Date();
  const limite = new Date(fecha);

  const diferencia = limite - hoy;

  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

function mostrarTareas() {
  lista.innerHTML = "";

  gestor.obtenerTareas().forEach((tarea) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${tarea.titulo}</strong><br>
      ${tarea.descripcion}<br>
      📅 ${tarea.fechaCreacion}<br>
      ⏰ Faltan ${diasRestantes(tarea.fechaCreacion)} días<br>
      Estado: ${tarea.estado ? "✅ Completada" : "⏳ Pendiente"}
      <br><br>
      <button onclick="toggleTarea(${tarea.id})">Cambiar estado</button>
      <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
    `;

    if (tarea.estado) {
      li.classList.add("completada");
    }

    lista.appendChild(li);
  });
}

function toggleTarea(id) {
  const tarea = gestor.tareas.find(t => t.id === id);

  if (tarea) {
    tarea.cambiarEstado();
    guardarLocalStorage();
    mostrarTareas();
  }
}

function eliminarTarea(id) {
  gestor.eliminarTarea(id);
  guardarLocalStorage();
  mostrarTareas();
}

function mostrarNotificacion(mensaje) {
  setTimeout(() => {
    notificacion.textContent = mensaje;

    setTimeout(() => {
      notificacion.textContent = "";
    }, 3000);

  }, 2000);
}

function guardarLocalStorage() {
  localStorage.setItem(
    "tareas",
    JSON.stringify(gestor.tareas)
  );
}

function cargarLocalStorage() {
  const datos = JSON.parse(localStorage.getItem("tareas")) || [];

  datos.forEach(t => {
    const tarea = new Tarea(
      t.id,
      t.titulo,
      t.descripcion,
      t.fechaCreacion
    );

    tarea.estado = t.estado;

    gestor.agregarTarea(tarea);
  });

  mostrarTareas();
}

cargarLocalStorage();

const btnApi = document.getElementById("btnApi");
const listaApi = document.getElementById("listaApi");

btnApi.addEventListener("click", async () => {

  listaApi.innerHTML = "Cargando...";

  try {

    const respuesta = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );

    const tareasApi = await respuesta.json();

    listaApi.innerHTML = "";

    tareasApi.forEach(t => {

      const li = document.createElement("li");

      li.textContent =
        `${t.title} - ${t.completed ? "Completada" : "Pendiente"}`;

      listaApi.appendChild(li);
    });

  } catch (error) {

    listaApi.innerHTML = "Error al cargar tareas";

    console.error(error);
  }
});

document.getElementById("titulo").addEventListener("keyup", (e) => {
  console.log("Escribiendo:", e.target.value);
});

document.getElementById("titulo").addEventListener("mouseover", () => {
  console.log("Mouse sobre el título");
});