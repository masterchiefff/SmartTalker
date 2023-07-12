const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
    apiKey: process.env.apiKey,
    username: process.env.username
})

module.exports = async function sendSMS() {
    try {
        const result = africastalking.SMS.send({
            to: '+254776762266',
            from: '+254710865696',
            message: 'this is a test message'
        })
    
        console.log(result)
    } catch (err) {
        console.log(err)
    }
};