const peticion = document.createElement("dialog");
peticion.innerHTML = `<input id="search" type="number"/> <button id="searchBtn">Buscar índice</button> `;
document.getElementsByTagName("body")[0].appendChild(peticion);
peticion.close();
peticion.showModal();
const boton = document.getElementById("searchBtn");

boton.addEventListener("click", getData);

async function getData() {
	const response = await fetch(
		"https://servicios.ine.es/wstempus/jsCache/ES/DATOS_TABLA/50902",
	);
	const result = await response.json();

	const index = document.getElementById("search").value;
	if (!index) {
		return;
	}

	const datos = result[index];
	const contenedor = document.createElement("div");
	contenedor.innerHTML += `
    COD: ${datos.COD}<br>
    Nombre: ${datos.Nombre}<br>
    FK_Unidad: ${datos.FK_Unidad}<br>
    FK_Escala: ${datos.FK_Escala}<br>
    Notas: ${Array.isArray(datos.Notas) ? datos.Notas.join(", ") : (datos.Notas ?? "")}
  `;
	document.getElementsByTagName("body")[0].appendChild(contenedor);
}

/*
const result = await response.json();
	const datos1 = result[0].Data;

	for (const datos of datos1) {
		const contenedor = document.createElement("div");
		contenedor.innerHTML += `
        Fecha: ${datos.Fecha}<br>
        FK_TipoDato: ${datos.FK_TipoDato}<br>
        FK_Periodo: ${datos.FK_Periodo}<br>
        Anyo: ${datos.Anyo}<br>
        Valor: ${datos.Valor}<br>
          Secreto: ${datos.Secreto}<br><br>
      `;
		document.getElementsByTagName("body")[0].appendChild(contenedor);
	}
*/
