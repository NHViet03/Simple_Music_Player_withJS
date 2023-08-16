const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);


function secondstoMinutesandSeconds(seconds){
    let minutes=Math.floor(seconds/60);
    let leftSeconds=Math.ceil(seconds%60);
    return minutes + ':' + (leftSeconds < 10 ? '0':'') + leftSeconds;
}

const PLAYER_STORAGE_KEY = 'PLAYER_STORAGE';
const player = $('.player');
const playList = $('.playlist');
const audio = $('#audio');
const headerNameSong = $('.header h2');
const headerAuthor = $('.header p');
const cdThumb = $('.cd-thumb');
const toggleAudio = $('.btn.btn-toggle-play');
const repeatAudio = $('.btn.btn-repeat');
const preAudio = $('.btn.btn-pre');
const nextAudio = $('.btn.btn-next');
const randomAudio = $('.btn.btn-random');
const playBarCurrent = $('.play-bar .play-current');
const playBarLength =   $('.play-bar .play-length');
const progress = $('#progress');

progress.oninput=function(){
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background='linear-gradient(to right, #d8503e 0%, #d8503e ' + value + '%, #3c4e71 ' + value + '%, #3c4e71 100%)'
}
const app={
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    songs:[
        {
            name:'Stay With Me',
            singer:'CHANYEOL, PUNCH',
            path:'./assets/songs/stay-with-me.mp3',
            image:'./assets/songs/avt_gong-yoo.jpg',
            duration:192
        },
        {
            name:'Dangerously',
            singer:'Charlie Puth',
            path:'./assets/songs/dangerously.mp3',
            image:'./assets/songs/avt_charlie-puth.jpg',
            duration:202
        },
        {
            name:'Only',
            singer:'Lee Hi',
            path:'./assets/songs/only.mp3',
            image:'./assets/songs/avt_lee-hi.jpg',
            duration:330
        },
        {
            name:'Before You Go',
            singer:'Lewis Capaldi',
            path:'./assets/songs/before-you-go.mp3',
            image:'./assets/songs/avt_lewis-capaldi.jpg',
            duration:211
        },
        {
            name:'This is what you came for',
            singer:'Rihanna',
            path:'./assets/songs/this-is-what-you-came-for.mp3',
            image:'./assets/songs/avt_rihanna.jpg',
            duration:239
        },
        {
            name:'Sweet But Psycho',
            singer:'Ava Max',
            path:'./assets/songs/sweet-but-psycho.mp3',
            image:'./assets/songs/avt_ava-max.jpg',
            duration:207
        },
        {
            name:'Dandelions',
            singer:'Ruth B',
            path:'./assets/songs/dandelions.mp3',
            image:'./assets/songs/avt_ruth-b.jpg',
            duration:228
        },
        {
            name:'Perfect Two',
            singer:'Auburn',
            path:'./assets/songs/perfect-two.mp3',
            image:'./assets/songs/avt_auburn.jpg',
            duration:234
        },
        {
            name:'We don\'t talk anymore',
            singer:'Charlie Puth',
            path:'./assets/songs/we-dont-talk-anymore.mp3',
            image:'./assets/songs/avt_charlie-puth.jpg',
            duration:250
        },
        {
            name:'Until i found you',
            singer:'SanChez',
            path:'./assets/songs/until-i-found-you.mp3',
            image:'./assets/songs/avt_sanchez.jpg',
            duration:118
        }
    ],
    setConfig(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    render(){
        const htmls=this.songs.map((song)=>{
            return `
                <div class="song">
                    <div class="song-thumb" style="background-image: url('${song.image}')"></div>
                    <div class="song-body">
                        <h3 class="song-title">${song.name}</h3>
                        <p class="song-author">${song.singer}</p>
                        <p class="song-duration">${secondstoMinutesandSeconds(song.duration)}</p>
                    </div>
                    <div class="song-option">
                        <span class="option-favorites">
                        <i class="fa-solid fa-heart option-icon--fullheart"></i>
                        <i class="fa-regular fa-heart option-icon--emptyheart"></i>
                        </span>
                        <i class="fa-solid fa-ellipsis-vertical option-icon--more"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents(){
        const _this=this;
        const cd=$('.cd');
        let listSongs=Array.from(playList.children);

        // Xu ly khi Scroll Play List
        const cdWidth=cd.offsetWidth;
        const playListHeight=playList.offsetHeight;
        playList.onscroll=function(){
            const scrollTop=playList.scrollTop;
            const newCdWidth=cdWidth-scrollTop;
            const newListHeight=playListHeight+scrollTop;
            cd.style.width= newCdWidth > 50 ? newCdWidth+'px': 0;
            cd.style.opacity=newCdWidth/cdWidth;
            playList.style.maxHeight=newListHeight<400 ? newListHeight+'px':400+'px';
        }

        // Xu ly CD quay/dung 
        const cdThumbAnimate = cdThumb.animate([{
            transform: "rotate(0)"
            },
            {
            transform: "rotate(360deg)"}],{
                duration:15000,
                iterations:Infinity
            }
        );
        cdThumbAnimate.pause();

        // Xu ly khi click Play/Pause Button
        toggleAudio.onclick=function(){
            if(_this.isPlaying){
                audio.pause();
            } else{
                audio.play();
            }
        }
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        audio.onpause=function(){
            _this.isPlaying=false;
            player.classList.remove("playing");
            cdThumbAnimate.pause(); 

        }
        // Xu ly khi click Repeat Button
        repeatAudio.onclick=function(){
            _this.isRepeat=!_this.isRepeat;
            this.classList.toggle("active",_this.isRepeat);
            _this.setConfig('isRepeat',_this.isRepeat);
        }
        
        // Xu ly khi click Previous Button
        preAudio.onclick=function(){
            if(audio.currentTime<2){
                listSongs[_this.currentIndex].classList.remove('active');
                _this.currentIndex=(_this.currentIndex-1 + _this.songs.length)%_this.songs.length;
                _this.loadSong();
                audio.play();
                _this.setConfig('currentIndex', _this.currentIndex);
            }else {
                audio.currentTime=0;
            }
        }

        // Xu ly khi click Next Button
        nextAudio.onclick=function(){
            listSongs[_this.currentIndex].classList.remove('active');
            _this.currentIndex=(_this.currentIndex+1)%_this.songs.length;
            _this.loadSong();
            audio.play();
            _this.setConfig('currentIndex', _this.currentIndex);
        }

        // Xu ly khi click Random Button
        randomAudio.onclick=function(){
            _this.isRandom=!_this.isRandom;
            this.classList.toggle("active",_this.isRandom); 
            _this.setConfig('isRandom',_this.isRandom);
        }

        audio.onended=function(){
            // 2s sau khi ket thuc, tu chuyen qua bai moi
            setTimeout(function(){
                listSongs[_this.currentIndex].classList.remove('active');
                if(_this.isRepeat){
                    _this.isCurrentIndex =_this.currentIndex;
                } else if(_this.isRandom) {
                    var oldIndex=_this.currentIndex;
                    do{
                        _this.currentIndex=Math.floor(Math.random()*(_this.songs.length));
                    }while(_this.currentIndex === oldIndex)
                } else {
                    _this.currentIndex=(_this.currentIndex+1)%_this.songs.length;
                }
                _this.loadSong();
                audio.play();
                _this.setConfig('currentIndex', _this.currentIndex);
            },2000);
            
        }

        //Xu ly thanh thoi gian khi Play song
        audio.ontimeupdate = function() {
           if(audio.duration){
            playBarCurrent.textContent=secondstoMinutesandSeconds(audio.currentTime);
            const progessPercent=Math.round((audio.currentTime/audio.duration)*100);
            progress.style.background='linear-gradient(to right, #d8503e 0%, #d8503e ' + progessPercent + '%, #3c4e71 ' + progessPercent + '%, #3c4e71 100%)'
            progress.value=progessPercent;
           }
        }

        // Xu ly khi chon nhac tu Play List
        listSongs.forEach((songItem,index) => {
            songItem.onclick=(e) =>{
                // Event khi chuyen sang bai hat duoc chon
                if(
                    e.target.closest('.song:not(.active)') &&
                    !e.target.closest('.song-option')
                ){
                    listSongs[this.currentIndex].classList.remove('active');
                    this.currentIndex=index;
                    songItem.classList.add('active');
                    this.loadSong();
                    audio.play();
                    this.setConfig('currentIndex', this.currentIndex);
                }

                //Event khi chon option cua bai hat
                if(e.target.closest('.song-option .option-favorites')){
                    songItem.querySelector('.song-option .option-favorites').onclick = 
                    function(event){
                        if(this.classList.contains("active")){
                            this.classList.remove("active");
                        }else{
                            this.classList.add("active");
                        }
                    }
                }
            }
        });

        // Xu ly khi tua nhac tren thanh thoi gian
        progress.onchange=function(){
            const progessPercent=(this.value-this.min)/(this.max-this.min);
            audio.currentTime=audio.duration*progessPercent;
            audio.play();
        }
    },
    loadConfig(){
        this.currentIndex= (typeof this.config.currentIndex ) === 'undefined' ? 0 : this.config.currentIndex;
        this.isRepeat=(typeof this.config.isRepeat ) === 'undefined' ? false : this.config.isRepeat;
        this.isRandom=(typeof this.config.isRandom ) === 'undefined' ? false : this.config.isRandom;
        // Hien thi trang thai ban dau ti Storage
        repeatAudio.classList.toggle("active",this.isRepeat);
        randomAudio.classList.toggle("active",this.isRandom); 
    },
    loadSong(){
        let hasChooseSong=this.currentSong;
        headerNameSong.textContent=hasChooseSong.name;
        headerAuthor.textContent=hasChooseSong.singer;
        cdThumb.style.backgroundImage=`url(${hasChooseSong.image})`;
        audio.src=hasChooseSong.path;
        playBarCurrent.textContent=secondstoMinutesandSeconds(0);
        playBarLength.textContent=secondstoMinutesandSeconds(hasChooseSong.duration);
        playList.children[this.currentIndex].classList.add("active");   
    },
    start(){
        // 
        this.loadConfig();
        //Dinh nghia 1 so thuoc tinh cho Object (get,set,...)
        this.defineProperties();

        // Render Play List
        this.render();

        //Load thong tin bai hat dau tien khi chay lan dau
        this.loadSong();
        // Xu ly Event 
        this.handleEvents();
    }
    
}

app.start();