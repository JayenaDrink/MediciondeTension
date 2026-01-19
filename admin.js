// Función para obtener todas las mediciones
function obtenerMediciones() {
    const datos = localStorage.getItem('mediciones_tension');
    return datos ? JSON.parse(datos) : {};
}

// Función para guardar todas las mediciones
function guardarMediciones(mediciones) {
    localStorage.setItem('mediciones_tension', JSON.stringify(mediciones));
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Función para capitalizar
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para generar formulario de edición
function generarFormularioEdicion(fecha) {
    const mediciones = obtenerMediciones();
    const datosDia = mediciones[fecha];

    if (!datosDia) {
        document.getElementById('edit-form-container').style.display = 'none';
        return;
    }

    document.getElementById('edit-form-container').style.display = 'block';

    // Generar formulario para mañana
    generarFormularioTurno('mañana', datosDia.mañana || null, 'mañana-container');

    // Generar formulario para noche
    generarFormularioTurno('noche', datosDia.noche || null, 'noche-container');
}

// Función para generar formulario de un turno
function generarFormularioTurno(turno, datos, containerId) {
    const container = document.getElementById(containerId);
    
    if (!datos) {
        container.innerHTML = '<p style="color: #999; padding: 10px;">No hay datos registrados para este turno.</p>';
        return;
    }

    let html = '';
    
    ['1', '2', '3'].forEach(num => {
        html += `<div class="toma-edit">`;
        html += `<h5>Toma ${num}</h5>`;
        html += `<input type="number" id="edit-${turno}-toma${num}-maxima" value="${datos[`toma${num}`].maxima}" placeholder="Máxima" min="0" max="300">`;
        html += `<input type="number" id="edit-${turno}-toma${num}-minima" value="${datos[`toma${num}`].minima}" placeholder="Mínima" min="0" max="300">`;
        html += `<input type="number" id="edit-${turno}-toma${num}-pulso" value="${datos[`toma${num}`].pulso}" placeholder="Pulso" min="0" max="200">`;
        html += `</div>`;
    });

    container.innerHTML = html;

    // Agregar event listeners para recalcular promedios
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (document.getElementById('fecha-edicion').value) {
                // Los promedios se calcularán al guardar
            }
        });
    });
}

// Función para calcular promedios de un turno
function calcularPromediosTurno(turno) {
    let sumaMaxima = 0;
    let sumaMinima = 0;
    let sumaPulso = 0;
    let count = 0;

    ['1', '2', '3'].forEach(num => {
        const maxima = parseFloat(document.getElementById(`edit-${turno}-toma${num}-maxima`)?.value) || 0;
        const minima = parseFloat(document.getElementById(`edit-${turno}-toma${num}-minima`)?.value) || 0;
        const pulso = parseFloat(document.getElementById(`edit-${turno}-toma${num}-pulso`)?.value) || 0;

        if (maxima > 0 || minima > 0 || pulso > 0) {
            sumaMaxima += maxima;
            sumaMinima += minima;
            sumaPulso += pulso;
            count++;
        }
    });

    if (count === 0) return null;

    return {
        maxima: parseFloat((sumaMaxima / 3).toFixed(1)),
        minima: parseFloat((sumaMinima / 3).toFixed(1)),
        pulso: parseFloat((sumaPulso / 3).toFixed(1))
    };
}

// Función para guardar edición
function guardarEdicion() {
    const fecha = document.getElementById('fecha-edicion').value;

    if (!fecha) {
        mostrarMensajeAdmin('Por favor seleccione una fecha', 'error');
        return;
    }

    const mediciones = obtenerMediciones();
    
    if (!mediciones[fecha]) {
        mediciones[fecha] = {};
    }

    // Guardar mañana si existe
    const promedioManana = calcularPromediosTurno('mañana');
    if (promedioManana) {
        mediciones[fecha].mañana = {
            toma1: {
                maxima: parseFloat(document.getElementById('edit-mañana-toma1-maxima').value),
                minima: parseFloat(document.getElementById('edit-mañana-toma1-minima').value),
                pulso: parseFloat(document.getElementById('edit-mañana-toma1-pulso').value)
            },
            toma2: {
                maxima: parseFloat(document.getElementById('edit-mañana-toma2-maxima').value),
                minima: parseFloat(document.getElementById('edit-mañana-toma2-minima').value),
                pulso: parseFloat(document.getElementById('edit-mañana-toma2-pulso').value)
            },
            toma3: {
                maxima: parseFloat(document.getElementById('edit-mañana-toma3-maxima').value),
                minima: parseFloat(document.getElementById('edit-mañana-toma3-minima').value),
                pulso: parseFloat(document.getElementById('edit-mañana-toma3-pulso').value)
            },
            promedio: promedioManana,
            fechaGuardado: new Date().toISOString()
        };
    }

    // Guardar noche si existe
    const promedioNoche = calcularPromediosTurno('noche');
    if (promedioNoche) {
        mediciones[fecha].noche = {
            toma1: {
                maxima: parseFloat(document.getElementById('edit-noche-toma1-maxima').value),
                minima: parseFloat(document.getElementById('edit-noche-toma1-minima').value),
                pulso: parseFloat(document.getElementById('edit-noche-toma1-pulso').value)
            },
            toma2: {
                maxima: parseFloat(document.getElementById('edit-noche-toma2-maxima').value),
                minima: parseFloat(document.getElementById('edit-noche-toma2-minima').value),
                pulso: parseFloat(document.getElementById('edit-noche-toma2-pulso').value)
            },
            toma3: {
                maxima: parseFloat(document.getElementById('edit-noche-toma3-maxima').value),
                minima: parseFloat(document.getElementById('edit-noche-toma3-minima').value),
                pulso: parseFloat(document.getElementById('edit-noche-toma3-pulso').value)
            },
            promedio: promedioNoche,
            fechaGuardado: new Date().toISOString()
        };
    }

    guardarMediciones(mediciones);
    mostrarMensajeAdmin('Cambios guardados correctamente', 'success');
    cargarListaDias();
    
    // Regenerar formulario con nuevos valores
    generarFormularioEdicion(fecha);
}

// Función para eliminar día
function eliminarDia() {
    const fecha = document.getElementById('fecha-edicion').value;

    if (!fecha) {
        mostrarMensajeAdmin('Por favor seleccione una fecha', 'error');
        return;
    }

    if (!confirm(`¿Está seguro de eliminar todas las mediciones del ${formatearFecha(fecha)}?`)) {
        return;
    }

    const mediciones = obtenerMediciones();
    delete mediciones[fecha];
    guardarMediciones(mediciones);

    mostrarMensajeAdmin('Día eliminado correctamente', 'success');
    document.getElementById('edit-form-container').style.display = 'none';
    document.getElementById('fecha-edicion').value = '';
    cargarListaDias();
}

// Función para cargar lista de días
function cargarListaDias() {
    const mediciones = obtenerMediciones();
    const fechas = Object.keys(mediciones).sort((a, b) => new Date(b) - new Date(a));
    const lista = document.getElementById('lista-dias');

    if (fechas.length === 0) {
        lista.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No hay mediciones registradas.</p>';
        return;
    }

    let html = '<h3>Días con Mediciones Registradas</h3>';
    fechas.forEach(fecha => {
        const turnos = [];
        if (mediciones[fecha].mañana) turnos.push('Mañana');
        if (mediciones[fecha].noche) turnos.push('Noche');
        
        html += `<div class="dia-item" onclick="seleccionarFecha('${fecha}')">`;
        html += `<span>${formatearFecha(fecha)}</span>`;
        html += `<small>${turnos.join(' y ')}</small>`;
        html += `</div>`;
    });

    lista.innerHTML = html;
}

// Función para seleccionar fecha
function seleccionarFecha(fecha) {
    document.getElementById('fecha-edicion').value = fecha;
    generarFormularioEdicion(fecha);
}

// Función para mostrar mensaje
function mostrarMensajeAdmin(texto, tipo) {
    const mensaje = document.getElementById('mensaje-admin');
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000);
}

// Hacer seleccionarFecha disponible globalmente
window.seleccionarFecha = seleccionarFecha;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarListaDias();

    document.getElementById('fecha-edicion').addEventListener('change', function() {
        if (this.value) {
            generarFormularioEdicion(this.value);
        } else {
            document.getElementById('edit-form-container').style.display = 'none';
        }
    });

    document.getElementById('btn-guardar-edicion').addEventListener('click', guardarEdicion);
    document.getElementById('btn-eliminar-dia').addEventListener('click', eliminarDia);

    // Establecer fecha máxima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-edicion').max = hoy;
});

