const { Telegraf } = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const config = require('config')
const bot = new Telegraf(config.get('token'))
const axios = require('axios');

console.log('┌────────────────────┐')
console.log('│ bot by:  @mrbenino │')
console.log('└────────────────────┘')

let category = []

bot.use(Telegraf.log())

bot.start((ctx) => {
    getCategory(ctx)
    return ctx.reply('😉');
})
bot.on('text' , (ctx) => {
    let param = ctx.message.text
    if (category.indexOf(param)) {
        byCategory(ctx)
    }else ctx.reply('Я вас не понимаю 🧐')
    return ctx.reply('😉');
})

bot.command('category', (ctx) => {
    getCategory(ctx)
    return ctx.reply('😉');
});

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

function byCategory(ctx) {
    let param = ctx.message.text
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
}
bot.launch()