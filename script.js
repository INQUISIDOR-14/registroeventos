// --- Variables de Elementos del HTML ---
const seccionBienvenida = document.getElementById('seccionBienvenida');
const seccionPrincipal = document.getElementById('seccionPrincipal');
const nombreEventoInput = document.getElementById('nombreEventoInput');
const btnComenzar = document.getElementById('btnComenzar');
const tituloEvento = document.getElementById('tituloEvento');
// --- Protección Anti-Recarga (NUEVO) ---
window.addEventListener('beforeunload', function (e) {
    // Si ya se ha comenzado un registro (es decir, ya hay un nombre de evento),
    // activa la advertencia para prevenir una recarga accidental.
    if (registroActual.nombreEvento) {
        // Previene la acción por defecto (estándar moderno).
        e.preventDefault();
        // Necesario para compatibilidad con navegadores más antiguos.
        e.returnValue = '';
    }
});
const secciones = {
    tipo: document.getElementById('seleccionTipo'),
    genero: document.getElementById('seleccionGenero'),
    edad: document.getElementById('seleccionEdad')
};
const counter = document.getElementById('counter');
const modalOverlay = document.getElementById('modal-overlay');
const modalText = document.getElementById('modal-text');

// --- URL de tu Aplicación Web de Google (¡PÉGALA AQUÍ!) ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJvSDpNgEYmtaK5TH_asI6Ry6L40r_hFaDZfTdzduXgaylHei92UjuxtUBnaMP4XgZ/exec";

// Objeto para guardar las selecciones del usuario
let registroActual = {};
let contadorSesion = 0;

// --- Lógica de Inicio ---
btnComenzar.addEventListener('click', () => {
    const nombreEvento = nombreEventoInput.value.trim();
    if (nombreEvento === "") {
        alert("Por favor, escribe un nombre para el evento.");
        return;
    }
    
    registroActual.nombreEvento = nombreEvento;
    tituloEvento.textContent = nombreEvento;

    seccionBienvenida.style.display = 'none';
    seccionPrincipal.style.display = 'block';
    mostrarSeccion('tipo');
});

// --- Funciones de Navegación ---
function mostrarSeccion(nombreSeccion) {
    Object.values(secciones).forEach(seccion => {
        seccion.style.display = 'none';
    });
    secciones[nombreSeccion].style.display = 'block';
}

// --- Lógica de los Botones ---
secciones.tipo.querySelectorAll('button').forEach(boton => {
    boton.addEventListener('click', () => {
        registroActual.tipo = boton.dataset.valor;
        mostrarSeccion('genero');
    });
});

secciones.genero.querySelectorAll('.botones-seleccion button').forEach(boton => {
    boton.addEventListener('click', () => {
        registroActual.genero = boton.dataset.valor;
        mostrarSeccion('edad');
    });
});

secciones.edad.querySelectorAll('.botones-seleccion button').forEach(boton => {
    boton.addEventListener('click', () => {
        registroActual.edad = boton.dataset.valor;
        enviarDatos();
    });
});

document.querySelectorAll('.btn-volver').forEach(boton => {
    boton.addEventListener('click', () => {
        const pasoAnterior = boton.dataset.pasoAnterior.replace('seleccion', '').toLowerCase();
        mostrarSeccion(pasoAnterior);
    });
});

// --- Función de Envío de Datos ---
function enviarDatos() {
    modalText.textContent = 'Registrando en la nube...';
    modalOverlay.classList.add('visible');

    const datosParaEnviar = {
        nombre_evento: registroActual.nombreEvento,
        tipo_asistente: registroActual.tipo,
        genero: registroActual.genero,
        rango_edad: registroActual.edad
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar)
    })
    .then(() => {
        modalText.textContent = '✅ Registro Guardado';
        contadorSesion++;
        counter.textContent = contadorSesion;
    })
    .catch(error => {
        modalText.textContent = '❌ Error de Red';
        console.error('Error:', error);
    })
    .finally(() => {
        setTimeout(() => {
            modalOverlay.classList.remove('visible');
            // Limpiamos solo los datos del asistente, no el nombre del evento
            delete registroActual.tipo;
            delete registroActual.genero;
            delete registroActual.edad;
            mostrarSeccion('tipo');
        }, 1500); 
    });
}