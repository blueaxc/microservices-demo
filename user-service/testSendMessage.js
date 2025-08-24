const sendMessage = require('./utils/messageQueue');

(async () => {
    await sendMessage('userQueue', 'Test user created');
})();