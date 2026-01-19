// Función para obtener todas las mediciones
function obtenerMediciones() {
    const datos = localStorage.getItem('mediciones_tension');
    return datos ? JSON.parse(datos) : {};
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

// Función para capitalizar primera letra
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para verificar si un valor debe marcarse en naranja
function esValorAlto(tipo, valor) {
    if (tipo === 'maxima' && valor > 145) {
        return true;
    }
    if (tipo === 'minima' && valor > 100) {
        return true;
    }
    return false;
}

// Función para generar HTML del reporte
function generarReporte() {
    const mediciones = obtenerMediciones();
    const fechas = Object.keys(mediciones).sort((a, b) => new Date(b) - new Date(a));
    const contenido = document.getElementById('reporte-content');

    if (fechas.length === 0) {
        contenido.innerHTML = '<p class="no-data">No hay mediciones registradas.</p>';
        return;
    }

    let html = '';

    fechas.forEach(fecha => {
        const datosDia = mediciones[fecha];
        html += `<div class="dia-reporte">`;
        html += `<h3>${formatearFecha(fecha)}</h3>`;

        // Turno Mañana
        if (datosDia.mañana) {
            html += generarTablaTurno('mañana', datosDia.mañana);
        }

        // Turno Noche
        if (datosDia.noche) {
            html += generarTablaTurno('noche', datosDia.noche);
        }

        html += `</div>`;
    });

    contenido.innerHTML = html;
}

// Función para generar tabla de un turno
function generarTablaTurno(turno, datos) {
    let html = `<div class="turno-reporte">`;
    html += `<h4>Turno: ${capitalizar(turno)}</h4>`;
    html += `<table class="tabla-reporte">`;
    html += `<thead><tr>`;
    html += `<th>Medición</th>`;
    html += `<th>1ª Toma</th>`;
    html += `<th>2ª Toma</th>`;
    html += `<th>3ª Toma</th>`;
    html += `<th>Promedio</th>`;
    html += `</tr></thead>`;
    html += `<tbody>`;
    
    // Fila Máxima
    html += `<tr>`;
    html += `<td><strong>MÁXIMA</strong></td>`;
    html += `<td class="${esValorAlto('maxima', datos.toma1.maxima) ? 'valor-alto' : ''}">${datos.toma1.maxima}</td>`;
    html += `<td class="${esValorAlto('maxima', datos.toma2.maxima) ? 'valor-alto' : ''}">${datos.toma2.maxima}</td>`;
    html += `<td class="${esValorAlto('maxima', datos.toma3.maxima) ? 'valor-alto' : ''}">${datos.toma3.maxima}</td>`;
    html += `<td class="promedio-row-tabla">${datos.promedio.maxima}</td>`;
    html += `</tr>`;

    // Fila Mínima
    html += `<tr>`;
    html += `<td><strong>MÍNIMA</strong></td>`;
    html += `<td class="${esValorAlto('minima', datos.toma1.minima) ? 'valor-alto' : ''}">${datos.toma1.minima}</td>`;
    html += `<td class="${esValorAlto('minima', datos.toma2.minima) ? 'valor-alto' : ''}">${datos.toma2.minima}</td>`;
    html += `<td class="${esValorAlto('minima', datos.toma3.minima) ? 'valor-alto' : ''}">${datos.toma3.minima}</td>`;
    html += `<td class="promedio-row-tabla">${datos.promedio.minima}</td>`;
    html += `</tr>`;

    // Fila Pulso
    html += `<tr>`;
    html += `<td><strong>PULSO</strong></td>`;
    html += `<td>${datos.toma1.pulso}</td>`;
    html += `<td>${datos.toma2.pulso}</td>`;
    html += `<td>${datos.toma3.pulso}</td>`;
    html += `<td class="promedio-row-tabla">${datos.promedio.pulso}</td>`;
    html += `</tr>`;

    html += `</tbody>`;
    html += `</table>`;
    html += `</div>`;

    return html;
}

// Función para generar PDF
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const mediciones = obtenerMediciones();
    const fechas = Object.keys(mediciones).sort((a, b) => new Date(b) - new Date(a));

    if (fechas.length === 0) {
        alert('No hay mediciones para imprimir');
        return;
    }

    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const lineHeight = 7;
    const startX = margin;

    // Título
    doc.setFontSize(18);
    doc.setTextColor(102, 126, 234);
    doc.text('REPORTE DE MEDICIONES DE TENSIÓN', 105, yPos, { align: 'center' });
    yPos += 15;

    // Fecha de generación
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 105, yPos, { align: 'center' });
    yPos += 15;

    fechas.forEach((fecha, indexFecha) => {
        // Verificar si necesitamos nueva página
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = margin;
        }

        const datosDia = mediciones[fecha];

        // Fecha del día
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.setFont(undefined, 'bold');
        doc.text(formatearFecha(fecha), startX, yPos);
        yPos += 10;

        // Turnos
        ['mañana', 'noche'].forEach(turno => {
            if (datosDia[turno]) {
                // Verificar si necesitamos nueva página
                if (yPos > pageHeight - 80) {
                    doc.addPage();
                    yPos = margin;
                }

                const datos = datosDia[turno];

                // Encabezado del turno
                doc.setFontSize(12);
                doc.setTextColor(118, 75, 162);
                doc.setFont(undefined, 'bold');
                doc.text(`Turno: ${capitalizar(turno)}`, startX, yPos);
                yPos += 10;

                // Tabla
                const colWidths = [50, 30, 30, 30, 35];
                const headers = ['Medición', '1ª Toma', '2ª Toma', '3ª Toma', 'Promedio'];
                
                // Encabezados de tabla
                const headerHeight = 8;
                let xPos = startX;
                
                // Dibujar rectángulos de encabezado
                headers.forEach((header, i) => {
                    doc.setFillColor(102, 126, 234);
                    doc.rect(xPos, yPos, colWidths[i], headerHeight, 'F');
                    xPos += colWidths[i];
                });
                
                // Dibujar texto de encabezados
                xPos = startX;
                doc.setFontSize(9);
                doc.setTextColor(255, 255, 255);
                doc.setFont(undefined, 'bold');
                headers.forEach((header, i) => {
                    doc.text(header, xPos + colWidths[i] / 2, yPos + 5.5, { align: 'center' });
                    xPos += colWidths[i];
                });
                
                yPos += headerHeight;

                // Filas de datos
                const filas = [
                    { label: 'MÁXIMA', valores: [datos.toma1.maxima, datos.toma2.maxima, datos.toma3.maxima], promedio: datos.promedio.maxima },
                    { label: 'MÍNIMA', valores: [datos.toma1.minima, datos.toma2.minima, datos.toma3.minima], promedio: datos.promedio.minima },
                    { label: 'PULSO', valores: [datos.toma1.pulso, datos.toma2.pulso, datos.toma3.pulso], promedio: datos.promedio.pulso }
                ];

                const rowHeight = 7;
                filas.forEach((fila, idx) => {
                    if (yPos > pageHeight - 20) {
                        doc.addPage();
                        yPos = margin;
                    }

                    xPos = startX;
                    doc.setFontSize(9);
                    doc.setTextColor(0, 0, 0);
                    
                    // Dibujar bordes de la fila
                    headers.forEach((header, i) => {
                        doc.rect(xPos, yPos, colWidths[i], rowHeight, 'S');
                        xPos += colWidths[i];
                    });
                    
                    // Label (primera columna)
                    xPos = startX;
                    doc.setFont(undefined, 'bold');
                    doc.text(fila.label, xPos + 2, yPos + 5);
                    xPos += colWidths[0];

                    // Valores
                    doc.setFont(undefined, 'normal');
                    fila.valores.forEach((valor, i) => {
                        // Verificar si debe estar en naranja (solo para Máxima y Mínima, no para promedios)
                        const tipo = fila.label === 'MÁXIMA' ? 'maxima' : (fila.label === 'MÍNIMA' ? 'minima' : null);
                        if (tipo && esValorAlto(tipo, valor)) {
                            doc.setTextColor(255, 140, 0); // Naranja
                        } else {
                            doc.setTextColor(0, 0, 0); // Negro
                        }
                        doc.text(valor.toString(), xPos + colWidths[i + 1] / 2, yPos + 5, { align: 'center' });
                        xPos += colWidths[i + 1];
                    });

                    // Promedio (última columna con fondo)
                    doc.setFillColor(232, 244, 248);
                    doc.rect(xPos, yPos, colWidths[4], rowHeight, 'FD');
                    doc.setFont(undefined, 'bold');
                    doc.text(fila.promedio.toString(), xPos + colWidths[4] / 2, yPos + 5, { align: 'center' });
                    
                    yPos += rowHeight;
                });

                yPos += 5;
            }
        });

        yPos += 5;
    });

    // Guardar PDF
    doc.save(`Reporte_Mediciones_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    generarReporte();
    document.getElementById('btn-imprimir-pdf').addEventListener('click', generarPDF);
});

