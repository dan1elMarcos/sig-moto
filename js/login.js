import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "./config.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordGroup = document.getElementById("confirm-password-group");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorCtx = document.getElementById("error-message");
const mainButton = document.getElementById("main-button");
const formTitle = document.getElementById("form-title");
const toggleRegisterLoginLink = document.getElementById("toggle-register-login");
const toggleLoginRegisterLink = document.getElementById("toggle-login-register");

let isRegisterMode = false; // Estado para saber si estamos en modo registro o login

// Función para mostrar/ocultar spinner y deshabilitar botones
function setLoading(isLoading) {
  if (isLoading) {
    mainButton.classList.add("loading");
    mainButton.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;
    confirmPasswordInput.disabled = true;
    toggleRegisterLoginLink.style.pointerEvents = "none";
    toggleLoginRegisterLink.style.pointerEvents = "none";
  } else {
    mainButton.classList.remove("loading");
    mainButton.disabled = false;
    emailInput.disabled = false;
    passwordInput.disabled = false;
    confirmPasswordInput.disabled = false;
    toggleRegisterLoginLink.style.pointerEvents = "auto";
    toggleLoginRegisterLink.style.pointerEvents = "auto";
  }
}

// Alternar entre modo de registro y login
toggleRegisterLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  isRegisterMode = true;
  formTitle.textContent = "Registrar Cuenta";
  mainButton.innerHTML = `Registrarse <span class="loading-spinner"></span>`;
  confirmPasswordGroup.style.display = "block";
  toggleRegisterLoginLink.parentElement.style.display = "none";
  toggleLoginRegisterLink.parentElement.style.display = "block";
  errorCtx.textContent = ""; // Limpiar mensajes de error
});

toggleLoginRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  isRegisterMode = false;
  formTitle.textContent = "Iniciar Sesión";
  mainButton.innerHTML = `Iniciar Sesión <span class="loading-spinner"></span>`;
  confirmPasswordGroup.style.display = "none";
  toggleRegisterLoginLink.parentElement.style.display = "block";
  toggleLoginRegisterLink.parentElement.style.display = "none";
  errorCtx.textContent = ""; // Limpiar mensajes de error
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(true);
  
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value; // Solo relevante en modo registro
  
  errorCtx.textContent = ""; 
  errorCtx.style.color = "#ef5350"; // Color rojo para errores

  try {
    if (isRegisterMode) {
      // Lógica de REGISTRO
      if (!email || !password || (isRegisterMode && !confirmPassword)) {
        errorCtx.textContent = "Por favor, llene todos los campos.";
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        errorCtx.textContent = "La contraseña debe tener al menos 6 caracteres por seguridad.";
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        errorCtx.textContent = "Las contraseñas no coinciden.";
        setLoading(false);
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      errorCtx.style.color = "#81c784"; // Color verde para éxito
      errorCtx.textContent = "¡Cuenta creada con éxito! Redirigiendo...";
      
      setTimeout(() => {
        window.location.href = "principal.html";
      }, 1500);

    } else {
      // Lógica de INICIO DE SESIÓN
      if (!email || !password) {
        errorCtx.textContent = "Por favor, ingrese su correo y contraseña.";
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      // Inicio de sesión correcto -> Redirige al panel de control
      window.location.href = "principal.html";
    }
  } catch (error) {
    console.error("Error de autenticación:", error.code);
    let errorMessage = "Error al procesar su solicitud. Inténtelo de nuevo.";

    switch (error.code) {
      case "auth/invalid-credential":
        errorMessage = "Correo o contraseña incorrectos. Verifique sus datos.";
        break;
      case "auth/missing-password":
        errorMessage = "Por favor, ingrese su contraseña.";
        break;
      case "auth/invalid-email":
        errorMessage = "El formato del correo electrónico no es válido.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "Este correo electrónico ya está registrado en el sistema.";
        break;
      case "auth/weak-password":
        errorMessage = "La contraseña es muy débil. Use una combinación más compleja.";
        break;
      case "auth/user-not-found":
        errorMessage = "No se encontró ningún usuario con este correo electrónico.";
        break;
      case "auth/wrong-password":
        errorMessage = "Contraseña incorrecta.";
        break;
      default:
        errorMessage = "Error inesperado. Inténtelo de nuevo o contacte a soporte.";
    }
    errorCtx.textContent = errorMessage;
  } finally {
    if (!errorCtx.textContent.includes("éxito")) { // No quitar spinner si hay mensaje de éxito para la redirección
        setLoading(false);
    }
  }
});
