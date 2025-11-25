// error-handler.js - Manejador global de errores para Vestis Store

// Capturar errores no manejados
window.addEventListener('error', function(event) {
    console.error('Error global capturado:', event.error);
    
    // Redirigir a página de error
    const errorMsg = encodeURIComponent(event.error?.message || 'Error desconocido');
    window.location.href = `error.html?type=500&msg=${errorMsg}`;
});

// Capturar promesas rechazadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesa rechazada:', event.reason);
    
    // Determinar tipo de error
    let errorType = '500';
    let errorMsg = event.reason?.message || 'Error en operación asíncrona';
    
    if (errorMsg.includes('auth')) {
        errorType = 'auth';
    } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        errorType = 'network';
    } else if (errorMsg.includes('firebase') || errorMsg.includes('firestore')) {
        errorType = 'firebase';
    }
    
    window.location.href = `error.html?type=${errorType}&msg=${encodeURIComponent(errorMsg)}`;
});

// Función para manejar errores de Firebase específicos
function handleFirebaseError(error) {
    console.error('Error de Firebase:', error);
    
    const errorMessages = {
        'permission-denied': 'No tienes permisos para realizar esta acción',
        'not-found': 'El recurso solicitado no existe',
        'already-exists': 'Este recurso ya existe',
        'unauthenticated': 'Debes iniciar sesión para continuar',
        'unavailable': 'El servicio no está disponible temporalmente'
    };
    
    const message = errorMessages[error.code] || error.message;
    
    return {
        type: 'firebase',
        message: message
    };
}

// Función para verificar conexión
async function checkConnection() {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
}

// Función para mostrar toast de error (opcional)
function showErrorToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Agregar animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Exportar funciones para uso en otros scripts
window.errorHandler = {
    handleFirebaseError,
    checkConnection,
    showErrorToast
};

console.log('✅ Sistema de manejo de errores cargado');