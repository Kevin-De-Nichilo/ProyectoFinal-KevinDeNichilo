// Molde
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
      this.imagen = imagen;
    }
  }
  
  // Productos
class BaseDeDatos {
  constructor() {
    // Array para el catálogo
    this.productos = [];
    this.cargarRegistros();
  }

async cargarRegistros(){
  const resultado = await fetch('/prods.json');
  this.productos = await resultado.json();
  console.log(this.productos);
  cargarProductos(this.productos);
}
  
// devuelve prod
  traerRegistros() {
    return this.productos;
  }
  
// devuelve prod segun id
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }
  
// devuelve array con coincidencias
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}
  
// Carrito
class Carrito {
  constructor() {
  // Storage
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
  // almacen de prod, array
    this.carrito = carritoStorage || [];
    this.total = 0; 
    this.cantidadProductos = 0; 
    this.listar();
  }
  
// Para saber si se encuentra en el carrito
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }
  
// Agregar al carrito
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }
    // Actualizo storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Muestro productos en HTML
    this.listar();
  }
  
// Quitar del carrito
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
// Actualizo storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Muestro productos en HTML
    this.listar();
  }
  
// Renderiza todos los productos en el HTML
  listar() {
// Reiniciamos variables
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
    // Recorro producto por producto del carrito, y los dibujo en el HTML
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h2>${producto.nombre}</h2>
          <p>$${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
        </div>
      `;
// Actualizamos totales
        this.total += producto.precio * producto.cantidad;
        this.cantidadProductos += producto.cantidad;
    }
      // Asigno eventos
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        // dataset
        const idProducto = Number(boton.dataset.id);
        // Llamo al método quitar pasándole el ID del producto
        this.quitar(idProducto);
      });
    }
    // Actualizo los contadores del HTML
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}
  
// Base de datos
const bd = new BaseDeDatos();
  
// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
  
// Instaciamos la clase Carrito
const carrito = new Carrito();
  
// Mostramos el catálogo
cargarProductos(bd.traerRegistros());
  
// Función para mostrar y renderizar productos del catálogo o buscador
function cargarProductos(productos) {
  // Vacíamos div
  divProductos.innerHTML = "";
  // Recorremos producto por producto y lo dibujamos en el HTML
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    `;
  }
  
  // Lista botones
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  
// Add onclick
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      // Evita el comportamiento default de HTML
      event.preventDefault();
      // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
      const idProducto = Number(boton.dataset.id);
      // Uso el metodo de la base de datos para ubicar el producto según el ID
      const producto = bd.registroPorId(idProducto);
      // Llama al metodo agregar del carrito
      carrito.agregar(producto);
    });
  }
}
  
  // Buscador
  inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
  });
  
  // Toggle para ocultar/mostrar el carrito
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  });