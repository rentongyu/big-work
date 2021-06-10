
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

let isPlay = false
let isSound = true

let sing = document.querySelector('#audio')

let soundBtn = document.querySelector('.sound')
let playBtn = document.querySelector('.play-btn')
let timeDom = document.querySelector('.time')

let singImg = document.querySelector('.img')
let timeS = 0
let timeM = 0

let textTimer = null

playBtn.onclick = () => {
    if (isPlay) {
        sing.pause()
        singImg.classList.remove('ac')
        document.getElementById('playIcon').src = './images/play.png'
    } else {
        sing.play()
        singImg.classList.add('ac')
        document.getElementById('playIcon').src = './images/pause.png'
    }
    isPlay = !isPlay
}

soundBtn.onclick = () => {
    if (isSound) {
        document.getElementById('soundStatus').src = './images/jy.png'
    } else {
        document.getElementById('soundStatus').src = './images/jyn.png'
    }
    isSound = !isSound
    sing.muted = !isSound
}

sing.onplay = (e) => {
    console.dir(e.target)
    playAudio(e)
}

function playAudio(e) {

    textTimer = setInterval(() => {
        if (timeS < 60) {
            timeS += 1
        } else {
            timeS = 0
            timeM += 1
        }

        timeDom.innerHTML = `0${timeM}:${timeS}`

        console.log(sing.currentTime)

        document.querySelector('.loading').style.width = sing.currentTime / sing.duration * 300 + 'px'
    }, 1000);
}

sing.onpause = (e) => {
    clearInterval(textTimer)
}

// 播放截至
sing.onended = () => {
    timeS = 0
    timeM = 0
    isPlay = false
    isSound = true
    document.querySelector('.loading').style.width = '0px'
    clearInterval(textTimer)
    timeDom.innerHTML = `0${timeM}:${timeS}`
    singImg.classList.remove('ac')
    document.getElementById('playIcon').src = './images/play.png'
}

document.querySelector('.loadign-wap').onclick = (e) => {
    console.dir(e.offsetX)
    console.dir(sing.paused)
    if (sing.paused) {
        sing.play()
        singImg.classList.add('ac')
        document.getElementById('playIcon').src = './images/pause.png'
        sing.currentTime = e.offsetX / 300 * sing.duration
        isPlay = true
        isSound = false
        if (sing.currentTime < 60) {
            timeS = parseInt(sing.currentTime)
        } else {
            timeS = parseInt(sing.currentTime % 60)
            timeM = parseInt(sing.currentTime / 60)
        }
    } else {
        sing.currentTime = e.offsetX / 300 * sing.duration
        if (sing.currentTime < 60) {
            timeS = parseInt(sing.currentTime)
        } else {
            timeS = parseInt(sing.currentTime % 60)
            timeM = parseInt(sing.currentTime / 60)
        }
    }

    document.querySelector('.loading').style.width = e.offsetX + 'px'
}

// 


let plValue = document.getElementById('plCotent')
let plWap = document.getElementById('plList')
let pageWap = document.getElementById('pageNumWap')

plValue.oninput = () => {
    document.getElementById('plNum').innerHTML = plValue.value.length
}

let defaultPl = [{
    name: 'gotget',
    content: '我喜欢很多歌曲，喜欢过很多唱歌的人，哪些有时候不是我的爱好，已经成为了我那段青春的回忆，我下载可以很傲娇',
    time: '2017-06-03 16:58:02',
}, {
    name: '雅力士多德',
    content: '学校晚会表演这歌😀',
    time: '2017-05-14 16:16:53',
}]

let userPl = []


let currentPage = 1
let pageSize = 3

function initPl() {
    loadAllPl()
    loadPageCon()
    loadDefaultPl(true)
}

document.querySelector('.pl-btn').onclick = () => {
    if (plValue.value === '') {
        alert('评论为空')
        return
    }
    let vote = {}
    vote.name = '郭子仪'
    vote.content = plValue.value
    vote.time = new Date().format("yyyy-MM-dd hh:mm:ss")

    userPl.push(vote)

    defaultPl.unshift(vote)
    loadDefaultPl()
    loadPageCon()


    window.localStorage.setItem('pl', JSON.stringify(userPl))


    plValue.value = ''
}

function loadAllPl() {
    let plObj = window.localStorage.getItem('pl')
    if (!plObj) return
    userPl = JSON.parse(plObj)

    defaultPl.push(...userPl)
    console.log(JSON.parse(plObj))
}

function loadPageCon() {
    pageWap.innerHTML = ''
    let pageAll = Math.ceil(defaultPl.length / 3);
    for (let i = 1; i <= pageAll; i++) {
        let dom = document.createElement('div')
        dom.innerHTML = `
        <div class="page-num fl-c ${i === currentPage ? 'page-ac' : ''}">${i}</div>
        `
        pageWap.appendChild(dom)
    }

}

function loadDefaultPl(first = false) {
    plWap.innerHTML = ''

    if (first) {
        defaultPl = defaultPl.reverse()
    }
    console.log(defaultPl)
    let showPl = defaultPl.slice((currentPage - 1) * 3, pageSize * currentPage)
    console.log(showPl)

    for (let i = 0; i < showPl.length; i++) {
        let dom = document.createElement('div')
        dom.innerHTML = `
        <div class="inp-wap fl-b">
          <div class="usser-img"></div>
          <div class="out-put">
            <div class="fl-b">
              <div style="color: rgb(156, 102, 20)">${showPl[i].name}</div>
              <div>分享</div>
            </div>
            <div class="content">${showPl[i].content}</div>
            <div class="fl-b">
              <div class="time">${showPl[i].time}</div>
              <div class="fl-c">
                <div class="fl-c">
                  <div>666</div>
                  <div>
                    <img src="./images/good.png" width="20px" alt="" />
                  </div>
                </div>
                <div style="margin-left: 10px">回复</div>
              </div>
            </div>
          </div>
        </div>
        `
        plWap.appendChild(dom)
    }
}

function uperPage() {
    if (currentPage == 1) return
    currentPage -= 1
    loadPageCon()
    loadDefaultPl()
}


function nextPage() {
    if (currentPage == Math.ceil(defaultPl.length / 3)) return
    currentPage += 1
    loadPageCon()
    loadDefaultPl()
}


document.querySelector('#pageNumWap').onclick = (e) => {
    if (parseInt(e.target.innerHTML)) {
        currentPage = parseInt(e.target.innerHTML)
        loadPageCon()
        loadDefaultPl()
    }
}

initPl()

