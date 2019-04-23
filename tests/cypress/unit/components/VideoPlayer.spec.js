import VideoPlayer from '../../../../src/components/VideoPlayer/VideoPlayer.vue';
const mountVue = require('cypress-vue-unit-test/src');

const videoProps = {

    hlsManifestUrl: 'https://player.vimeo.com/external/274923593.m3u8?s=9c979ea3779e99a331215c8d003252d760b19c28&oauth2_token_id=1081192161'
};

describe('Video Player', () => {
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

    it('can play and pause', (done) => {
        // Wait 2 seconds after pressing the buttons
        Cypress.vue.$on('playerReady', () => {
            cy.get('[data-cy=play-pause-button]').click();
            cy.wait(2000)
                .then(() => {
                    expect(Cypress.vue.isPlaying).to.be.true;

                    cy.get('[data-cy=play-pause-button]').click();
                    cy.wait(2000)
                        .then(() => {
                            expect(Cypress.vue.isPlaying).to.be.false;
                            done();
                        });
            });
        });
    });

    it('can seek forward and backward 10 seconds', () => {
        cy.get('[data-cy=fast-forward-button]').click();
        cy.wait(1000)
            .then(() => {
                expect(Cypress.vue.currentTime).to.equal(10);
            });

        cy.get('[data-cy=rewind-button]').click();
        cy.wait(1000)
            .then(() => {
                expect(Cypress.vue.currentTime).to.equal(0);
            });
    });

    it('can seek by clicking the progress rail', () => {
        // Click 100px from the left
        cy.get('[data-cy=progress-rail]').click(100, 0);
        cy.wait(3000)
            .then(() => {
                expect(Cypress.vue.currentTime).to.greaterThan(0);
            });
    });
});

