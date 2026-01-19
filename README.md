# Medición de Tensión

Aplicación web para registrar y gestionar mediciones de tensión arterial diarias. Accesible desde cualquier dispositivo móvil sin necesidad de base de datos.

## Características

- ✅ **Ingreso de Mediciones**: Registra mediciones de tensión por día y turno (Mañana/Noche)
- ✅ **Cálculo Automático**: Calcula automáticamente los promedios de cada medición
- ✅ **Reportes Completos**: Visualiza todas las mediciones registradas en formato de tabla
- ✅ **Exportar a PDF**: Genera reportes en PDF para compartir con tu médico
- ✅ **Administración**: Edita o elimina mediciones por día
- ✅ **Almacenamiento Local**: Los datos se guardan en el navegador (localStorage)
- ✅ **Responsive**: Diseño optimizado para móviles y tablets
- ✅ **Sin Backend**: Todo funciona directamente en el navegador

## Estructura de Datos

Cada medición incluye:
- **Fecha**: Día de la medición
- **Turno**: Mañana o Noche
- **3 Tomas** por turno, cada una con:
  - Máxima (mmHg)
  - Mínima (mmHg)
  - Pulso (bpm)
- **Promedio**: Calculado automáticamente para cada parámetro

## Cómo Usar

### Opción 1: Acceso desde GitHub Pages

1. Asegúrate de que tu repositorio esté configurado para GitHub Pages
2. Accede a: `https://[tu-usuario].github.io/MediciondeTension/`
3. ¡Listo! Puedes comenzar a registrar tus mediciones

### Opción 2: Configurar GitHub Pages

1. Ve a la configuración de tu repositorio en GitHub
2. Navega a **Settings** → **Pages**
3. En **Source**, selecciona la rama `main` (o `master`)
4. Guarda los cambios
5. Espera unos minutos y tu sitio estará disponible en: `https://[tu-usuario].github.io/MediciondeTension/`

## Páginas de la Aplicación

### 📝 Ingreso de Datos (`index.html`)
- Selecciona la fecha de medición
- Elige el turno (Mañana/Noche)
- Ingresa las 3 tomas con Máxima, Mínima y Pulso
- Los promedios se calculan automáticamente
- Guarda las mediciones del turno

### 📊 Reportes (`reporte.html`)
- Visualiza todas las mediciones registradas
- Organizado por fecha y turno
- Botón para exportar a PDF
- Formato de tabla similar a la imagen de referencia

### ⚙️ Administración (`admin.html`)
- Selecciona una fecha para editar
- Modifica las mediciones de Mañana y/o Noche
- Elimina un día completo si es necesario
- Los promedios se recalculan al guardar

## Almacenamiento de Datos

Los datos se almacenan en el **localStorage** del navegador. Esto significa:

- ✅ No necesitas base de datos
- ✅ Los datos permanecen en tu dispositivo
- ✅ Funciona completamente offline
- ⚠️ Los datos son específicos del navegador y dispositivo
- ⚠️ Si limpias los datos del navegador, se perderán las mediciones

### Backup de Datos (Recomendado)

Para hacer un backup de tus datos:

1. Abre la consola del navegador (F12)
2. Ejecuta: `localStorage.getItem('mediciones_tension')`
3. Copia el resultado JSON
4. Guárdalo en un archivo de texto seguro

Para restaurar:
1. Abre la consola del navegador
2. Pega tu JSON y ejecuta: `localStorage.setItem('mediciones_tension', '[tu-json]')`

## Tecnologías Utilizadas

- HTML5
- CSS3 (con diseño responsive)
- JavaScript (Vanilla)
- jsPDF (para generación de PDFs)
- LocalStorage API

## Navegadores Compatibles

- Chrome/Edge (recomendado)
- Firefox
- Safari
- Opera
- Navegadores móviles modernos

## Notas Importantes

- Los datos se guardan localmente en tu navegador
- Si cambias de dispositivo o navegador, necesitarás exportar/importar los datos
- La aplicación funciona completamente offline una vez cargada
- Los reportes PDF se generan directamente en el navegador

## Uso Móvil

La aplicación está optimizada para uso móvil:
- Interfaz táctil amigable
- Campos de entrada grandes y fáciles de usar
- Navegación intuitiva
- Diseño responsive que se adapta a cualquier pantalla

## Contribuir

Si deseas mejorar esta aplicación, eres bienvenido a hacer fork y enviar pull requests.

## Licencia

Este proyecto es de uso libre para fines personales.
