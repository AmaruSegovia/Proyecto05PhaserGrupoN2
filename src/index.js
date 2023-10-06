const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "container",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
    },
  },
};

const game = new Phaser.Game(config);

let nave;
let proyectiles;
let enemigos;
let cursors;
let spaceKey;
let puntaje = 0;
let puntajeText;
let fondo; 
let velocidadEscenario = 1; 
let particle1;
let particle2;
function preload() {
  console.log("Cargando imágenes");
  this.load.spritesheet("nave", "/public/img/nave.png", {
    frameWidth: 70,
    frameHeight: 62,
  });
  this.load.image("proyectil", "/public/img/shoot.png");
  this.load.image("proyectilEnemigo", "/public/img/shootEnemy.png");
  this.load.image("enemigo", "/public/img/enemy.png"); 
  this.load.image("fondo", "/public/img/fondito.jpg"); 
  this.load.image("particles", "/public/img/red.png");
}

function create() {
  // Crea el fondo del escenario y lo hace un tileSprite para que se repita
  fondo = this.add.tileSprite(0, 0, 800, 600, "fondo");
  fondo.setOrigin(0, 0);

  particle1 = this.add.particles(-20, -10, "particles", {
	speed: 150,
	quantity: 20,
	angle: {
	  min: 170,
	  max: 190,
	},
	scale: { start: 0.6, end: 0 },
	blendMode: "ADD",
      });
      particle2 = this.add.particles(-20, 10, "particles", {
	speed: 150,
	quantity: 20,
	angle: {
	  min: 170,
	  max: 190,
	},
	scale: { start: 0.6, end: 0 },
	blendMode: "ADD",
      });

  // Crea el personaje
  nave = this.physics.add.sprite(100, 300, "nave");
  nave.setCollideWorldBounds(true);
  particle2.startFollow(nave);
  particle1.startFollow(nave);
  

  // Creando las partículas
 

  //particles.startFollow(this.nave);

  /*  emisor = this.add.particles('red').createEmitter(
        {
            x: nave.x,
            y: nave.y,
            speed: {
                min: 30,
                max: 60
            },
            scale: {
                start: 1,
                end: 2
            },
            blendMode: 'ADD'
        }
    ) */

  // Crea las animaciones del personaje
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 2,
      end: 2,
    }),
    framesRate: 10,
  });
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 0,
      end: 0,
    }),
    framesRate: 10,
  });
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 1,
      end: 1,
    }),
    framesRate: 10,
  });

  // Crea un grupo para los proyectiles de la nave
  proyectiles = this.physics.add.group();

  // Crea un grupo para los proyectiles de la nave
  proyectilesEnemigos = this.physics.add.group();

  // Crea un grupo para los enemigos
  enemigos = this.physics.add.group();

  // Configura las teclas de movimiento
  cursors = this.input.keyboard.createCursorKeys();
  this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  this.downKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.DOWN
  );

  // Configura la tecla de espacio para disparar
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Configura el texto del puntaje
  puntajeText = this.add.text(16, 16, "Puntaje: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  // Configura un temporizador para crear enemigos
  this.time.addEvent({
    delay: 2000, 
    callback: generarEnemigo,
    callbackScope: this,
    loop: true, 
  });

  // Agrega una colisión entre proyectiles y enemigos
  this.physics.add.collider(proyectiles, enemigos, (proyectil, enemigo) => {
    proyectil.destroy(); 
    enemigo.destroy();
    puntaje += 10; 
    puntajeText.setText("Puntaje: " + puntaje); 
  });
}

function update() {
//   particles.x = nave.x - 20;
//   particles.y = nave.y;

  fondo.tilePositionX += velocidadEscenario;


  if (cursors.right.isDown) {
    nave.setVelocityX(200);
  } else if (cursors.left.isDown) {
    nave.setVelocityX(-200);
  } else {
    nave.setVelocityX(0);
    nave.anims.play("idle");
  }

  
  if (this.upKey.isDown) {
    nave.setVelocityY(-200);
    nave.anims.play("up", true);
  } else if (this.downKey.isDown) {
    nave.setVelocityY(200);
    nave.anims.play("down", true);
  } else {
    nave.setVelocityY(0);
    nave.anims.play("idle");
  }
  if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    dispararProyectil();
  }
}

function dispararProyectil() {
  const proyectil = proyectiles.create(nave.x, nave.y, "proyectil");
  proyectil.setVelocityX(400); 
}

function dispararProyectilEnemigo() {
  const proyectilEnemigo = proyectiles.create(
    "proyectilEnemigo"
  );
  proyectilEnemigo.setVelocityX(-400);
}

function generarEnemigo() {
  const x = 800; 
  const y = Phaser.Math.Between(100, 500); 
  const enemigo = enemigos.create(x, y, "enemigo"); 
  enemigo.setVelocityX(-100); 
}
