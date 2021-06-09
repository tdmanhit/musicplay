
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songListBtn = $('.header__song-list-btn');
const songListPage = $('.app-container.songs-list')
const mainPage = $('.app-container.app-main')
const songListBackBtn = $('.songs-list__back-btn')
const songThumbMainPageBlock = $('.song-thumb-container')
const songListBlock = $('.song-item__wrapper')
const songListHeader = $('.songs-list__header-container')
const songListHeaderTitle = $('.songs-list-title')
const audio = $('#audio')
const playBtn = $('.song-play-btn')
const prevBtn = $('.prev-btn')
const nextBtn = $('.next-btn')
const songInfoBlock = $('.song-info')
const shuffleBtn = $('.shuffle-btn')
const repeatBtn = $('.repeat-btn')
const currentTime = $('.song-current-time')
const totalTime = $('.song-total-time')
const songProgress = $('#song-range')
const songThumb = $('.song-thumb')

const songItemList = $$('.song-item');
const PLAYER_CONFIG = 'TEMPOYO_PLAYER'











const app = {

    config: {},
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playlist: [],
    songs: [
        {
            name: 'Sài Gòn Hôm Nay Mưa',
            singer: 'Hoàng Duyên',
            path: './assets/songs/saigonnaymua.mp3',
            image: './assets/img/song-thumb/saigon.jpg'
        },
        {
            name: 'Khi Em Lớn',
            singer: 'Hoàng Dũng',
            path: './assets/songs/khiemlon.mp3',
            image: './assets/img/song-thumb/song2.png'
        },

        {
            name: 'Thương',
            singer: 'Karik',
            path: './assets/songs/Thuongkarik.mp3',
            image: './assets/img/song-thumb/song3.png'
        },

        {
            name: 'Từng là tất cả',
            singer: 'Karik',
            path: './assets/songs/Tunglatatca.mp3',
            image: './assets/img/song-thumb/song4.png'
        },

        {
            name: 'Đô Trưởng',
            singer: 'Đạt G',
            path: './assets/songs/dotruong.mp3',
            image: './assets/img/song-thumb/song5.png'
        },
        {
            name: 'Sài Gòn Đau Lòng Qúa',
            singer: 'Hứa Kim Tuyền , Hoàng Duyên',
            path: './assets/songs/saigondaulongqua.mp3',
            image: './assets/img/song-thumb/song6.png'
        },

    ],
    render: function () {
        const _this = this;

        // render currentTime + totalTime 
        currentTime.innerText = this.convertTime(audio.currentTime);

        audio.addEventListener('loadedmetadata', function () {
            totalTime.innerText = _this.convertTime(audio.duration);
        });


        // render repeat + shuffle btn
        if (this.isRandom) {
            shuffleBtn.classList.add('active')
        } else shuffleBtn.classList.remove('active')

        if (this.isRepeat) {
            repeatBtn.classList.add('active')
        } else repeatBtn.classList.remove('active')


        // render song thumb in main page

        songThumb.style.backgroundImage = `url(${this.playList[0].image})`;



        // render song info in main page
        const songInfoHtml = `<div class="song-info__name">${this.playList[0].name}</div>
                                <div class="song-info__artist">
                                ${this.playList[0].singer}
                                </div>`
        songInfoBlock.innerHTML = songInfoHtml;

        // render song in songlist page

        const songListPage = this.playList.map(function (song, index) {
            return `<div class="song-item" data-index="${index}" onClick = "app.songItemOnclick(event)">
            <div class="song-item__thumb-container">
                <div class="song-item__thumb " style="background-image: url('${song.image}')" >                          
                </div>
            </div>
            
            <div class="song-item__info">
                <div class="song-item__name">${song.name}</div>
                <div class="song-item__artist">${song.singer}</div>
            </div>
            <div class="song-item__option-btn">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>`
        });
        songListBlock.innerHTML = songListPage.join('')
        $('.song-item').classList.add('active')
    },
    handleEvent: function () {
        // handle Event 
        const _this = this;


        const songThumbAnimate = songThumb.animate(
            [{ transform: 'rotate(360deg)' }],
            {
                duration: 30000,
                iterations: Infinity,
            }
        )
        songThumbAnimate.pause();


        // xu ly viec click song list btn
        songListBtn.onclick = function () {
            songListPage.classList.add('active')
            mainPage.classList.remove('active')
        }


        //Quay ve main page khi click backbtn
        songListBackBtn.onclick = function () {
            mainPage.classList.add('active')
            songListPage.classList.remove('active')
        }

        // Xu ly scroll change header backgroundcolor
        songListPage.onscroll = function (e) {
            if (songListPage.scrollTop > 20) {
                songListHeader.style.backgroundColor = 'var(--primary-color)'
                songListBackBtn.style.color = '#fff'
                songListHeaderTitle.style.color = '#fff'
            }
            else {
                songListHeader.style.backgroundColor = 'unset'
                songListBackBtn.style.color = 'var(--primary-color)'
                songListHeaderTitle.style.color = 'var(--primary-color)'

            }
        }

        // Xu ly khi click play btn 
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

        }

        // Xu li khi click nextBtn 
        nextBtn.onclick = function () {
            // remove the song just finished playing and add at the end of playList
            const tempSong = _this.playList.shift();
            _this.playList.push(tempSong);
            _this.loadCurrentSong();
            _this.render()
            audio.play();
        }

        // Xu li khi click prevBtn 
        prevBtn.onclick = function () {
            // take the song at the end and add at the begin of playList
            const tempSong = _this.playList.pop();
            _this.playList.unshift(tempSong);

            _this.loadCurrentSong();
            _this.render()
            if (!_this.isPlaying) {
                playBtn.classList.add('playing')
                _this.isPlaying = true;
            }
            audio.play();

        }

        // Xu li khi click repeatBtn
        repeatBtn.onclick = function () {
            if (_this.isRepeat) {
                repeatBtn.classList.remove('active')
            } else repeatBtn.classList.add('active')
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)

        }

        // Xu li khi click shuffleBtn
        shuffleBtn.onclick = function () {
            if (_this.isRandom) {
                shuffleBtn.classList.remove('active')

            } else {
                shuffleBtn.classList.add('active')

                // take the current song out of playlist and shuffe the rest
                //  then concat them-> shuffled playList
                const tempSong = _this.playList.shift();
                _this.shufflePlayList(_this.playList)
                _this.playList = [tempSong].concat(_this.playList)
            }
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            _this.render()


        }

        // Xu li khi audio chay
        audio.ontimeupdate = function () {
            if (audio.duration) {
                currentTime.innerText = _this.convertTime(audio.currentTime);
                songProgress.value = audio.currentTime / audio.duration * 100;
            }

        }

        // Xu li khi tua audio
        songProgress.oninput = function () {
            audio.currentTime = songProgress.value * audio.duration / 100;
            currentTime.innerText = _this.convertTime(audio.currentTime);
        }

        // Xu li khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }

        }

        // Xu li khi audio play
        audio.onplay = function () {
            playBtn.classList.add('playing')
            _this.isPlaying = true;
            songThumbAnimate.play();


        }

        // Xu li khi audio pause
        audio.onpause = function () {
            playBtn.classList.remove('playing')
            _this.isPlaying = false;
            songThumbAnimate.pause();
        }

    },
    loadCurrentSong: function () {
        const currentSong = this.playList[0];
        songThumb.style.backgroundImage = `url(${currentSong.image})`;
        audio.src = currentSong.path;

    },
    loadPlaylist: function () {
        this.playList = this.songs;

        if (this.isRandom) {
            //Shuffle Play List
            this.shufflePlayList(this.playList);
        }
    },
    shufflePlayList: function (playList) {
        for (let i = playList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playList[i], playList[j]] = [playList[j], playList[i]];
        }

    },
    convertTime: function (time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time) - minutes * 60;

        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    },
    songItemOnclick: function (event) {
        const _this = this;
        setTimeout(function () {
            if (event.target.closest('.song-item') && !event.target.closest('.song-item__option-btn')) {
                const selectedItem = event.target.closest('.song-item')
                const selectedIndex = selectedItem.getAttribute('data-index');

                if (selectedIndex !== 0) {
                    // Cắt từ item ở index 0 đến trước item đã click
                    // Thêm mảng đã cắt vào cuối playList
                    const tempArr = _this.playList.splice(0, selectedIndex)
                    _this.playList = _this.playList.concat(tempArr)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

            }
        }, 200)

    },
    setConfig: function (key, value) {
        if (!this.config) {
            this.config = {}
        }
        this.config[key] = value;
        localStorage.setItem(PLAYER_CONFIG, JSON.stringify(this.config))
    },
    getConfig: function () {
        this.config = JSON.parse(localStorage.getItem(PLAYER_CONFIG));
        if (this.config) {
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
        } else {
            this.config = {}
        }
    },
    start: function () {
        this.getConfig();
        this.loadPlaylist();
        this.loadCurrentSong();
        this.render();
        this.handleEvent();
    }
}


app.start();