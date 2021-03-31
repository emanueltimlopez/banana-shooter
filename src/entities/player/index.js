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

    this.resetSuperMovement = false;

    this.update = this.update.bind(this);
    this.shootRight = this.shootRight.bind(this);
    this.shootLeft = this.shootLeft.bind(this);
    this.shootTop = this.shootTop.bind(this);
    this.shootBottom = this.shootBottom.bind(this);
  }

  shootRight() {
    if (!this.resetSuperMovement) {
      this.x -= 100;
      this.resetSuperMovement = true;
    }
  }

  shootLeft() {
    if (!this.resetSuperMovement) {
      this.x -= 100;
      this.resetSuperMovement = true;
    }
  }

  shootTop() {
    if (!this.resetSuperMovement) {
      this.x -= 100;
      this.resetSuperMovement = true;
    }
  }

  shootBottom() {
    if (!this.resetSuperMovement) {
      this.x += 100;
      this.resetSuperMovement = true;
    }
  }

  update() {

  }
}