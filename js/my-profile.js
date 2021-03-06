// Data-URL de la nueva imagen obtenida
let userImgAsDataURL = "";

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

	// Muestra automáticamente como placeholder el nombre de usuario en el campo Nombre
	let userLogged = localStorage.getItem("eCommerce-User-Logged");
	if (userLogged) {
		document.getElementById("userName").placeholder = JSON.parse(userLogged).name;
	}

	// Muestra automáticamente los datos gardados en localStorage.
	let userProfile = localStorage.getItem("eCommerce-User-Profile");
	if (userProfile) {
		let profile = JSON.parse(userProfile);
		if (profile.img != "") {
			document.getElementById("userImg").src = profile.img;
		}
		document.getElementById("userName").value = profile.name;
		document.getElementById("userLastName").value = profile.lastName;
		document.getElementById("userAge").value = profile.age;
		document.getElementById("userEmail").value = profile.email;
		document.getElementById("userPhone").value = profile.phone;
	}

	// Guarda los datos en localStorage.
	document.getElementById('profile-info').addEventListener('submit', function (e) {
		try {
			localStorage.setItem("eCommerce-User-Profile", JSON.stringify({
				img: userImgAsDataURL,
				name: userName.value,
				lastName: userLastName.value,
				age: userAge.value,
				email: userEmail.value,
				phone: userPhone.value
			}));
			saveProfile.classList.remove('btn-primary');
			saveProfile.classList.remove('btn-danger');
			saveProfile.classList.add('btn-success');
			saveProfile.value = "Cambios guardados";
		}
		catch (err) {
			console.log("Storage failed: " + err);
			saveProfile.classList.remove("btn-primary");
			saveProfile.classList.remove("btn-success");
			saveProfile.classList.add("btn-danger");
			saveProfile.value = "Error al guardadar";
		}

		// Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
		if (e.preventDefault) e.preventDefault();
		return false;
	});

	// Obtiene la Data-URL de la imagen desde un link de recurso compartido
	document.getElementById('setImg').addEventListener('click', function () {
		let urlImg = document.getElementById("urlImg");
		let setImg = document.getElementById("setImg");

		// Establece a estado inicial
		urlImg.classList.remove("is-invalid");
		urlImg.classList.remove("is-valid");
		setImg.classList.remove("btn-success");
		setImg.classList.remove("btn-danger");
		setImg.classList.add("btn-primary");
		setImg.innerHTML = "Cambiar";

		if (urlImg.value != "" && urlImg.validity.valid) {
			// Obtiene un archivo a través de XMLHttpRequest como un búfer de matriz y crear un Blob
			// Crea objetos XHR, Blob y FileReader
			let xhr = new XMLHttpRequest(),
				blob,
				fileReader = new FileReader();

			xhr.open("GET", urlImg.value, true);
			xhr.responseType = "arraybuffer";
			xhr.onprogress = function () {
				setImg.innerHTML = "Procesando..."
			};
			xhr.addEventListener("load", function () {
				if (xhr.status === 200) {
					// Crea una blob a partir de la respuesta
					blob = new Blob([xhr.response], { type: "image/png" });

					// onload necesario ya que Google Chrome no es compatible con addEventListener para FileReader
					fileReader.onload = function (evt) {
						// Lee el contenido del archivo como una Data-URL
						var result = evt.target.result;
						// Crea artributo src con la Data-URL de la imagen
						document.getElementById("userImg").setAttribute("src", result);
						userImgAsDataURL = result;
						urlImg.classList.add("is-valid");
						setImg.classList.add("btn-success");
					};
					// Carga un blob como Data-URL
					fileReader.readAsDataURL(blob);

					setImg.innerHTML = "Cambiar";
				}
			}, false);
			// Alerta de error
			xhr.onerror = function () {
				urlImg.classList.add("is-invalid");
				setImg.classList.add("btn-danger");
			};
			// Envia XHR
			xhr.send();
		} else {
			urlImg.classList.add("is-invalid");
			setImg.classList.add("btn-danger");
		}
	});
});