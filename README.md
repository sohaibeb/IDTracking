[**Versión Aplicación:** 1.0 | **Versión ReadMe:** 1.0 | **Última Actualización:** 10/01/2026]

# ID Tracking - Versión 1.0

## Descripción

ID Tracking es una aplicación web responsive para generar y decodificar IDs utilizando Base64 y rotación de caracteres. La aplicación permite crear IDs únicos basados en año, versión y nombre de empresa, aplicando un proceso de cifrado que incluye codificación Base64 y rotación de caracteres basada en la última letra del nombre de la empresa.

## Requisitos Técnicos
- Navegador web moderno con soporte para JavaScript ES6+
- Conexión a internet para cargar Bootstrap y Bootstrap Icons (CDN)
- No requiere backend o servidor adicional

## Instalación y Uso
1. Descargar los tres archivos (index.html, style.css, script.js)
2. Colocarlos en el mismo directorio
3. Abrir index.html en cualquier navegador web moderno
4. No se requiere configuración adicional

### Ejemplo de Uso
Para generar un ID:
```
Año: 2026
Versión: v2.0
Empresa: randstad

Proceso:
1. String: "2026_v2.0_randstad"
2. Base64: "MjAyNl92Mi4wX3JhbmRzdGFk"
3. Última letra: "d" → posición 4
4. ID final con rotación 4: (resultado aplicando rotación al Base64)
```
## Estructura de Archivos
```
id-tracking/
    ╠══ index.html      # Estructura principal HTML
    ╠══ style.css       # Estilos CSS personalizados
    ╚══ script.js       # Lógica JavaScript de la aplicación
```

---
## Diseño y Características Principales

### Pestaña "Generar IDs"
- **Selección de año**: Dropdown con opciones 2025, 2026 y 2027
- **Selección de versión**: Dropdown con versiones de v1.0 a v3.2
- **Nombre de empresa**: Campo de texto para ingresar el nombre de la empresa
- **Tabla de resultados**: Muestra todos los IDs generados con sus detalles
  - Año, versión y empresa
  - String Base64 original
  - ID final con rotación aplicada
  - Última letra de la empresa y su valor numérico (a=1, b=2, ..., z=26)
  - Número de rotación aplicada

### Pestaña "Decodificar IDs"
- **Campo para ID final**: Para ingresar el ID codificado
- **Campo para clave**: Última letra del nombre de la empresa original
- **Resultado**: Muestra el string original decodificado
- **Historial**: Tabla con todos los intentos de decodificación realizados

### Funcionalidades Técnicas
- **Algoritmo de generación**: 
  1. Concatena año, versión y empresa en formato: `Año_Versión_Empresa`
  2. Codifica a Base64
  3. Determina la rotación basada en la última letra del nombre de la empresa
  4. Aplica rotación de caracteres al string Base64
- **Algoritmo de decodificación**:
  1. Reversa la rotación usando la clave proporcionada
  2. Decodifica desde Base64
  3. Muestra el string original
- **Persistencia de datos**: 
  - Guarda automáticamente en localStorage
  - Restaura el estado al recargar la página
  - Mantiene pestaña activa y valores de formulario

### Interfaz de Usuario
- **Diseño responsive** con Bootstrap 5
- **Notificaciones toast** para feedback de acciones
- **Botones de copiar** en cada resultado
- **Iconos intuitivos** de Bootstrap Icons
- **Tablas con hover effects** para mejor experiencia
- **Validación de formularios** en tiempo real

## Funciones de la Aplicación

### Gestión de IDs
- **Agregar nuevos IDs**: Mediante formulario en pestaña "Generar IDs"
- **Eliminar IDs individuales**: Botón de eliminar en cada fila
- **Limpiar tablas**: Botones para eliminar todos los registros
- **Generar ejemplo**: Botón para crear un ID de ejemplo

### Utilidades
- **Copiar al portapapeles**: Para Base64 e ID final
- **Notificaciones**: Feedback visual para todas las acciones
- **Validación**: De entradas y formato de datos
- **Responsive**: Funciona en dispositivos móviles y escritorio

## To-Do (Funcionalidades Pendientes)

### Funcionalidades de Exportación/Importación
- [ ] **Exportar tabla completa a CSV**: Botón para descargar todos los IDs generados en formato CSV
- [ ] **Exportar para decodificador**: Exportar solo ID final y clave en CSV para uso en decodificador
- [ ] **Importar CSV para decodificar**: Cargar archivo CSV con IDs y claves para decodificación masiva
- [ ] **Selector de formato de exportación**: Opciones para diferentes formatos de salida

### Mejoras de Visualización
- [ ] **Ver texto completo**: Botón de "ojo" para mostrar strings completos en modal (especialmente útil para IDs largos)
- [ ] **Búsqueda en tablas**: Funcionalidad de filtrado/búsqueda dentro de las tablas
- [ ] **Ordenación de columnas**: Posibilidad de ordenar por cualquier columna
- [ ] **Paginación de tablas**: Para manejar grandes cantidades de registros

## Limitaciones Conocidas
1. Los nombres de empresa deben contener solo letras, números y espacios
2. La clave de decodificación debe ser exactamente la última letra usada en la generación
3. El rango de años está limitado a 2025-2027 (puede extenderse modificando el código)
4. Las versiones disponibles son limitadas (pueden añadirse más modificando el código)

### Notas de Uso
Esta herramienta está diseñada para fines educativos y profesionales de codificación/decodificación de datos. El autor no se responsabiliza del uso indebido de esta aplicación.

### Licencia
Este proyecto está licenciado bajo la **Licencia Pública de Mozilla versión 2.0** (MPL 2.0).

**Resumen de la Licencia MPL 2.0:**
- Permite uso, modificación y distribución del código
- Requiere que los cambios en archivos bajo MPL 2.0 permanezcan bajo la misma licencia
- Permite combinar con código bajo otras licencias en proyectos más grandes
- No afecta a archivos que no contengan código licenciado bajo MPL 2.0

Para más detalles, consulta el texto completo de la licencia en: [https://www.mozilla.org/en-US/MPL/2.0/](https://www.mozilla.org/en-US/MPL/2.0/)

## About
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://www.javascript.com/) [![Bootstrap 5.x](https://img.shields.io/badge/Bootstrap-5.x-blueviolet.svg)](https://getbootstrap.com/) [![HTML5](https://img.shields.io/badge/HTML5-✓-red.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML) [![CSS3](https://img.shields.io/badge/CSS3-✓-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS) [![LocalStorage](https://img.shields.io/badge/LocalStorage-✓-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) [![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-orange.svg)](https://www.mozilla.org/en-US/MPL/2.0/) [![email-contact](https://img.shields.io/badge/Contact-info@cybersec.sohaib.eu-blue.svg)](mailto:info@cybersec.sohaib.eu) 
