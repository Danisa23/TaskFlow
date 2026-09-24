/* =========================================
   TASKFLOW - APLICACIÓN DE TAREAS
   ========================================= */


/* =========================================
   CLASE TAREA
   ========================================= */

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


/* =========================================
   CLASE GESTOR DE TAREAS
   ========================================= */

class GestorTareas {

    constructor() {
        this.tareas = [];
    }

    agregarTarea(tarea) {
        this.tareas.push(tarea);
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(
            tarea => tarea.id !== id
        );
    }

    obtenerTareas() {
        return this.tareas;
    }
}


/* =========================================
   INSTANCIA DEL GESTOR
   ========================================= */

const gestor = new GestorTareas();


/* =========================================
   OBJETO Y DESTRUCTURING
   ========================================= */

const persona = {
    nombre: "Daniela",
    rol: "Estudiante"
};

const { nombre, rol } = persona;

console.log(`Usuario: ${nombre} - ${rol}`);


/* =========================================
   ARRAYS Y SPREAD OPERATOR
   ========================================= */

const numeros = [1, 2, 3];

const copia = [...numeros];

const sumar = (a, b) => a + b;

console.log("Resultado de suma:", sumar(2, 3));
console.log("Copia del array:", copia);


/* =========================================
   ELEMENTOS DEL HTML
   ========================================= */

const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const fechaInput = document.getElementById("fecha");

const btnAgregar = document.getElementById("btnAgregar");

const listaTareas = document.getElementById("listaTareas");

const btnCargarAPI = document.getElementById("btnCargarAPI");

const tareasAPI = document.getElementById("tareasAPI");


/* =========================================
   AGREGAR TAREA
   ========================================= */

btnAgregar.addEventListener("click", () => {

    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const fecha = fechaInput.value;


    /* Validación */

    if (titulo === "") {
        alert("El título de la tarea es obligatorio.");
        tituloInput.focus();
        return;
    }


    if (descripcion === "") {
        alert("La descripción es obligatoria.");
        descripcionInput.focus();
        return;
    }


    if (fecha === "") {
        alert("Debes seleccionar una fecha.");
        fechaInput.focus();
        return;
    }


    /* Crear nueva tarea */

    const nuevaTarea = new Tarea(
        Date.now(),
        titulo,
        descripcion,
        fecha
    );


    /* Agregar al gestor */

    gestor.agregarTarea(nuevaTarea);


    /* Guardar */

    guardarLocalStorage();


    /* Mostrar */

    mostrarTareas();


    /* Limpiar formulario */

    tituloInput.value = "";
    descripcionInput.value = "";
    fechaInput.value = "";


    alert("Tarea agregada correctamente.");
});


/* =========================================
   CALCULAR DÍAS RESTANTES
   ========================================= */

function diasRestantes(fecha) {

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    const limite = new Date(fecha);

    limite.setHours(0, 0, 0, 0);

    const diferencia = limite - hoy;

    return Math.ceil(
        diferencia / (1000 * 60 * 60 * 24)
    );
}


/* =========================================
   MOSTRAR TAREAS
   ========================================= */

function mostrarTareas() {

    listaTareas.innerHTML = "";


    /* Si no existen tareas */

    if (gestor.obtenerTareas().length === 0) {

        listaTareas.innerHTML = `
            <p class="sin-tareas">
                No hay tareas registradas todavía.
            </p>
        `;

        return;
    }


    /* Recorrer tareas */

    gestor.obtenerTareas().forEach(tarea => {

        const div = document.createElement("div");

        div.classList.add("task");


        const dias = diasRestantes(
            tarea.fechaCreacion
        );


        div.innerHTML = `
            <h3>${tarea.titulo}</h3>

            <p>
                ${tarea.descripcion}
            </p>

            <p>
                📅 Fecha: ${tarea.fechaCreacion}
            </p>

            <p>
                ⏰ Faltan ${dias} días
            </p>

            <p>
                Estado:
                ${tarea.estado
                    ? "✅ Completada"
                    : "⏳ Pendiente"}
            </p>

            <div class="task-buttons">

                <button
                    onclick="toggleTarea(${tarea.id})">
                    ${tarea.estado
                        ? "Marcar pendiente"
                        : "Completar tarea"}
                </button>

                <button
                    onclick="eliminarTarea(${tarea.id})">
                    Eliminar
                </button>

            </div>
        `;


        if (tarea.estado) {
            div.style.opacity = "0.65";
        }


        listaTareas.appendChild(div);

    });
}


/* =========================================
   CAMBIAR ESTADO
   ========================================= */

function toggleTarea(id) {

    const tarea = gestor.tareas.find(
        tarea => tarea.id === id
    );


    if (tarea) {

        tarea.cambiarEstado();

        guardarLocalStorage();

        mostrarTareas();

    }
}


/* =========================================
   ELIMINAR TAREA
   ========================================= */

function eliminarTarea(id) {

    const confirmar = confirm(
        "¿Deseas eliminar esta tarea?"
    );


    if (!confirmar) {
        return;
    }


    gestor.eliminarTarea(id);

    guardarLocalStorage();

    mostrarTareas();
}


/* =========================================
   LOCAL STORAGE
   ========================================= */

function guardarLocalStorage() {

    localStorage.setItem(
        "tareas",
        JSON.stringify(gestor.tareas)
    );
}


/* =========================================
   CARGAR LOCAL STORAGE
   ========================================= */

function cargarLocalStorage() {

    const datos = JSON.parse(
        localStorage.getItem("tareas")
    ) || [];


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


/* =========================================
   API
   ========================================= */

btnCargarAPI.addEventListener(
    "click",
    async () => {

        tareasAPI.innerHTML = `
            <p>Cargando tareas...</p>
        `;


        try {

            const respuesta = await fetch(
                "https://jsonplaceholder.typicode.com/todos?_limit=5"
            );


            if (!respuesta.ok) {
                throw new Error(
                    "Error al consultar la API"
                );
            }


            const tareas = await respuesta.json();


            tareasAPI.innerHTML = "";


            tareas.forEach(tarea => {

                const div = document.createElement("div");

                div.classList.add("task");


                div.innerHTML = `
                    <h3>
                        ${tarea.title}
                    </h3>

                    <p>
                        Estado:
                        ${tarea.completed
                            ? "✅ Completada"
                            : "⏳ Pendiente"}
                    </p>
                `;


                tareasAPI.appendChild(div);

            });

        } catch (error) {

            tareasAPI.innerHTML = `
                <p>
                    ❌ Error al cargar las tareas desde la API.
                </p>
            `;

            console.error(
                "Error:",
                error
            );

        }

    }
);


/* =========================================
   EVENTOS
   ========================================= */


/* Evento keyup */

tituloInput.addEventListener(
    "keyup",
    (e) => {

        console.log(
            "Escribiendo:",
            e.target.value
        );

    }
);


/* Evento mouseover */

tituloInput.addEventListener(
    "mouseover",
    () => {

        console.log(
            "Mouse sobre el campo título"
        );

    }
);


/* =========================================
   INICIAR APLICACIÓN
   ========================================= */

cargarLocalStorage();
