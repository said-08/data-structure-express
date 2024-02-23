import Tree from "../models/Tree";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Función para imprimir un nodo de un árbol binario
function insertNode(root, value) {
  if (!root) {
    return new TreeNode(value);
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else {
    root.right = insertNode(root.right, value);
  }

  return root;
}

// Función para construir un árbol binario a partir de un array de números
function constructBinaryTree(numbers) {
  if (!numbers || numbers.length === 0) {
    return null;
  }

  let root = null;
  for (const num of numbers) {
    root = insertNode(root, num);
  }

  return root;
}

function printTree(root, space = 0, count = 5) {
  if (!root) {
    return;
  }

  space += count;

  // Imprimir el subárbol derecho
  printTree(root.right, space);

  // Imprimir el nodo actual
  console.log(" ".repeat(space - count) + root.value);

  // Imprimir el subárbol izquierdo
  printTree(root.left, space);
}

// Función para manejar la inserción de un nuevo nodo en el árbol
async function addNode(req, res) {
  try {
    console.time("Tiempo de visualización en añadir el nodo");
    const numberReq = req.body.number;
    const newNode = new Tree({ number: Number(numberReq) });
    // Construye el árbol binario a partir de los valores encontrados
    await newNode.save();
    const treeNodes = await Tree.find().lean();
    const numberos = treeNodes.map(node => node.number);
    const root = constructBinaryTree(numberos);
    printTree(root);
    console.timeEnd("Tiempo de visualización en añadir el nodo");
  } catch (error) {
    console.error('Error al insertar el nodo:', error);
    res.status(500).json({ error: 'Ocurrió un error al insertar el nodo' });
  }
}

// Función para manejar la búsqueda de un nodo en el árbol
async function searchNode(req, res) {
  try {
    const { number } = req.params;
    const node = await Tree.findOne({ number });
    if (node) {
      res.status(200).json({ message: 'Nodo encontrado', node });
    } else {
      res.status(404).json({ message: 'Nodo no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el nodo:', error);
    res.status(500).json({ error: 'Ocurrió un error al buscar el nodo' });
  }
}

// Función para manejar la eliminación de un nodo del árbol
async function deleteNode(req, res) {
  try {
    console.time("Tiempo de visualización en mostrar la lista nueva");
    const { number } = req.body;
    const deletedNode = await Tree.findOneAndDelete({ number });
    const treeNodes = await Tree.find().lean();
    const numberos = treeNodes.map(node => node.number);
    const root = constructBinaryTree(numberos);
    if (deletedNode) {
      console.log("eliminado correctamente", number)
      printTree(root);
      console.timeEnd("Tiempo de visualización en mostrar la lista nueva");
      res.status(200);
    } else {
      res.status(404).json({ message: 'Nodo no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el nodo:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el nodo' });
  }
}

export { addNode, searchNode, deleteNode };