import 'phaser';
import AlignGrid from '../utils/alignGrid'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');

    this.onFinishLoadingAssets = this.onFinishLoadingAssets.bind(this);
  }

  init () {
    const element = document.createElement('style');
    document.head.appendChild(element);
    const sheet = element.sheet;
    sheet.insertRule('@font-face { font-family: "SweetTalk"; src: url("src/assets/fonts/sweet_talk.otf"); }\n', 0);
  }

  preload() {
    this.load.image('loading', 'src/assets/loading.jpg');
    this.load.image('monkey', 'src/assets/monkey.png');
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.audio('menu-music', 'src/assets/music.mp3');

    this.load.on('complete', this.onFinishLoadingAssets);
  }

  create() {
    this.cameras.main.backgroundColor.setTo(0, 0, 0);

    const aGrid = new AlignGrid({
      'scene': this,
      'cols': 5,
      'rows': 5
    });

    this.logo = this.add
      .sprite(0, 0, 'loading')
      .setOrigin(0.5);

      aGrid.placeAtIndex(12, this.logo);
    }

  onFinishLoadingAssets() {
    /*this.scene.transition({
      target: this.scene.get('Game'),
      duration: 1000,
    })*/
    this.scene.start('Menu');
  }

}