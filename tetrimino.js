function crearTetriminos() {
  //Variable global, es un objeto padre con 7 objetos anidados que representan los tetriminos.    
  tetriminosBase = {    //Sin LET, VAR, CONST para que sea completamente global. 
    
    // Cada createVector representa un pixel, no dos. Los valores determinan su ubicación.
    // PRIMER VALOR: EJE X 
    //SEGUNDO VALOR: EJE Y
    
    T1: {
      color: "red",
      mapa: [
        createVector(), //BASE
        createVector(-1, -1), //PIXEL IZQUIERDO. -1 INDICA QUE SE MUEVE UN PIXEL HACIA LA IZQUIERDA Y HACIA ARRIBA CON RESPECTO A LA BASE.  
        createVector(0, -1), //PIXEL ENCIMA DEL BASE, MANTIENE MISMA POSICIÓN EN EL EJE X, PERO UNO POR ENCIMA EN EL Y.
        createVector(1, 0), //PIXEL DERECHO, MANTIENE POSICION EN EL EJE Y, PERO UNO HACIA LA DERECHA EN EL EJE X.
      ],
    },

    T2: {
      color: "blue",
      mapa: [
        createVector(),
        createVector(1, -1),
        createVector(0, -1),
        createVector(-1, 0),
      ],
    },

    T3: {
      color: "orange",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(-1, -1),
        createVector(1, 0),
      ],
    },

    T4: {
      color: "gold",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },

    T5: {
      color: "magenta",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(0, -1),
      ],
    },

    T6: {
      color: "yellow",
      mapa: [
        createVector(),
        createVector(0, -1),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },

    T7: {
      color: "cyan",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(2, 0),
      ],
    },
  };
}


class Tetrimino {
    constructor(nombre = random(["T1", "T2", "T3", "T4", "T5", "T6", "T7"])) {
      this.nombre = nombre;
      let base = tetriminosBase[nombre];
      this.color = base.color;
      this.mapa = [];
      for (const pmino of base.mapa) {
        this.mapa.push(pmino.copy());
      }
      this.posición = createVector(int(tablero.columnas / 2), -1);
    }
  
    moverDerecha() {
      this.posición.x++;
      if (this.movimientoErroneo) {
        this.moverIzquierda();
      }
    }
  
    moverIzquierda() {
      this.posición.x--;
      if (this.movimientoErroneo) {
        this.moverDerecha();
      }
    }
  
    moverAbajo() {
      this.posición.y++;
      if (this.movimientoErroneo) {
        this.moverArriba();
        if (tetrimino == this) {
          tablero.almacenarMino = this;
          tetrimino = new Tetrimino();
        }
        return false
      }
      return true
    }
  
    moverArriba() {
      this.posición.y--;
    }
  
    ponerEnElFondo(){
      this.posición = this.espectro.posición
      this.moverAbajo()
    }
  
    girar() {
      for (const pmino of this.mapa) {
        pmino.set(pmino.y, -pmino.x);
      }
      if (this.movimientoErroneo) {
        this.desgirar();
      }      
    }

    
  
    desgirar() {
      for (const pmino of this.mapa) {
        pmino.set(-pmino.y, pmino.x);
      }
    }


    
    get movimientoErroneo() {
      let salióDelTablero = !this.estáDentroDelTablero;
      return salióDelTablero || this.colisiónConMinosAlmacenados;
    }
  
    get colisiónConMinosAlmacenados() {
      for (const pmino of this.mapaTablero) {
        if (tablero.minosAlmacenados[pmino.x][pmino.y]) {
          return true;
        }
      }
      return false;
    }
  
    get estáDentroDelTablero() {
      for (const pmino of this.mapaTablero) {
        if (pmino.x < 0) {
          //Evita salida por izquierda
          return false;
        }
        if (pmino.x >= tablero.columnas) {
          //Evita salida por derecha
          return false;
        }
        if (pmino.y >= tablero.filas) {
          //Evita salida por abajo
          return false;
        }
      }
      return true;
    }
  
    get mapaTablero() {
      let retorno = [];
      for (const pmino of this.mapa) {
        let copy = pmino.copy().add(this.posición);
        retorno.push(copy);
      }
      return retorno;
    }
  
    get mapaCanvas() {
      let retorno = [];
      for (const pmino of this.mapa) {
        let copy = pmino.copy().add(this.posición);
        retorno.push(tablero.coordenada(copy.x, copy.y));
      }
      return retorno;
    }
  
    /* 
       Esta función se encargará del procesamiento lógico del dibujado de
       este objeto
       */
    dibujar() {
      push();
      fill(this.color);
      for (const pmino of this.mapaCanvas) {
        Tetrimino.dibujarMino(pmino);
      }
      pop();
      if (tetrimino == this) {
        this.dibujarEspectro();
      }
    }
  
    dibujarEspectro() {
      this.espectro = new Tetrimino(this.nombre);
      this.espectro.posición = this.posición.copy()
      for (let i = 0; i < this.mapa.length; i++) {
        this.espectro.mapa[i] = this.mapa[i].copy()
      }
      while (this.espectro.moverAbajo());
      push()
      drawingContext.globalAlpha = 0.3
      this.espectro.dibujar();
      pop()
    }
  
    static dibujarMino(pmino) {
      rect(pmino.x, pmino.y, tablero.lado_celda);
      push();
      noStroke();
      fill(255, 255, 255, 80);
      beginShape();
      vertex(pmino.x, pmino.y);
      vertex(pmino.x + tablero.lado_celda, pmino.y);
      vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
      endShape(CLOSE);
      beginShape();
      fill(0, 0, 0, 80);
      vertex(pmino.x, pmino.y);
      vertex(pmino.x, pmino.y + tablero.lado_celda);
      vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
      endShape(CLOSE);
      pop();
    }
  }
  
  
  
  
  
    
  


  
  