// Phaser docu says not to use their eventemitters but instead instance our own - this is what we do here.
const eventCenter = new Phaser.Events.EventEmitter()

export default eventCenter