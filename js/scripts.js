document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();

  // Escuchar todos los botones "Agregar al Carrito"
  var botonesAgregar = document.getElementsByClassName("agregar-carrito");

  for (var i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener("click", agregarProducto);
  }

  // Vaciar carrito
  document
    .getElementById("vaciar-carrito")
    .addEventListener("click", function () {
      localStorage.removeItem("carrito");
      cargarCarrito();
    });
});

// Agregar producto al carrito
function agregarProducto(event) {
  var id = event.target.getAttribute("data-id");
  var nombre = event.target.getAttribute("data-nombre");
  var precio = parseFloat(event.target.getAttribute("data-precio"));

  var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  var existente = carrito.find((p) => p.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

// Mostrar el carrito
function cargarCarrito() {
  var listaCarrito = document.getElementById("lista-carrito");
  listaCarrito.innerHTML = "";

  var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  var total = 0;

  carrito.forEach((producto) => {
    var li = document.createElement("li");
    li.innerHTML = `
      ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
      <button class="restar" data-id="${producto.id}">−</button>
      <button class="sumar" data-id="${producto.id}">+</button>
      <button class="eliminar" data-id="${producto.id}">Eliminar</button>
    `;
    listaCarrito.appendChild(li);

    total += producto.precio * producto.cantidad;
  });

  document.getElementById("total").textContent = "Total: $" + total;
  agregarEventosBotones();
}

// Asignar eventos a botones internos del carrito
function agregarEventosBotones() {
  var botonesRestar = document.querySelectorAll(".restar");
  var botonesSumar = document.querySelectorAll(".sumar");
  var botonesEliminar = document.querySelectorAll(".eliminar");

  botonesRestar.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      modificarCantidad(e, -1);
    });
  });

  botonesSumar.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      modificarCantidad(e, 1);
    });
  });

  botonesEliminar.forEach(function (btn) {
    btn.addEventListener("click", eliminarProducto);
  });
}

// Modificar cantidad del producto
function modificarCantidad(event, cambio) {
  var id = event.target.getAttribute("data-id");
  var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito = carrito.map(function (p) {
    if (p.id === id) {
      p.cantidad += cambio;
      if (p.cantidad < 1) p.cantidad = 1;
    }
    return p;
  });

  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

// Eliminar producto del carrito
function eliminarProducto(event) {
  var id = event.target.getAttribute("data-id");
  var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito = carrito.filter(function (p) {
    return p.id !== id;
  });

  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito();
}

//Finalizar compra

document
  .getElementById("finalizar-compra")
  .addEventListener("click", function () {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
      alert(
        "El carrito esta vacío. Agrega productos antes de finalizar la compra."
      );
      return;
    }

    let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    alert(`¡Gracias por tu compra! El total es $${total.toLocaleString()}.`);

    //Vaciar carrito después de la compra

    localStorage.removeItem("carrito");
    cargarCarrito();
  });
