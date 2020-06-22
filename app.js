const { Telegraf } = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave,enter } = Stage
const config = require('config')
const bot = new Telegraf(config.get('token'))
const axios = require('axios');

const order = new Scene('order')
const stage = new Stage()

console.log('┌────────────────────┐')
console.log('│ bot by:  @mrbenino │')
console.log('└────────────────────┘')

category = []

bot.use(Telegraf.log())
stage.register(order)
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
    getCategory(ctx)
    return ctx.reply('😉')
})

bot.command('order', async (ctx) => {
    ctx.scene.enter('order')
    ctx.reply(`Что бы сделать заказ нам нужно уточнить некоторые детали. ${ctx.message.from.first_name} как вы хотите оплаить заказ?`)
    category.splice(0, category.length + 1)
    category[0] = "картой"
    category[1] = "наличными"
    category[2] = "/info"
    ctx.reply('выберите:', Extra.markup(
        Markup.keyboard(category, {
            columns: 2
        })
    ))
    order.command('info',async (ctx) => {
        ctx.reply('Оплата картой - у нас действует поощрительная скидка на оплату картой. \n Оплата наличными - не забудте оставить чаевые если вам все понравилось \n Что бы отменить заказ нажмите /leave')
    })
    order.command('leave',(ctx) => {
        ctx.reply('🙃')
        getCategory(ctx)
        ctx.scene.leave()
    })
    await order.on('text', async (ctx) => {
        if (ctx.message.text == "картой"){
            getCategory(ctx)
            ctx.scene.leave()
        }else if (ctx.message.text == "наличными"){
            ctx.reply('Оплата наличными')
            getCategory(ctx)
            ctx.scene.leave()
        }
    })
    order.leave((ctx) => ctx.reply('Спасибо, ожидайте ваш заказ 😉'))
})


bot.command('category', (ctx) => {
    getCategory(ctx)
    return ctx.reply('😉')
})

bot.command('allproduct', (ctx) => {
    getAll(ctx)
    return ctx.reply('😉')
})

bot.help( (ctx) => {
    ctx.reply('Выбери одну из команд: \n /category - обновить категории \n /allproduct - все блюда \n 😇')
    return ctx.reply('😉')
})

bot.on('text' , (ctx) => {
    let param = ctx.message.text
    byCategory(ctx , param)
    return ctx.reply('😉');
})

function getCategory(ctx) {    
    axios({
        method: 'POST',
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://hookah.pp.ua/v1/user/login',
        data: 'email=franc@gmail.com&password=qwert12345'
    })
    .then(function (response) {  
        // console.log(response)      
        axios.get('http://hookah.pp.ua/v1/categories/get_all', {
        headers: {
            Authorization: `Bearer ${response.data}`,
            Cookie: `MY_SESSION=id%3D%2523i1; Max-Age=604800; Expires=Thu, 11 Jun 2020 11:20:30 GMT; Path=/; HttpOnly; SameSite=lax; $x-enc=URI_ENCODING`
            }
        })
        .then(function (response) {
            console.table(response.data);
            for (let i = 0; i < response.data.length; i++) {
                console.log(`${response.data[i].name}\n`);
                category[i] = response.data[i].name
            }
            category[response.data.length+1] = "/help"
            return ctx.reply('MENU', Extra.markup(
                Markup.keyboard(category, {
                    columns: 2
                })
            ))
        })
        .catch(function (error) {
            // console.log(error);
        })
    })
        .catch(function (error) {
        // console.log(error);
    })
};

function getAll(ctx){
    axios({
        method: 'POST',
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://hookah.pp.ua/v1/user/login',
        data: 'email=franc@gmail.com&password=qwert12345'
    })
    .then(function (response) {  
        console.log(response)      
        axios.get('http://hookah.pp.ua/v1/products/get_all', {
        headers: {
            Authorization: `Bearer ${response.data}`,
            Cookie: `MY_SESSION=id%3D%2523i1; Max-Age=604800; Expires=Thu, 11 Jun 2020 11:20:30 GMT; Path=/; HttpOnly; SameSite=lax; $x-enc=URI_ENCODING`
          }
        })
        .then(function (response) {
            console.table(response.data);
            
            for (let i = 0; i < response.data.length; i++) {
                console.log(`${response.data[i].name}\n${response.data[i].description}\n${response.data[i].constituents}\n${response.data[i].price}\n${response.data[i].discount}`);
                
                ctx.reply(`${response.data[i].name}\n${response.data[i].description}\n${response.data[i].constituents}\n${response.data[i].price}\n${response.data[i].discount}`)
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        console.log(error);
    })
};

function byCategory(ctx , param) {
    axios({
        method: 'POST',
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://hookah.pp.ua/v1/user/login',
        data: 'email=franc@gmail.com&password=qwert12345'
    })
    .then(function (response) {  
        console.log(response)      
        axios.get(`http://hookah.pp.ua/v1/products/byCategory/${param}`, {
        headers: {
            Authorization: `Bearer ${response.data}`,
            Cookie: `MY_SESSION=id%3D%2523i1; Max-Age=604800; Expires=Thu, 11 Jun 2020 11:20:30 GMT; Path=/; HttpOnly; SameSite=lax; $x-enc=URI_ENCODING`
          }
        })
        .then(function (response) {
            console.table(response.data);
            
            for (let i = 0; i < response.data.length; i++) {
                console.log(`${response.data[i].name}\n${response.data[i].description}\n${response.data[i].constituents}\n${response.data[i].price}\n${response.data[i].discount}`);
                
                ctx.reply(`${response.data[i].name}\n${response.data[i].description}\n${response.data[i].constituents}\n${response.data[i].price}\n${response.data[i].discount}\n /order`)
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        console.log(error);
    })
}

bot.launch()