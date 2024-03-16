import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
    static walkSpeed = 100;
    static runSpeed = 150;
    static DRAG_AMOUNT = 1600;

    // create anims
    static createAnimations(scene) {
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('red', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('red', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('red', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('red', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
    }

    constructor(scene, x = 100, y = 450, name = "Unnamed") {
        super(scene, x, y, 'red');
        this.name = name;
        this.setOrigin(0.5);

        // Add the player to the scene
        scene.add.existing(this);

        // Enable physics for the player
        scene.physics.add.existing(this);

        // Set drag for the player
        // this.body.setDrag(Player.DRAG_AMOUNT);

        this.body.setCollideWorldBounds(true);
        this.tag = new PlayerTag(scene, this);


    }

    create() {
        // this.tag.create();
    }

    update() {
        if (this.body !== null) {
            const cursors = this.scene.input.keyboard.createCursorKeys();
            const horizDown = cursors.left.isDown || cursors.right.isDown;
            const speed = cursors.shift.isDown ? Player.walkSpeed : Player.runSpeed;

            let dx = 0, dy = 0;
            // handle horizontal
            if (cursors.left.isDown) {
                dx -= speed;
                this.anims.play('left', true);
            } else if (cursors.right.isDown) {
                dx += speed;
                this.anims.play('right', true);
            }
            // handle vertical
            if (cursors.up.isDown) {
                dy -= speed;
                if (!horizDown) this.anims.play('up', true);
            } else if (cursors.down.isDown) {
                dy += speed;
                if (!horizDown) this.anims.play('down', true);
            }

            let vMagnitude = Math.sqrt(dx * dx + dy * dy);
            if (vMagnitude === 0 && this.anims.isPlaying) {
                if (this.anims.currentFrame.textureFrame % 2 === 1)
                    this.anims.stopOnFrame(this.anims.currentFrame.nextFrame.textureFrame);
                else this.anims.stop();
            } else if (vMagnitude > speed) {
                vMagnitude = speed;
                this.body.setMaxSpeed(speed);
            }
            this.body.setVelocity(dx, dy);
            this.anims.timeScale = 0.2 + 0.8 * vMagnitude / Player.runSpeed;
        }
    }
}

class PlayerTag extends Phaser.GameObjects.Text {
    static style = { font: '18px Futura', fill: '#fff', align: 'center' };
    static yOffset = 10;

    constructor(scene, player) {
        super(scene, player.body.x, player.body.y - PlayerTag.yOffset, player.name, PlayerTag.style);
        this.setOrigin(0.5);

        // handle label
        scene.events.on('postupdate', () => {
            this.setPosition(player.body.x, player.body.y - PlayerTag.yOffset);
        });

        scene.add.existing(this);
    }
}