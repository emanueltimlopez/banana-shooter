export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.scene = scene;
    this.scene.add.existing(this);

    this.initialPosition = { x, y };
    this.displayHeight = 30;
    this.displayWidth = 30;
    this.height = 30;
    this.width = 30;

    this.update = this.update.bind(this);
    this.shootRight = this.shootRight.bind(this);
    this.shootLeft = this.shootLeft.bind(this);
    this.shootTop = this.shootTop.bind(this);
    this.shootBottom = this.shootBottom.bind(this);
  }

  shootRight() {
    this.x += 10;
  }

  shootLeft() {
    this.x -= 10;
  }

  shootTop() {
    this.y -= 10;
  }

  shootBottom() {
    this.y += 10;
  }

  center() {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
  }

  update() {

  }
}