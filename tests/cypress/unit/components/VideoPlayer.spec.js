import VideoPlayer from '../../../../src/components/VideoPlayer/VideoPlayer.vue';
const mountVue = require('cypress-vue-unit-test/src');

const videoProps = {
    hlsManifestUrl: 'https://player.vimeo.com/external/274923593.m3u8?s=9c979ea3779e99a331215c8d003252d760b19c28&oauth2_token_id=1081192161',
    captions: [{language:"en",url:"https://captions.cloud.vimeo.com/captions/4987495.vtt?expires=1556233938&sig=7dc2b492cbe9088a9dec8f5b8ca4649708d31988&download=dcb-37a-introduction.scc.vtt"}]
};

describe('Video Player - HLS', () => {
    beforeEach(mountVue(VideoPlayer, {
        propsData: videoProps
    }));

    it('renders', () => {
        cy.get('[data-vjs-player]');
    });

    it('renders a control bar', () => {
        cy.get('.controls-wrap');
    });

    it('adds a source to the video element', () => {
        cy.get('video').should('have.attr', 'src');
    });

    it('removes the loading animation', (done) => {
        Cypress.vue.$once('canplaythrough', () => {

            cy.wait(500).then(() => {
                expect(Cypress.vue.loading).to.be.false;

                done();
            });
        });
    });

    it('sets the ready flag', (done) => {
        Cypress.vue.$once('playerReady', () => {
            expect(Cypress.vue.playerReady).to.be.true;

            done();
        });
    });

    it('creates an HLS instance', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            expect(Cypress.vue.hlsInstance).to.be.not.null;

            done();
        });
    });

    it('gets the total duration of the video', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            expect(Cypress.vue.totalDuration).to.be.greaterThan(0);

            done();
        });
    });

    it('can get the current source', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            expect(Cypress.vue.currentSource).to.not.be.null;

            done();
        });
    });

    it('can play and pause', (done) => {

            Cypress.vue.$once('canplaythrough', () => {
                Cypress.vue.playPause();

                Cypress.vue.$once('playing', () => {
                    expect(Cypress.vue.isPlaying).to.be.true;
                    Cypress.vue.playPause();

                    Cypress.vue.$once('paused', () => {
                        expect(Cypress.vue.isPlaying).to.be.false;

                        done();
                    });
                });
            });
        });

    it('can seek', (done) => {
        const timeToSeekTo = 20;

        Cypress.vue.$once('canplaythrough', () => {
            Cypress.vue.seek(timeToSeekTo);

            Cypress.vue.$once('canplaythrough', () => {
                expect(Cypress.vue.currentTime).to.equal(timeToSeekTo);

                done();
            });
        });
    });

    it('can fullscreen', (done) => {

        Cypress.vue.$once('playerReady', () => {
            Cypress.vue.fullscreen();
            expect(Cypress.vue.videojsInstance.isFullscreen()).to.be.true;

            done();
        });
    });

    it('can change the volume', (done) => {

        Cypress.vue.$once('playerReady', () => {
            Cypress.vue.changeVolume({ volume: 50 });
            expect(Cypress.vue.currentVolume).to.equal(.5);

            done();
        });
    });

    it('can format a time in seconds value', () => {
        const time = Cypress.vue.parseTime(60);

        expect(time).to.equal('1:00');
    });

    it('can set the playback quality', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            Cypress.vue.setQuality({ index: 2 });
            expect(Cypress.vue.currentSourceIndex).to.equal(2);

            done();
        });
    });

    it('can set the playback rate', (done) => {

        Cypress.vue.$once('canplaythrough', () => {
            Cypress.vue.setRate({rate: 0.5});

            // For some reason a small wait needs to be put in
            cy.wait(1000).then(() => {
                expect(Cypress.vue.currentPlaybackRate).to.equal(0.5);

                done();
            });
        });
    });

    it('can set the default playback quality', () => {
        Cypress.vue.setDefaultPlaybackQualityWidth('1280');

        expect(window.localStorage.getItem('vuesoraDefaultVideoQuality')).to.equal('1280');
    });

    it('can get the default playback quality', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            const qualityIndex = Cypress.vue.getDefaultPlaybackQualityIndex();
            expect(qualityIndex).to.be.greaterThan(-1);

            done();
        });
    });

    it('can toggle the settings drawer', () => {
        Cypress.vue.toggleSettingsDrawer();
        expect(Cypress.vue.settingsDrawer).to.be.true;

        Cypress.vue.toggleSettingsDrawer();
        expect(Cypress.vue.settingsDrawer).to.be.false;
    });

    it('can toggle the captions drawer', () => {
        Cypress.vue.toggleCaptionsDrawer();
        expect(Cypress.vue.captionsDrawer).to.be.true;

        Cypress.vue.toggleCaptionsDrawer();
        expect(Cypress.vue.captionsDrawer).to.be.false;
    });

    it('can set the captions', (done) => {
        Cypress.vue.$once('canplaythrough', () => {
            Cypress.vue.enableCaptions({
                label: 'English',
                language: 'en',
            });

            expect(Cypress.vue.currentCaptions).to.equal('en');
            done();
        });
    });
});

