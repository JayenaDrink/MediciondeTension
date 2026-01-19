// Almacenamiento de datos en localStorage
const STORAGE_KEY = 'mediciones_tension';

// Función para obtener todas las mediciones
function obtenerMediciones() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : {};
}

// Función para guardar todas las mediciones
function guardarMediciones(mediciones) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mediciones));
}

// Función para calcular promedios
function calcularPromedios() {
    const toma1Maxima = parseFloat(document.getElementById('toma1-maxima').value) || 0;
    const toma1Minima = parseFloat(document.getElementById('toma1-minima').value) || 0;
    const toma1Pulso = parseFloat(document.getElementById('toma1-pulso').value) || 0;

    const toma2Maxima = parseFloat(document.getElementById('toma2-maxima').value) || 0;
    const toma2Minima = parseFloat(document.getElementById('toma2-minima').value) || 0;
    const toma2Pulso = parseFloat(document.getElementById('toma2-pulso').value) || 0;

    const toma3Maxima = parseFloat(document.getElementById('toma3-maxima').value) || 0;
    const toma3Minima = parseFloat(document.getElementById('toma3-minima').value) || 0;
    const toma3Pulso = parseFloat(document.getElementById('toma3-pulso').value) || 0;

    // Calcular promedios
    const promedioMaxima = ((toma1Maxima + toma2Maxima + toma3Maxima) / 3).toFixed(1);
    const promedioMinima = ((toma1Minima + toma2Minima + toma3Minima) / 3).toFixed(1);
    const promedioPulso = ((toma1Pulso + toma2Pulso + toma3Pulso) / 3).toFixed(1);

    // Actualizar elementos
    document.getElementById('promedio-maxima').textContent = promedioMaxima;
    document.getElementById('promedio-minima').textContent = promedioMinima;
    document.getElementById('promedio-pulso').textContent = promedioPulso;
}

// Agregar event listeners para calcular promedios automáticamente
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.medicion-row input');
    inputs.forEach(input => {
        input.addEventListener('input', calcularPromedios);
    });

    // Establecer fecha por defecto como hoy
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
    fechaInput.max = hoy; // No permitir fechas futuras

    // Botón de guardar
    document.getElementById('btn-guardar').addEventListener('click', guardarMedicion);

    // Calcular promedios iniciales
    calcularPromedios();
});

// Función para mostrar mensaje
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000);
}

// Función para guardar la medición
function guardarMedicion() {
    const fecha = document.getElementById('fecha').value;
    const turno = document.getElementById('turno').value;

    if (!fecha || !turno) {
        mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
        return;
    }

    // Obtener valores de las tomas
    const toma1 = {
        maxima: parseFloat(document.getElementById('toma1-maxima').value),
        minima: parseFloat(document.getElementById('toma1-minima').value),
        pulso: parseFloat(document.getElementById('toma1-pulso').value)
    };

    const toma2 = {
        maxima: parseFloat(document.getElementById('toma2-maxima').value),
        minima: parseFloat(document.getElementById('toma2-minima').value),
        pulso: parseFloat(document.getElementById('toma2-pulso').value)
    };

    const toma3 = {
        maxima: parseFloat(document.getElementById('toma3-maxima').value),
        minima: parseFloat(document.getElementById('toma3-minima').value),
        pulso: parseFloat(document.getElementById('toma3-pulso').value)
    };

    // Calcular promedios
    const promedioMaxima = parseFloat(document.getElementById('promedio-maxima').textContent);
    const promedioMinima = parseFloat(document.getElementById('promedio-minima').textContent);
    const promedioPulso = parseFloat(document.getElementById('promedio-pulso').textContent);

    // Obtener mediciones existentes
    const mediciones = obtenerMediciones();

    // Inicializar el día si no existe
    if (!mediciones[fecha]) {
        mediciones[fecha] = {};
    }

    // Guardar datos del turno
    mediciones[fecha][turno] = {
        toma1,
        toma2,
        toma3,
        promedio: {
            maxima: promedioMaxima,
            minima: promedioMinima,
            pulso: promedioPulso
        },
        fechaGuardado: new Date().toISOString()
    };

    // Guardar en localStorage
    guardarMediciones(mediciones);

    // Mostrar mensaje de éxito
    mostrarMensaje('Mediciones guardadas correctamente', 'success');

    // Limpiar formulario
    setTimeout(() => {
        document.querySelectorAll('.medicion-row input').forEach(input => {
            input.value = '';
        });
        calcularPromedios();
        document.getElementById('turno').value = '';
    }, 1500);
}

