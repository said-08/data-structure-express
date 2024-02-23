import User from '../models/User'

class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

let listaEnlazada = null;

function mostrarListaEnlazada(listaEnlazada) {
  let current = listaEnlazada;
  console.log("Lista enlazada creada desde MongoDB:");
  while (current) {
    console.log(current.data);
    current = current.next;
  }
}

export const getUsers = async(req, res) => {

  try {
    const users = await User.find().lean()
    // Crea la lista enlazada
    users.forEach(usuario => {
      const nodo = new ListNode(usuario);
      nodo.next = listaEnlazada;
      listaEnlazada = nodo;
    });

    // Muestra la lista enlazada por consola
    console.time("Tiempo de visualización en traer a los parceros");
    mostrarListaEnlazada(listaEnlazada);
    console.timeEnd("Tiempo de visualización en traer a los parceros");
    res.render('partials/index', { users: users })
  } catch (error) {
    console.error('Error al obtener los primeros veinte documentos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

export const postUser = async(req, res) => {
  
  const user = new User(req.body);
  try {

    // Crea un nodo para el nuevo usuario
    const nodo = new ListNode(req.body);

    // Conecta el nuevo nodo al principio de la lista enlazada
    console.time("Tiempo de visualización en añadir al parcero");
    nodo.next = listaEnlazada;
    listaEnlazada = nodo;

    mostrarListaEnlazada(listaEnlazada);
    console.timeEnd("Tiempo de visualización en añadir al parcero");
    const savedUser = await user.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

export const deleteUser = async (req, res, next) => {

  try {
    const { id } = req.params;

    // Convertir id a un ObjectId
    const objectId = id.toString();
    await User.findByIdAndDelete(id);

    // Manejar el caso especial si la lista enlazada está vacía
    if (!listaEnlazada) {
      console.error("Error: La lista enlazada está vacía.");
      return;
    }

    let nodoActual = listaEnlazada;
    console.log(nodoActual.data._id.toString(),objectId)

    if (nodoActual.data._id.toString() === objectId) {
      listaEnlazada = nodoActual.next;
      console.log("Usuario eliminado de la lista enlazada:", nodoActual.data);
      nodoActual.next = null;
      nodoActual.data = null;
      // mostrarListaEnlazada(listaEnlazada);
      return;
    }
    while (nodoActual.next !== null) {
      if (nodoActual.next.data._id.toString() === objectId) {
        const nodoAEliminar = nodoActual.next;
        nodoActual.next = nodoAEliminar.next;
        console.log("Usuario eliminado de la lista enlazada:-->", nodoAEliminar.data);
        nodoAEliminar.next = null;
        nodoAEliminar.data = null;
      // mostrarListaEnlazada(listaEnlazada);
        return;
      }
      nodoActual = nodoActual.next;
    }

    if (nodoActual.next === null) {
      console.error("Error: El usuario no se encuentra en la lista enlazada.",nodoActual.data,objectId);
      return;
    }

    // // Mostrar la lista enlazada actualizada por consola
    // console.log("Usuario eliminado de la lista enlazada:");
    // mostrarListaEnlazada(listaEnlazada);

    res.redirect("/");
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
  
};
