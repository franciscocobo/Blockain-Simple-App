const SHA256 = require("crypto-js/sha256");
class Block { // unidad basica: el bloque
  constructor(index, timestamp, data, precedingHash = " ") {
    // TODO: Crear el constructor para el nuevo bloque (estructura de un bloque)
    this.index = index; // indice, valor incremental de 0 a N, cantidad de valores que hay en la cadena
    this.timestamp = timestamp; // fecha de creación del bloque
    this.data = data; // informacion (atributos) del bloque
    this.precedingHash = precedingHash; // el 'calculo' del bloque anterior
    this.hash = this.computeHash(); // calculo del hash (valor unico del bloque de acuerdo a los datos que tiene en su interior)
    this.nonce = 0; // numero aleatorio que se utiliza para encriptación/seguridad/proof of work (aporta seguridad al hash
    // ya que impide su replica de manera sencilla)
  }

  computeHash() {
    // TODO: Creamos un hash, el objetivo es el siguiente:
    // + a partir del hash no puedo llegar a la estructura del bloque
    // + si se cambia algun dato dentro de la estructura del bloque, el hash asociado cambia
    // Utilizamos el algoritmo de cifrado SHA256 y lo pasamos a formato texto para poder almacenarlo
    // Cada bloque tendrá un hash (calculo) diferente
    return SHA256(this.index +
      this.precedingHash +
      this.timestamp + 
      JSON.stringify(this.data) +
      this.nonce
      ).toString();

  }

  proofOfWork(difficulty) {
    // Objetivo: quedarse con el bloque 'que hace el mayor trabajo' para generar un hash adecuado
    // Cuanto mayor es la cadena, la dificultad va aumentando
    // Hay otro tipo de pruebas:
    // + proof of stake: (algoritmo de conseno) todos los nodos tienen participación para aprobar el nuevo bloque
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class Blockchain { // la cadena
  constructor() {
    // TODO: Crear el constructor para la nueva cadena.
    // En blockchain se guarda toda la cadena (en una red normnal seria un tipo de dato
    // mas complejo que un array de js)
    this.blockchain = [this.startGenesisBlock()];
    // difficulty: base de la dificultad del cálculo (en aumento para siguientes nodos)
    this.difficulty = 4;
  }
  startGenesisBlock() {
    // Bloque genesis: el primer bloque que existe en la cadena, punto de inicio
    return new Block(0, "01/01/2020", "Bloque inicial", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    // TODO: Agrega el nuevo bloque a la cadena
    // Muchos computadores a la vez intentan añadir bloques nuevos, necesitas
    // 'preguntar a la cadena' cual es el ultimo bloque
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    // Calculamos el hash en base al trabajo que debe hacer (este dato nos lo da la cadena)
    newBlock.proofOfWork(this.difficulty);
    // Añadir el nuevo bloque al array (el blockchain, la cadena)
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    // Comprobar validez cadena recorriendo los bloques de la cadena, verificando
    // que el hash previo de la cadena es igual al hash de ese bloque anterior
    // de esta forma se comprueba que la cadena no está corrupta
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let newBlockchain = new Blockchain();

// TODO: Agregar nuevos bloques
newBlockchain.addNewBlock(
  new Block(1, "06/05/2022", {
    sender: "Francisco Cobo",
    recipient: "Spiderman",
    quantity: 60
  })
);

newBlockchain.addNewBlock(
  new Block(2, "07/05/2022", {
    sender: "Spiderman",
    recipient: "Batman",
    quantity: 40
  })
);
  
// Imprimir por pantalla los datos
console.log(JSON.stringify(newBlockchain, null, 4));

// TODO: Verificar si nuestra cadena es válida
console.log(newBlockchain.checkChainValidity());