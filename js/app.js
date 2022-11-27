const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  // Validar formulario

  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    // Hubo un error
    mostrarError("Ambos campos son obligatorios");

    return;
  }
  // Consultando la API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    // Crear alerta
    const alerta = document.createElement("div");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "mx-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
  `;

    container.appendChild(alerta);

    // Se elimine la alerta despues de 3 segundos

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  const appID = "d67225e6692b993335edaca3e78e77f0";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

  Spinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHTML(); // Limpiar el HTML previo
      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");
        return;
      }

      // Imprime la respuesta en HTML
      mostrarClima(datos);
    });
}

function mostrarClima(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  const centigrados = KelvinACentigrados(temp);
  const max = KelvinACentigrados(temp_max);
  const min = KelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add("font-bold", "text-2xl");

  const actual = document.createElement("p");
  actual.innerHTML = `${centigrados} &#8451;`;
  actual.classList.add(("font-bold", "text-6xl"));
  const tempMax = document.createElement("p");
  tempMax.innerHTML = `Max: ${max} &#8451;`;
  tempMax.classList.add("text-xl");
  const tempMin = document.createElement("p");
  tempMin.innerHTML = `Min: ${min} &#8451;`;
  tempMin.classList.add("text-xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMax);
  resultadoDiv.appendChild(tempMin);

  resultado.appendChild(resultadoDiv);
}

const KelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");

  divSpinner.innerHTML = `
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
  `;
  resultado.appendChild(divSpinner);
}

const successCallback = (position) => {
  const {
    coords: { latitude, longitude },
  } = position;
  console.log(latitude, longitude);
};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
