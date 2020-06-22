const Scene = require('telegraf/scenes/base')
const axios = require('axios')

class ScenesGenerator{
    StartScene() {
        const start = new Scene('start')
        start.enter((ctx) => {
            ctx.reply('Привет! Хочешь вкусно поесть? Тогда ты там где нужно 😊 Давай начнем для начала набери /category')
        })
        start.command('category', (ctx) => {
            ctx.scene.leave()
            getCategory(start)
            ctx.reply('Отлично 😉 теперь можем выбрать категорию просто выбери то что нравиться 🧐')
            
        })
        start.on('message', (ctx) => ctx.reply('🧐'))
    }
}
function getCategory(start) {    
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
            return start.reply('Keyboard wrap', Extra.markup(
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
}
module.exports = ScenesGenerator