/*
 * Modelo
 */
const Modelo = function() {
	this.preguntas = [];
	//this.ultimoId = 0;

	//inicializacion de eventos
	this.preguntaAgregada = new Evento(this);
	//agrego los nuevos eventos
	this.preguntaEditada = new Evento(this);
	this.preguntaEliminada = new Evento(this);
	this.votoAgregado = new Evento(this);
	this.preguntasBorradas = new Evento(this);

	this.restartLocalStorage();
};

Modelo.prototype = {
	//se obtiene el id más grande asignado a una pregunta Guía 1 paso 2 agregar pregunta
	obtenerUltimoId: function() {
		let maxId = -1;
		for (let i = 0; i < this.preguntas.length; ++i) {
			if (this.preguntas[i].id > maxId) maxId = this.preguntas[i].id;
		}
		return maxId;
	},

	//se agrega una pregunta dado un nombre y sus respuestas
	agregarPregunta: function(nombre, respuestas) {
		let id = this.obtenerUltimoId();
		id++;
		let nuevaPregunta = { textoPregunta: nombre, id: id, cantidadPorRespuesta: respuestas };
		this.preguntas.push(nuevaPregunta);
		this.guardar();
		this.preguntaAgregada.notificar();
	},

	// Guía 1 paso 3 borrar de a una
	borrarPregunta: function(id) {
		this.preguntas = this.preguntas.filter(function(pregunta) {
			return pregunta.id != id;
		});
		this.guardar();
		this.preguntaEliminada.notificar();
	},

	//Guía 2 paso 1 funcionalidades Editar
	editarPregunta: function(id, nuevaPregunta) {
		var preguntaAReemplazar = this.obtenerPregunta(id);
		preguntaAReemplazar.textoPregunta = nuevaPregunta;

		var preguntaAModificar = this.preguntas.splice(
			this.preguntas.indexOf(this.obtenerPregunta(id)),
			1,
			preguntaAReemplazar
		);
		this.guardar();
		this.preguntaEditada.notificar();
	},

	//Guía 2 paso 1 funcionalidades borrar todo
	borrarPreguntas: function() {
		this.preguntas = [];
		this.reiniciarLocalStorage();
		this.preguntasBorradas.notificar();
	},

	obtenerPregunta: function(valor) {
		var identificador;
		if (typeof valor == 'number') {
			identificador = 'id';
		} else {
			identificador = 'textoPregunta';
		}
		for (var i = 0; i < this.preguntas.length; ++i) {
			if (this.preguntas[i][identificador] === valor) {
				return this.preguntas[i];
			}
		}
		throw new Error('La pregunta no está definida');
	},

	//se agrega un voto
	agregarVoto: function(pregunta, respuesta) {
		for (var i = 0; i < pregunta.cantidadPorRespuesta.length; ++i) {
			if (pregunta.cantidadPorRespuesta[i].textoRespuesta === respuesta) {
				var indicePregunta = -1;
				for (var j = 0; j < this.preguntas.length; ++j) {
					if (this.preguntas[j].textoPregunta === pregunta.textoPregunta) {
						indicePregunta = j;
					}
				}
				pregunta.cantidadPorRespuesta[i].cantidad += 1;
				this.preguntas.splice(indicePregunta, 1, pregunta);
			}
		}
		this.guardar();
		this.votoAgregado.notificar();
	},

	//Guía 2 paso 2 Incorporando LocalStorage
	restartLocalStorage: function() {
		if (localStorage.getItem('preguntas') !== null) {
			this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
		}
	},

	reiniciarLocalStorage: function() {
		localStorage.setItem('preguntas', JSON.stringify([]));
	},

	guardar: function() {
		localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
	}
};
