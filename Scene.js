const Scene = require('telegraf/scenes/base')

class ScenesGenerator{
    StartScene(){
            const start = new Scene('age')
            start.enter(async (ctx) => {
                await ctx.reply('Привет! Ты занимаешься бегом? Если да то давай знакомиться 🤓 сколько тебе лет?')
            })
            start.on('text', async (ctx) => {
                const currAge = Number(ctx.message.text)
                if (currAge && currAge > 0) {
                    await ctx.reply('Да ты еще молод)')
                    ctx.scene.enter('name')
                } else {
                    await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                    ctx.scene.reenter()
                }
            })
            start.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
            return start
        }

    module.exports = ScenesGenerator