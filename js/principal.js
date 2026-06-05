
// 1. Importamos las funciones correctas de Realtime Database desde config.js
import { 
  auth, db, signOut, onAuthStateChanged, 
  ref, push, set, onValue 
} from "./config.js";

const tbody = document.getElementById("tabla-motos-body");
const registroForm = document.getElementById("registro-moto-form");
const userDisplay = document.getElementById("user-display");

// Proteger la ruta: Comprobar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Operador: ${user.email}`;
    cargarMototaxisRealtime(); // Activamos la escucha en tiempo real
  } else {
    window.location.href = "index.html"; 
  }
});

// 2. Función para generar la matrícula automática de Guatemala (Serie M)
function generarMatriculaGuatemala() {
  const digitos = Math.floor(100 + Math.random() * 900); // 100 a 999
  const letrasPermitidas = "BCDFGHJKLMNPQRSTVWXYZ"; 
  let letras = "";
  for (let i = 0; i < 3; i++) {
    letras += letrasPermitidas.charAt(Math.floor(Math.random() * letrasPermitidas.length));
  }
  return `M ${digitos} ${letras}`;
}

// 3. Manejar el envío del formulario - FUSIONADO CON REALTIME DATABASE
registroForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const placaGenerada = generarMatriculaGuatemala();

  const nuevoMototaxi = {
    propietario: {
      nombre: document.getElementById("nombre-prop").value,
      dpi: document.getElementById("dpi-prop").value,
      domicilio: document.getElementById("domicilio-prop").value
    },
    vehiculo: {
      modelo: document.getElementById("modelo-moto").value,
      color: document.getElementById("color-moto").value,
      seguro: document.getElementById("seguro-moto").value,
      codigoUnico: placaGenerada,
      municipio: document.getElementById("municipio").value,
    },
    fechaRegistro: new Date().toISOString()
  };

  try {
    // Apuntamos al nodo 'mototaxis' en Realtime Database
    const mototaxisRef = ref(db, "mototaxis");
    // Generamos un ID único en el nodo
    const nuevoNodoRef = push(mototaxisRef);
    
    // Guardamos el objeto utilizando set()
    await set(nuevoNodoRef, nuevoMototaxi);

    alert(`¡Unidad registrada exitosamente!\nPlaca Asignada: ${placaGenerada}`);
    registroForm.reset();
    // Ya no hace falta llamar manualmente a cargarMototaxis() porque onValue lo hace solo!
  } catch (error) {
    console.error("Error al guardar en Realtime Database:", error);
    alert("Hubo un error al guardar la información en la base de datos.");
  }
});

// 4. Renderizar datos usando onValue (Escucha activa en tiempo real)
function cargarMototaxisRealtime() {
  const mototaxisRef = ref(db, "mototaxis");

  // onValue se ejecuta inmediatamente y se vuelve a disparar CADA VEZ que alguien agregue una moto
  onValue(mototaxisRef, (snapshot) => {
    tbody.innerHTML = ""; // Limpiar tabla de filas viejas

    if (!snapshot.exists()) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No hay unidades registradas en el sistema.</td></tr>`;
        return;
    }

    // Iteramos los hijos del nodo 'mototaxis'
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.value(); // Obtenemos el objeto del mototaxi
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><span class="badge-placa">${data.vehiculo.codigoUnico}</span></td>
        <td>${data.propietario.nombre}</td>
        <td>${data.propietario.dpi}</td>
        <td>${data.vehiculo.modelo} - ${data.vehiculo.color}</td>
        <td>${data.vehiculo.seguro}</td>
        <td>${data.vehiculo.municipio}</td>
      `;
      tbody.appendChild(tr);
    });
  }, (error) => {
    console.error("Error obteniendo datos en tiempo real: ", error);
  });
}

// 5. Cierre de sesión
document.getElementById("btn-logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});