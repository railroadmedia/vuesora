<template>
    <div id="playAlongsPlayer" class="container collapsed fluid bg-white shadow"
         :class="collapsed ? 'collapsed-down' : ''">

        <span v-if="loop"
              id="anchorA" class="loop-anchor bg-drumeo text-white body rounded noselect pointer"
              :style="'left:' + anchor_offsets.a + '%;'"
              @mousedown="initializeDrag('a')">
            A
        </span>

        <span v-if="loop"
              id="anchorB" class="loop-anchor bg-drumeo text-white body rounded noselect pointer"
              :style="'left:' + anchor_offsets.b + '%;'"
              @mousedown="initializeDrag('b')">
            B
        </span>

        <div class="player-tab title text-drumeo bg-white shadow flex-center pointer"
             @click="collapsed = !collapsed">
            <i class="fas"
               :class="collapsed ? 'fa-plus' : 'fa-minus'"></i>
        </div>

        <div class="flex flex-row hide">
            <audio id="audioPlayer" preload="auto">
                <source :src="$_active_track">
            </audio>
        </div>

        <div class="progress-container flex flex-row bg-grey-5 pointer"
             @click="seekViaProgressBar">
            <div class="progress-amount bg-drumeo"
                 :style="'width:' + $_currentPosition + '%;'"></div>
        </div>

        <div class="flex flex-row align-h-center pv-1">
            <div class="flex flex-column">
                <h4 class="title text-center">{{ $_title }}</h4>
                <h6 class="body text-center">{{ $_style }} @ {{ $_bpm }} BPM</h6>
            </div>
        </div>

        <div class="flex flex-row align-h-center pv-1">

            <button class="btn collapse-square mh-1 skip-10"
                    @click="skipTen(false)">
                <span class="flat bg-black">
                    <i class="fas fa-undo"></i>
                </span>
            </button>

            <button class="btn collapse-square mh-1"
                    @click="playPause">
                <span class="flat bg-black">
                    <i class="fas"
                       :class="$_isPlaying ? 'fa-pause' : 'fa-play'"></i>
                </span>
            </button>

            <button class="btn collapse-square mh-1 skip-10"
                    @click="skipTen(true)">
                <span class="flat bg-black">
                    <i class="fas fa-redo"></i>
                </span>
            </button>
        </div>

        <div class="flex flex-row bg-grey-5 pv-1 align-h-center">
            <button class="btn collapse-square mh-1"
                    @click="toggleMetronome">
                <span class="bg-white rounded"
                      :class="metronome ? 'text-grey-5' : 'inverted text-white'">
                    <i class="icon-metronome"></i>
                </span>
            </button>

            <button class="btn collapse-square mh-1"
                    @click="toggleDrums">
                <span class="bg-white rounded"
                      :class="drums ? 'text-grey-5' : 'inverted text-white'">
                    <i class="icon-drums"></i>
                </span>
            </button>

            <button class="btn collapse-square mh-1"
                    @click="toggleLoop">
                <span class="bg-white rounded"
                      :class="loop ? 'text-grey-5' : 'inverted text-white'">
                    <i class="fa fa-repeat"></i>
                </span>
            </button>
        </div>
    </div>
</template>
<script>
    import 'mediaelement/full';

    export default {
        name: 'play-alongs-player',
        props: {
            $_active_item: Object,
        },
        data(){
            return {
                metronome: true,
                drums: false,
                loop: false,
                collapsed: false,
                dragging: false,
                audioPlayer: undefined,
                currentDuration: 0,
                currentTime: 0,
                anchor_offsets: {
                    a: 0,
                    b: 100
                },
                draggingAnchor: null
            }
        },
        computed: {

            $_title(){
                return this.$_active_item.title;
            },

            $_style(){
                return this.$_active_item.style;
            },

            $_bpm(){
                return this.$_active_item.bpm;
            },

            $_active_track(){
                if(this.metronome && this.drums){
                    return this.$_active_item.mp3_yes_drums_yes_click_url;
                }
                else if(this.metronome && !this.drums){
                    return this.$_active_item.mp3_no_drums_yes_click_url;
                }
                else if(!this.metronome && this.drums){
                    return this.$_active_item.mp3_yes_drums_no_click_url;
                }

                return this.$_active_item.mp3_no_drums_no_click_url;
            },

            $_currentPosition(){
                return (this.currentTime / this.currentDuration) * 100;
            },

            $_isPlaying: {
                cache: false,
                get(){
                    return this.audioPlayer ? !this.audioPlayer.paused : false;
                }
            },

            $_anchorOffsetsInSeconds(){
                return {
                    a: (this.anchor_offsets['a'] / 100) * this.currentDuration,
                    b: (this.anchor_offsets['b'] / 100) * this.currentDuration
                }
            }
        },
        methods:{

            playPause(){
                if(this.$_isPlaying){
                    this.audioPlayer.pause();
                }
                else {
                    this.audioPlayer.play();
                }
            },

            toggleDrums(){
                this.drums = !this.drums;
                this.setSource(true);
            },

            toggleMetronome(){
                this.metronome = !this.metronome;
                this.setSource(true);
            },

            toggleLoop(){
                this.loop = !this.loop;
                this.anchor_offsets['a'] = 0;
                this.anchor_offsets['b'] = 100;
            },

            setSource(retain_position = false){
                let current_position = this.audioPlayer.getCurrentTime();

                this.$nextTick(function(){
                    this.audioPlayer.setSrc(this.$_active_track);
                    this.audioPlayer.play();

                    if(retain_position){
                        this.audioPlayer.setCurrentTime(current_position);
                    }
                });
            },

            skipTen(forward = true){
                let new_position = this.currentTime - 10;

                if(forward){
                    new_position = this.currentTime + 10;
                }

                this.audioPlayer.setCurrentTime(new_position);
            },

            seekViaProgressBar(event){
                const percentToSeekTo = event.offsetX / window.innerWidth;
                const offsetToSeekTo = this.currentDuration * percentToSeekTo;

                this.audioPlayer.setCurrentTime(offsetToSeekTo);
            },


            initializeDrag(anchor){
                this.dragging = true;
                this.draggingAnchor = anchor;
            },

            handleAnchorDrag(event){
                const xOffsetPercent = event.clientX / window.innerWidth;

                if(this.dragging){
                    if(this.draggingAnchor === 'a'){
                        if((xOffsetPercent * 100) >= this.anchor_offsets['b']){
                            this.anchor_offsets['a'] = this.anchor_offsets['b'] - 1;
                        }
                        else {
                            this.anchor_offsets[this.draggingAnchor] = (xOffsetPercent * 100);
                        }
                    }

                    if(this.draggingAnchor === 'b'){
                        if((xOffsetPercent * 100) <= this.anchor_offsets['a']){
                            this.anchor_offsets['b'] = this.anchor_offsets['a'] + 1;
                        }
                        else {
                            this.anchor_offsets[this.draggingAnchor] = (xOffsetPercent * 100);
                        }
                    }
                }
            }
        },
        mounted(){
            const vm = this;

            this.$parent.$on('songUpdate', event => {
                if(vm.audioPlayer){
                    vm.setSource(false);
                }
            });

            window.audioPlayer = new MediaElementPlayer('audioPlayer', {
                src: this.$_active_track,
                success: function(mediaElement){
                    vm.audioPlayer = mediaElement;

                    vm.audioPlayer.addEventListener('timeupdate', event => {
                       vm.currentTime = vm.audioPlayer.getCurrentTime();
                       vm.currentDuration = vm.audioPlayer.duration;

                       if(vm.loop){
                           if(vm.currentTime < vm.$_anchorOffsetsInSeconds['a']){
                               vm.audioPlayer.setCurrentTime(vm.$_anchorOffsetsInSeconds['a']);
                           }

                           if(vm.currentTime > vm.$_anchorOffsetsInSeconds['b']){
                               vm.audioPlayer.setCurrentTime(vm.$_anchorOffsetsInSeconds['a']);
                           }
                       }
                    });

                    vm.audioPlayer.play();
                }
            });

            document.body.addEventListener('mousemove', event => {
                this.handleAnchorDrag(event);
            });

            document.body.addEventListener('mouseup', event => {
                this.dragging = false;
                this.draggingAnchor = null;
            });
        }
    }
</script>