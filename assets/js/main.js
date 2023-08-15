const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);


function secondstoMinutesandSeconds(seconds){
    let minutes=Math.floor(seconds/60);
    let leftSeconds=(seconds%60).toFixed(0);
    return minutes + ':' + (leftSeconds < 10 ? '0':'') + leftSeconds;
}

const player=$('.player');
const playList=$('.playlist');
const audio=$('#audio');
const headerNameSong=$('.header h2');
const headerAuthor=$('.header p');
const cdThumb=$('.cd-thumb');
const toggleAudio=$('.btn.btn-toggle-play');
const playBarCurrent=$('.play-bar .play-current');
const playBarLength=$('.play-bar .play-length');
const progress=$('#progress');

progress.oninput=function(){
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background='linear-gradient(to right, #d8503e 0%, #d8503e ' + value + '%, #3c4e71 ' + value + '%, #3c4e71 100%)'
}
const app={
    currentIndex:0,
    songs:[
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
            singer:'Lee Hi',
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
                        <i class="fa-regular fa-heart option-icon--heart"></i>
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
            playList.style.maxHeight=newCdWidth<400? newListHeight+'px':playListHeight+'px';
        }

        // Xu ly khi click Play/Pause song
        toggleAudio.onclick=function(){
                if(player.classList.contains("playing")){
                    audio.pause();
                    player.classList.remove("playing");
                } else{
                    audio.play();
                    player.classList.add("playing");
                }
        }

        //Xu ly thoi gian khi Play song
        audio.ontimeupdate = function() {
           if(audio.duration){
            playBarCurrent.textContent=secondstoMinutesandSeconds(audio.currentTime);
            const progessPercent=Math.floor((audio.currentTime/audio.duration)*100);
            progress.style.background='linear-gradient(to right, #d8503e 0%, #d8503e ' + progessPercent + '%, #3c4e71 ' + progessPercent + '%, #3c4e71 100%)'
            progress.value=progessPercent;
           }
        }

        // Xu ly khi chon nhac tu Play List
        listSongs.forEach((songItem,index) => {
            songItem.onclick=() =>{
                listSongs[this.currentIndex].classList.remove('active');
                this.currentIndex=index;
                songItem.classList.add('active');
                this.loadSong();
                audio.play();
                player.classList.add("playing");
            }
        });
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