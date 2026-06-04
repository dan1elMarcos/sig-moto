import { 
  auth, db, signOut, onAuthStateChanged, 
  collection, addDoc, getDocs 
} from "./config.js";

const tbody = document.getElementById("tabla-motos-body");
const registroForm = document.getElementById("registro-moto-form");
const userDisplay = document.getElementById("user-display");

// 1. Proteger la ruta: Comprobar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Operador: ${user.email}`;
    cargarMototaxis(); // Cargar los registros existentes de la BD
  } else {
    window.location.href = "index.html"; // Echar al login si no hay sesión
  }
});

// 2. Función para generar la matrícula automática de Guatemala (Serie M)
function generarMatriculaGuatemala() {
  // Formato estándar: M [3 Dígitos aleatorios] [3 Letras aleatorias]
  // Ejemplo: M 139 DWC
  const digitos = Math.floor(100 + Math.random() * 900); // 100 a 999
  
  const letrasPermitidas = "BCDFGHJKLMNPQRSTVWXYZ"; // Excluyendo vocales comúnmente para evitar malas palabras
  let letras = "";
  for (let i = 0; i < 3; i++) {
    letras += letrasPermitidas.charAt(Math.floor(Math.random() * letrasPermitidas.length));
  }
  
  return `M ${digitos} ${letras}`;
}

// 3. Manejar el envío del formulario para guardar en Firebase NoSQL
registroForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Generar la matrícula única bajo el Acuerdo Gubernativo 111-95 (Serie M)
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
    // Almacenar en la colección "mototaxis" de Cloud Firestore
    await addDoc(collection(db, "mototaxis"), nuevoMototaxi);
    alert(`¡Unidad registrada exitosamente!\nPlaca Asignada: ${placaGenerada}`);
    registroForm.reset();
    cargarMototaxis(); // Recargar la tabla
  } catch (error) {
    console.error("Error al guardar en Firebase:", error);
    alert("Hubo un error al guardar la información en la base de datos.");
  }
});

// 4. Renderizar datos desde Cloud Firestore a la tabla HTML
async function cargarMototaxis() {
  tbody.innerHTML = ""; // Limpiar tabla
  try {
    const querySnapshot = await getDocs(collection(db, "mototaxis"));
    
    if(querySnapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No hay unidades registradas en el sistema.</td></tr>`;
        return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
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
  } catch (error) {
    console.error("Error obteniendo documentos: ", error);
  }
}

// 5. Cierre de sesión
document.getElementById("btn-logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});