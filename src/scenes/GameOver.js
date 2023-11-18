import RestartButton from "../componentes/reset-button.js";

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    init(data){
        this.puntajeFinal = data.puntajeFinal;  // Toma el puntaje de la escena anterior
        this.button = new RestartButton(this);  // Crea un obj de tipo button
    }

    preload(){
        this.load.image('gameover-screen', '/public/img/gameover-screen.jpeg');
        this.button.preload(); 
    }

    create(){
        this.add.image(400, 300, 'gameover-screen');
        this.button.create();

        this.puntuacionFinalText = this.add.text(160, 300, "Puntaje final: "+ this.puntajeFinal, {
            fontSize: "36px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });

    }

}
export default GameOver;