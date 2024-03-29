import 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super('Menu');

    this._start = this._start.bind(this);
  }

  create () {
    this.cameras.main.backgroundColor.setTo(1,0,171);

    //const music = this.sound.add('menu-music')
    //music.play({ loop: true });

    WebFont.load({
      custom: {
        families: [ 'SweetTalk' ]
      },
      active: () => {
        this.add.text(this.sys.game.config.width / 2, 170, 'BANANA',
          { fontFamily: 'SweetTalk', fontSize: 80, color: '#ffffff' })
          .setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 245, 'SHOOTER',
          { fontFamily: 'SweetTalk', fontSize: 80, color: '#ffffff' })
          .setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 315, "Search for a real banana and come back",
          { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
          .setOrigin(0.5);

        const startButton = this.add.text(this.sys.game.config.width / 2, 400, '< Press ENTER to continue >',
          { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
          .setOrigin(0.5);
      }
    });

    this.add.text(this.sys.game.config.width - 100, this.sys.game.config.height - 40, 'v.0.1.0',
      { font: "15px Arial", fill: "#ffffff" });

    this.input.keyboard.on('keydown-' + 'ENTER', this._start);
  }

  _start() {
    //music.stop();
    this.scene.start('Train');
  }

};
