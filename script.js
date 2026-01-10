
        // Establecer año actual en el footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Clase para manejar la lógica de generación y decodificación
        class IDManager {
            constructor() {
                this.generatedIDs = [];
                this.decodedIDs = [];
                this.appState = {
                    activeTab: 'encoder',
                    formValues: {}
                };
                this.loadAllFromStorage();
                this.setupAutoSave();
            }
            
            // Cargar todos los datos desde localStorage
            loadAllFromStorage() {
                // Cargar IDs generados
                const storedIDs = localStorage.getItem('generatedIDs');
                if (storedIDs) {
                    this.generatedIDs = JSON.parse(storedIDs);
                    this.renderGeneratedTable();
                }
                
                // Cargar IDs decodificados
                const storedDecoded = localStorage.getItem('decodedIDs');
                if (storedDecoded) {
                    this.decodedIDs = JSON.parse(storedDecoded);
                    this.renderDecodedTable();
                }
                
                // Cargar estado de la aplicación
                const storedState = localStorage.getItem('appState');
                if (storedState) {
                    this.appState = JSON.parse(storedState);
                    
                    // Restaurar valores de formulario
                    if (this.appState.formValues.encoder) {
                        const encoderValues = this.appState.formValues.encoder;
                        if (encoderValues.year) document.getElementById('year').value = encoderValues.year;
                        if (encoderValues.version) document.getElementById('version').value = encoderValues.version;
                        if (encoderValues.company) document.getElementById('company').value = encoderValues.company;
                    }
                    
                    if (this.appState.formValues.decoder) {
                        const decoderValues = this.appState.formValues.decoder;
                        if (decoderValues.encodedId) document.getElementById('encodedId').value = decoderValues.encodedId;
                        if (decoderValues.keyLetter) document.getElementById('keyLetter').value = decoderValues.keyLetter;
                    }
                    
                    // Restaurar pestaña activa
                    setTimeout(() => {
                        if (this.appState.activeTab === 'decoder') {
                            const decoderTab = document.getElementById('decoder-tab');
                            new bootstrap.Tab(decoderTab).show();
                        }
                    }, 100);
                }
            }
            
            // Configurar guardado automático de estado
            setupAutoSave() {
                // Guardar valores de formulario al cambiar
                document.getElementById('year').addEventListener('change', () => this.saveFormState());
                document.getElementById('version').addEventListener('change', () => this.saveFormState());
                document.getElementById('company').addEventListener('input', () => this.saveFormState());
                document.getElementById('encodedId').addEventListener('input', () => this.saveFormState());
                document.getElementById('keyLetter').addEventListener('input', () => this.saveFormState());
                
                // Guardar pestaña activa al cambiar
                document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
                    tab.addEventListener('shown.bs.tab', (event) => {
                        this.appState.activeTab = event.target.id.includes('encoder') ? 'encoder' : 'decoder';
                        this.saveAppState();
                    });
                });
            }
            
            // Guardar estado del formulario
            saveFormState() {
                this.appState.formValues = {
                    encoder: {
                        year: document.getElementById('year').value,
                        version: document.getElementById('version').value,
                        company: document.getElementById('company').value
                    },
                    decoder: {
                        encodedId: document.getElementById('encodedId').value,
                        keyLetter: document.getElementById('keyLetter').value
                    }
                };
                this.saveAppState();
            }
            
            // Guardar estado de la aplicación
            saveAppState() {
                localStorage.setItem('appState', JSON.stringify(this.appState));
            }
            
            // Guardar todos los datos
            saveAllData() {
                localStorage.setItem('generatedIDs', JSON.stringify(this.generatedIDs));
                localStorage.setItem('decodedIDs', JSON.stringify(this.decodedIDs));
                this.saveAppState();
            }
            
            // Obtener posición de una letra en el alfabeto (a=1, b=2, ..., z=26)
            getLetterPosition(letter) {
                if (!letter || letter.length !== 1) return 0;
                const charCode = letter.toLowerCase().charCodeAt(0);
                if (charCode >= 97 && charCode <= 122) {
                    return charCode - 96; // 'a' es 97 en ASCII, así que 97-96=1
                }
                return 0;
            }
            
            // Rotar caracteres en una cadena - FIXED VERSION
            rotateString(str, rotation) {
                if (!rotation || rotation === 0) return str;
                
                // Definir los caracteres Base64 válidos
                const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                let result = '';
                
                for (let i = 0; i < str.length; i++) {
                    const char = str[i];
                    const currentIndex = base64Chars.indexOf(char);
                    
                    if (currentIndex !== -1) {
                        // Calcular nuevo índice con rotación
                        let newIndex = (currentIndex + rotation) % base64Chars.length;
                        result += base64Chars[newIndex];
                    } else {
                        // Si no es un carácter Base64 válido, mantenerlo igual
                        result += char;
                    }
                }
                return result;
            }
            
            // Revertir rotación de caracteres - FIXED VERSION
            reverseRotateString(str, rotation) {
                if (!rotation || rotation === 0) return str;
                
                // Definir los caracteres Base64 válidos
                const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                let result = '';
                
                for (let i = 0; i < str.length; i++) {
                    const char = str[i];
                    const currentIndex = base64Chars.indexOf(char);
                    
                    if (currentIndex !== -1) {
                        // Calcular nuevo índice con rotación inversa
                        let newIndex = (currentIndex - rotation) % base64Chars.length;
                        if (newIndex < 0) newIndex += base64Chars.length;
                        result += base64Chars[newIndex];
                    } else {
                        // Si no es un carácter Base64 válido, mantenerlo igual
                        result += char;
                    }
                }
                return result;
            }
            
            // Generar ID completo
            generateID(year, version, company) {
                // Crear string en formato Año_Versión_Empresa
                const originalString = `${year}_${version}_${company}`;
                
                // Codificar a Base64
                const base64String = btoa(originalString);
                
                // Obtener última letra de la empresa y su posición
                const lastLetter = company.charAt(company.length - 1).toLowerCase();
                const rotation = this.getLetterPosition(lastLetter);
                
                // Aplicar rotación al Base64
                const rotatedString = this.rotateString(base64String, rotation);
                
                return {
                    year,
                    version,
                    company,
                    base64: base64String,
                    rotated: rotatedString,
                    rotation,
                    lastLetter,
                    lastLetterPosition: rotation,
                    timestamp: new Date().toLocaleString()
                };
            }
            
            // Decodificar ID - FIXED VERSION
            decodeID(encodedID, keyLetter) {
                // Obtener rotación desde la letra clave
                const rotation = this.getLetterPosition(keyLetter);
                
                if (rotation === 0) {
                    return {
                        success: false,
                        error: "Clave inválida. Debe ser una letra (a-z)."
                    };
                }
                
                // Revertir rotación
                const base64String = this.reverseRotateString(encodedID, rotation);
                
                // Decodificar Base64
                try {
                    const decodedString = atob(base64String);
                    
                    // Verificar formato esperado
                    const parts = decodedString.split('_');
                    if (parts.length >= 3) {
                        return {
                            success: true,
                            original: decodedString,
                            year: parts[0],
                            version: parts[1],
                            company: parts.slice(2).join('_'),
                            rotation,
                            keyLetter,
                            timestamp: new Date().toLocaleString()
                        };
                    } else {
                        return {
                            success: false,
                            error: "Formato de ID inválido después de decodificar."
                        };
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: "Error al decodificar Base64. Verifica el ID y la clave."
                    };
                }
            }
            
            // Agregar ID generado a la lista
            addGeneratedID(year, version, company) {
                const idData = this.generateID(year, version, company);
                this.generatedIDs.unshift(idData);
                this.saveAllData();
                this.renderGeneratedTable();
                return idData;
            }
            
            // Agregar ID decodificado a la lista
            addDecodedID(encodedID, keyLetter, result) {
                const decodeData = {
                    encodedID,
                    keyLetter,
                    keyLetterPosition: this.getLetterPosition(keyLetter),
                    result: result.success ? result.original : result.error,
                    success: result.success,
                    timestamp: new Date().toLocaleString()
                };
                
                this.decodedIDs.unshift(decodeData);
                this.saveAllData();
                this.renderDecodedTable();
                return decodeData;
            }
            
            // Renderizar tabla de IDs generados
            renderGeneratedTable() {
                const tableBody = document.getElementById('idsTableBody');
                tableBody.innerHTML = '';
                
                if (this.generatedIDs.length === 0) {
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `
                        <td colspan="6" class="text-center py-4 text-muted">
                            <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                            <p class="mt-2">No hay IDs generados aún. Agrega uno usando el formulario.</p>
                        </td>
                    `;
                    tableBody.appendChild(emptyRow);
                    return;
                }
                
                this.generatedIDs.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.year}</td>
                        <td>${item.version}</td>
                        <td>
                            <div>${item.company}</div>
                            <small class="text-muted">última letra: ${item.lastLetter} <span class="badge badge-rotation rounded-pill bg-primary">${item.lastLetterPosition}</span></small>
                        </td>
                        <td>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-truncate" style="max-width: 150px;">${item.base64}</span>
                                <span class="copy-btn ms-2" data-text="${item.base64}" title="Copiar Base64">
                                    <i class="bi bi-clipboard"></i>
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="generated-id text-truncate" style="max-width: 150px;">${item.rotated}</span>
                                <span class="copy-btn ms-2" data-text="${item.rotated}" title="Copiar ID final">
                                    <i class="bi bi-clipboard"></i>
                                </span>
                            </div>
                            <small class="text-muted">rotación: ${item.rotation}</small>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger" data-index="${index}" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            
            // Renderizar tabla de IDs decodificados
            renderDecodedTable() {
                const tableBody = document.getElementById('decodedTableBody');
                tableBody.innerHTML = '';
                
                if (this.decodedIDs.length === 0) {
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `
                        <td colspan="5" class="text-center py-4 text-muted">
                            <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                            <p class="mt-2">No hay IDs decodificados aún. Usa el formulario para decodificar uno.</p>
                        </td>
                    `;
                    tableBody.appendChild(emptyRow);
                    return;
                }
                
                this.decodedIDs.forEach((item, index) => {
                    const row = document.createElement('tr');
                    const resultClass = item.success ? 'text-success' : 'text-danger';
                    const resultIcon = item.success ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-exclamation-circle"></i>';
                    
                    row.innerHTML = `
                        <td class="text-truncate" style="max-width: 200px;">${item.encodedID}</td>
                        <td>${item.keyLetter} <span class="badge badge-rotation rounded-pill bg-primary">${item.keyLetterPosition}</span></td>
                        <td class="${resultClass}">${resultIcon} ${item.result}</td>
                        <td>${item.timestamp}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger" data-index="${index}" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            
            // Eliminar ID generado
            removeGeneratedID(index) {
                if (confirm("¿Estás seguro de que deseas eliminar este ID?")) {
                    this.generatedIDs.splice(index, 1);
                    this.saveAllData();
                    this.renderGeneratedTable();
                    showToast('ID eliminado correctamente', 'success');
                }
            }
            
            // Eliminar ID decodificado
            removeDecodedID(index) {
                if (confirm("¿Estás seguro de que deseas eliminar este resultado?")) {
                    this.decodedIDs.splice(index, 1);
                    this.saveAllData();
                    this.renderDecodedTable();
                    showToast('Resultado eliminado', 'success');
                }
            }
            
            // Limpiar todos los IDs generados
            clearGeneratedIDs() {
                if (this.generatedIDs.length > 0 && confirm("¿Estás seguro de que deseas eliminar todos los IDs generados?")) {
                    this.generatedIDs = [];
                    this.saveAllData();
                    this.renderGeneratedTable();
                    showToast('Todos los IDs generados han sido eliminados', 'success');
                }
            }
            
            // Limpiar todos los IDs decodificados
            clearDecodedIDs() {
                if (this.decodedIDs.length > 0 && confirm("¿Estás seguro de que deseas eliminar el historial de decodificación?")) {
                    this.decodedIDs = [];
                    this.saveAllData();
                    this.renderDecodedTable();
                    showToast('Historial de decodificación eliminado', 'success');
                }
            }
        }
        
        // Inicializar el manager de IDs
        const idManager = new IDManager();
        
        // Función para mostrar notificaciones toast
        function showToast(message, type = 'success') {
            const toastContainer = document.getElementById('toastContainer');
            const toastId = 'toast-' + Date.now();
            
            const toastEl = document.createElement('div');
            toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
            toastEl.id = toastId;
            toastEl.setAttribute('role', 'alert');
            toastEl.setAttribute('aria-live', 'assertive');
            toastEl.setAttribute('aria-atomic', 'true');
            
            toastEl.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            
            toastContainer.appendChild(toastEl);
            const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();
            
            // Eliminar el toast del DOM después de que se oculte
            toastEl.addEventListener('hidden.bs.toast', function () {
                toastEl.remove();
            });
        }
        
        // Función para copiar al portapapeles
        function copyToClipboard(text, element = null) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Texto copiado al portapapeles', 'success');
                
                // Cambiar icono temporalmente si se proporciona un elemento
                if (element) {
                    const icon = element.querySelector('i');
                    if (icon) {
                        const originalClass = icon.className;
                        icon.className = 'bi bi-check';
                        
                        setTimeout(() => {
                            icon.className = originalClass;
                        }, 2000);
                    }
                }
            }).catch(err => {
                console.error('Error al copiar: ', err);
                showToast('Error al copiar el texto', 'danger');
            });
        }
        
        // Delegación de eventos para los botones de copiar
        document.addEventListener('click', function(e) {
            // Botones de copiar en la tabla de generados
            if (e.target.closest('.copy-btn')) {
                const copyBtn = e.target.closest('.copy-btn');
                const textToCopy = copyBtn.getAttribute('data-text');
                if (textToCopy) {
                    copyToClipboard(textToCopy, copyBtn);
                }
            }
            
            // Botones de eliminar en la tabla de generados
            if (e.target.closest('.btn-outline-danger')) {
                const deleteBtn = e.target.closest('.btn-outline-danger');
                const index = deleteBtn.getAttribute('data-index');
                const tableId = deleteBtn.closest('table').id;
                
                if (tableId === 'idsTable') {
                    idManager.removeGeneratedID(parseInt(index));
                } else if (tableId === 'decodedTable') {
                    idManager.removeDecodedID(parseInt(index));
                }
            }
        });
        
        // Manejar el formulario de generación
        document.getElementById('idForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const year = document.getElementById('year').value;
            const version = document.getElementById('version').value;
            const company = document.getElementById('company').value.trim();
            
            if (!year || !version || !company) {
                showToast('Por favor, completa todos los campos.', 'warning');
                return;
            }
            
            if (!/^[a-zA-Z0-9\s]+$/.test(company)) {
                showToast('El nombre de la empresa solo puede contener letras, números y espacios.', 'warning');
                return;
            }
            
            const idData = idManager.addGeneratedID(year, version, company);
            showToast(`ID generado para ${company}`, 'success');
            
            // Limpiar solo el campo de empresa
            document.getElementById('company').value = '';
            idManager.saveFormState();
        });
        
        // Manejar el formulario de decodificación
        document.getElementById('decodeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const encodedId = document.getElementById('encodedId').value.trim();
            const keyLetter = document.getElementById('keyLetter').value.trim().toLowerCase();
            
            if (!encodedId || !keyLetter) {
                showToast('Por favor, completa todos los campos.', 'warning');
                return;
            }
            
            if (!/^[a-z]$/.test(keyLetter)) {
                showToast('La clave debe ser una sola letra minúscula (a-z).', 'warning');
                return;
            }
            
            const result = idManager.decodeID(encodedId, keyLetter);
            idManager.addDecodedID(encodedId, keyLetter, result);
            
            // Mostrar resultado
            const resultElement = document.getElementById('decodedResult');
            if (result.success) {
                resultElement.textContent = result.original;
                resultElement.className = 'generated-id';
                showToast('ID decodificado correctamente', 'success');
            } else {
                resultElement.textContent = `Error: ${result.error}`;
                resultElement.className = 'text-danger';
                showToast(`Error: ${result.error}`, 'danger');
            }
            
            // No limpiar formulario automáticamente para permitir múltiples pruebas
            idManager.saveFormState();
        });
        
        // Botón para copiar resultado decodificado
        document.getElementById('copyDecoded').addEventListener('click', function() {
            const resultText = document.getElementById('decodedResult').textContent;
            if (resultText && !resultText.includes('aparecerá aquí') && !resultText.includes('Error:')) {
                copyToClipboard(resultText, this);
            } else {
                showToast('No hay resultado para copiar', 'warning');
            }
        });
        
        // Botón para limpiar tabla de generados
        document.getElementById('clearTable').addEventListener('click', function() {
            idManager.clearGeneratedIDs();
        });
        
        // Botón para limpiar tabla de decodificados
        document.getElementById('clearDecodedTable').addEventListener('click', function() {
            idManager.clearDecodedIDs();
        });
        
        // Botón para generar ejemplo
        document.getElementById('generateExample').addEventListener('click', function() {
            // Establecer valores de ejemplo
            document.getElementById('year').value = '2026';
            document.getElementById('version').value = 'v2.0';
            document.getElementById('company').value = 'randstad';
            
            // Enviar formulario automáticamente
            document.getElementById('idForm').dispatchEvent(new Event('submit'));
            
            // Cambiar a la pestaña de generación si no está activa
            const encoderTab = document.getElementById('encoder-tab');
            if (!encoderTab.classList.contains('active')) {
                new bootstrap.Tab(encoderTab).show();
            }
        });
        
        // Generar un ejemplo al cargar la página si no hay datos
        window.addEventListener('load', function() {
            // Verificar si ya hay datos almacenados
            if (idManager.generatedIDs.length === 0) {
                // Solo generar ejemplo si no hay datos existentes
                setTimeout(() => {
                    document.getElementById('generateExample').click();
                }, 500);
            }
        });
        
        // Guardar estado al cerrar la página
        window.addEventListener('beforeunload', function() {
            idManager.saveAllData();
        });