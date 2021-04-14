import 'phaser';
import AlignGrid from '../utils/alignGrid'
import Player from '../entities/Player';
import Enemy from '../entities/enemy';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');

    this._shootRight = this._shootRight.bind(this);
    this._shootLeft = this._shootLeft.bind(this);
    this._shootTop = this._shootTop.bind(this);
    this._shootBottom = this._shootBottom.bind(this);
  }

  init(data){
    this.currentLevel = data.currentLevel;
    this.lastTime = 0;
    this.enemyPosition = 0;
  }

  create() {
    this.cameras.main.backgroundColor.setTo(1,0,171);

    this.registry.events.on('changedata', this._updateData, this);
    this.sys.events.once('shutdown', this._shutdown, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-' + 'D', this._shootRight);
    this.input.keyboard.on('keydown-' + 'A', this._shootLeft);
    this.input.keyboard.on('keydown-' + 'W', this._shootTop);
    this.input.keyboard.on('keydown-' + 'S', this._shootBottom);

    const paddingScreen = 70;
    this.places = {
      center: {
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY
      },
      left: {
        x: paddingScreen,
        y: this.cameras.main.centerY
      },
      right: {
        x: this.cameras.main.centerX * 2 - paddingScreen,
        y: this.cameras.main.centerY
      },
      top: {
        x: this.cameras.main.centerX,
        y: paddingScreen
      },
      bottom: {
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY * 2 - paddingScreen
      }
    }

    this.enemies = [
      new Enemy(this, this.places.left.x, this.places.left.y),
      new Enemy(this, this.places.top.x, this.places.top.y),
      new Enemy(this, this.places.right.x, this.places.right.y),
      new Enemy(this, this.places.bottom.x, this.places.bottom.y),
    ];
    this.player = new Player(this, this.places.center.x, this.places.center.y);
  }

  update(dt) {
    this.enemies.forEach(enemy => {
      enemy.update()
    });
    this.player.update();

    const time = (dt / 1000).toFixed();
    if (this.lastTime !== time) {
      this.lastTime = time;
      this.enemyPosition = Math.floor(Math.random() * 4);

      this.enemies.forEach(enemy => { enemy.hide() });
      this.enemies[this.enemyPosition].show();

      this.player.center();
    }
  }

  _updateData(_, key, value) {

  }

  _shutdown() {
    this.registry.events.off('changedata');
  }

  _onLose() {
    this.scene.start('Result', { win: false });
  }

  _shootLeft() {
    this.enemies[0].die();
    this.player.shootLeft();
  }

  _shootTop() {
    this.enemies[1].die();
    this.player.shootTop();
  }

  _shootRight() {
    this.enemies[2].die();
    this.player.shootRight();
  }


  _shootBottom() {
    this.enemies[3].die();
    this.player.shootBottom();
  }
}