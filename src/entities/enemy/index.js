export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    this.scene = scene;
    this.scene.add.existing(this);

    this.initialPosition = { x, y };
    this.displayHeight = 30;
    this.displayWidth = 30;
    this.height = 30;
    this.width = 30;

    this.update = this.update.bind(this);
    this.shoot = this.shoot.bind(this);

    this.alive = true;
  }

  die() {
    this.alive = false;
  }

  shoot() {
  }

  update() {
  }
}