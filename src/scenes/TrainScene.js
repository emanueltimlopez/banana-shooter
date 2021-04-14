import 'phaser';
import TensorflowAdapter from '../../TensorFlowAdapter';

export default class TrainScene extends Phaser.Scene {
  constructor () {
    super('Train');

    this._start = this._start.bind(this);
    this._takePhoto = this._takePhoto.bind(this);

    this.className = ['LEFT', 'UP', 'RIGHT', 'DOWN']
    this.classText = null;
  }

  create () {
    this.cameras.main.backgroundColor.setTo(1,0,171);

    //const music = this.sound.add('menu-music')
    //music.play({ loop: true });

    this.classText = this.add.text(this.sys.game.config.width / 2, 315, "Take photos aim LEFT with your 'gun'",
      { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
      .setOrigin(0.5);

    const photoButton = this.add.text(this.sys.game.config.width / 2, 400, '< Press P to take the photo >',
      { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
      .setOrigin(0.5);

    this.input.keyboard.on('keydown-' + 'P', this._takePhoto);

    this.tfAdapter = new TensorflowAdapter();
    this.actualClass = 0;
  }

  _takePhoto() {
    this.tfAdapter.setExampleForModel(this.actualClass);

    if (this.tfAdapter.examplesForClasses[this.actualClass] > 10) {
      this.actualClass += 1;
      this.classText.setText(`Take photos aim ${this.className[this.actualClass]} with your 'gun'`);
    }

    if (this.actualClass > 4) {
      this._start();
    }
  }

  _start() {
    //music.stop();
    this.scene.start('Game', this.tfAdapter);
  }

};
