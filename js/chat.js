class Chat {
    scrollDownBlock = document.querySelector('.wrapper-messages');
    inpVal = document.querySelector('.send-control textarea').value;
    btn = document.querySelector('.send-control .form-btn');

    constructor() {
        this.scrollDown(this.scrollDownBlock);
        this.valid(this.inpVal, this.btn);
    }

    botResponse(name = null) {
        return {
            '/start': "Привет, меня зовут Чат-бот, а как зовут тебя?",
            '/errorStart': "Введите команду /start, для начала общения",
            '/name:': 'Привет ' + name + ', приятно познакомится. Я умею считать, введи числа которые надо посчитать',
            '/stop': 'Всего доброго, если хочешь поговорить пиши /start',
            '/number:': 'Вот что получилось : ' + name + '',
            '/t3': 'Я не понимаю, введите другую команду!',
            '/startNew': 'Если хотите начать сначала пишите /stop а потом /start'
        }
    }


    weather() {
        var that = this;
        $.getJSON('https://ipapi.co/json/', function (result) {
            fetch('https://api.weatherbit.io/v2.0/forecast/daily?lat=' + result.latitude + '&lon=' + result.longitude + '&key=480dab18bdf94b1187e90c4442bee27a&lang=ru&days=2').then(function (resp) {
                return resp.json()
            }).then(function (data) {
                var d = `<div id="weather">
                    <div class="line-i"></div>
                        <div class="day">
                            <div class="w-icon-cel">
                                <div class="icon-cel">
                                    <img src="https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png">
                                    <span>${data.data[0].temp}&deg</span>
                                </div>
                                <div class="desc">${data.data[0].weather.description}</div>
                            </div>
                            <div class="w-city">
                                <div class="name">${data.city_name}</div>
                                <div class="date">${data.data[0].valid_date}</div>
                            </div>
                        </div>
                        <div class="line-i"></div>
                        <div class="day">
                            <div class="w-icon-cel">
                                <div class="icon-cel">
                                    <img src="https://www.weatherbit.io/static/img/icons/${data.data[1].weather.icon}.png">
                                    <span>${data.data[1].temp}&deg</span>
                                </div>
                                <div class="desc">${data.data[1].weather.description}</div>
                            </div>
                            <div class="w-city">
                                <div class="name">Завтра</div>
                                <div class="date">${data.data[1].valid_date}</div>
                            </div>
                        </div>
                   </div>`;
                var messages = document.getElementById('messages');
                messages.innerHTML +=
                    '<div class="message d-flex to ready load-3">'
                    + "<div class='line'></div>"
                    + "<div class='line'></div>"
                    + "<div class='line'></div>"
                    + "</div>";
                that.scrollDown(that.scrollDownBlock);
                setTimeout(() => {
                    var load = document.querySelectorAll('#messages .ready');
                    var index = load.length - 1;
                    load[index].classList.remove('load-3');
                    load[index].innerHTML = d;
                    that.scrollDown(that.scrollDownBlock);
                }, 1000);
            })
        });
    }

    commands(name, num) {
        return [
            '/start',
            '/stop',
            '/name:' + name + '',
            '/number:' + num + '',
        ];
    }

    appendReady(val) {

        var messages = document.getElementById('messages');
        messages.innerHTML +=
            '<div class="message d-flex to ready load-3">'
            + "<div class='line'></div>"
            + "<div class='line'></div>"
            + "<div class='line'></div>"
            + "</div>";
        setTimeout(() => {
            var load = document.querySelectorAll('#messages .ready');
            var index = load.length - 1;
            load[index].classList.remove('load-3');
            load[index].innerHTML =
                "                    <div class=\"icon\"><img src=\"img/14134081Untitled-3-512.png\" alt=\"\"></div>\n" +
                "                    <div class=\"text\">\n" + val + "</div>\n";
            this.scrollDown(this.scrollDownBlock);
            if (val.length < 70) load[index].classList.add('w50');
            else if (val.length < 100) {
                load[index].classList.remove('w50');
                load[index].classList.add('w70');
            }
            this.scrollDown(this.scrollDownBlock);
        }, 1000);

    }

    appendFrom(val) {
        document.getElementById('messages').innerHTML += "<div class=\"message d-flex from\">\n" +
            "                    <div class=\"icon\"><img src=\"img/man-icon.png\" alt=\"\"></div>\n" +
            "                    <div class=\"text orange\">" + val + "</div>\n" +
            "                </div>";
        this.scrollDown(this.scrollDownBlock);
    }

    scrollDown(messages) {
        messages.scrollTop = messages.scrollHeight;
    }

    valid(inp, btn) {
        if (inp.length < 1) {
            btn.setAttribute('disabled', 'disabled');
            btn.getElementsByClassName('svg')[0].setAttribute('fill', '#282828')
        } else {
            btn.removeAttribute('disabled')
            btn.getElementsByClassName('svg')[0].setAttribute('fill', '#F9C35B')
        }
    }

    i = 0;
    start = false;
    testCommand = true;

    chatBotCommands() {
        this.valid(this.inpVal, this.btn);
        let inp = document.querySelector('.send-control textarea');
        var inpVal = inp.value.replace(/\s/g, "");
        this.appendFrom(inpVal);
        var name = inpVal.slice(6);
        var num = inpVal.slice(8);
        var bool = false;
        /************* вариант 1********************** */
        /*for (let i = 0; i < this.commands().length; i++) {
            if (inpVal == this.commands()[i] && this.i == 0 || inpVal == '/name:' + name && this.i == 0 || inpVal == '/number:' + num && this.i == 0) {
                bool = true
            }
        }*/
        /*if (bool) this.appendReady(this.botResponse()["/errorStart"]);
        else if (inpVal == '/start' && this.i == 0) {
            this.appendReady(this.botResponse()["/start"], inpVal);
            this.i++;
        } else if (inpVal == '/name:' + name && !/\d/.test(name) && this.i == 1) {
            this.appendReady(this.botResponse(name)["/name"]);
            this.i++;
        } else if (inpVal == '/number:' + num && !/[^-0-9,]/.test(num) && num != '' && this.i == 2) {
            var that = this;
            var t = 0;
            var count = document.getElementsByClassName('icn-count');
            var countCont = document.querySelectorAll('.icn-count div');
            var number = inpVal.replace(/[^+,\d]/g, '');
            var replaceNum;
            var set = setInterval(() => {
                t--;
                count[0].style.top = t + 'px';
                if (t == -24) clearInterval(set)
            }, 20);
            for (let i = 0; i < countCont.length; i++) {
                countCont[i].onclick = function () {
                    set = setInterval(() => {
                        t++;
                        count[0].style.top = t + 'px';
                        if (t == 0) clearInterval(set)
                    }, 20);
                    replaceNum = number.replace(',', this.innerText);
                    that.appendReady(that.botResponse(eval(replaceNum))["/number"]);
                }
            }
        } else if (inpVal == '/weather') this.appendReady(this.botResponse()["/stop"]);
        else if (inpVal == '/stop') {
            this.appendReady(this.botResponse()["/stop"]);
            this.i = 0;
        } else {
            this.appendReady(this.botResponse()["/t3"]);
            this.i = 0;
        }
*/

        /************* вариант 1********************** */
        if (inpVal == '/start' && !this.start) {
            this.start = true;
            this.appendReady(this.botResponse()["/start"]);
        } else if (inpVal == '/start' && this.start) {
            this.appendReady(this.botResponse()["/startNew"]);
        }
        for (let i = 0; i < this.commands().length; i++) {
            if (inpVal == this.commands(name, num)[i] && !this.start && name != ":" && num != ":") {
                this.appendReady(this.botResponse()["/errorStart"]);
                this.testCommand = false;
                break
            }
            if (inpVal == this.commands(name, num)[i] && name != ":" && num != ":") {
                this.testCommand = false;
            }
        }
        if (this.start) {
            if (inpVal == '/name:' + name && !/\d/.test(name)) {
                this.appendReady(this.botResponse(name)["/name:"]);
            } else if (inpVal == '/number:' + num && !/[^-0-9,]/.test(num) && num != '') {
                var that = this;
                var t = 0;
                var count = document.getElementsByClassName('icn-count');
                var countCont = document.querySelectorAll('.icn-count div');
                var number = inpVal.replace(/[^+,\d]/g, '');
                var replaceNum;
                var set = setInterval(() => {
                    t--;
                    count[0].style.top = t + 'px';
                    if (t == -24) clearInterval(set)
                }, 20);
                for (let i = 0; i < countCont.length; i++) {
                    countCont[i].onclick = function () {
                        set = setInterval(() => {
                            t++;
                            count[0].style.top = t + 'px';
                            if (t == 0) clearInterval(set)
                        }, 20);
                        replaceNum = number.replace(',', this.innerText);
                        that.appendReady(that.botResponse(Math.round(eval(replaceNum) * 100) / 100)["/number:"]);
                    }
                }
            } else if (inpVal == '/stop') {
                this.appendReady(this.botResponse()["/stop"]);
                this.start = false
            }

        }
        if (inpVal == '/weather') {
            this.weather();
            this.testCommand = false;
        }
        if (this.testCommand) this.appendReady(this.botResponse()["/t3"]);
        this.testCommand = true;
        inp.value = "";
        this.scrollDown(this.scrollDownBlock);
    }
}

var chat = new Chat;

// fdc31d2d8f5cc194493efe05ef9b534c
// 480dab18bdf94b1187e90c4442bee27a
