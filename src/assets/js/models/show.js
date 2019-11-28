import ContentModel from './_default';

export default class ShowContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postInstructor;

        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.getPostDuration(),
            this.postPublisedOn,
        ];

        if (this.brand === 'pianote') {
            this.card.color_title = this.getTypeWithIcon();
        }

        if (this.brand === 'guitareo') {
            this.card.color_title = this.getTypeWithIcon().replace(/recording/, 'archives');
        }

        if (this.displayEpisodeNumber) {
            this.list.color_title = this.episodeNumber;
            this.card.color_title = this.episodeNumber;
        }
    }

    get displayEpisodeNumber() {
        const showsThatShouldDisplayEpisodeNumbers = [
            'rhythmic-adventures-of-captain-carson',
            'exploring-beats',
            'podcasts',
            'study-the-greats',
            'rhythms-from-another-planet',
            'behind-the-scenes',
            'diy-drum-experiments',
            'in-rhythm',
        ];

        return showsThatShouldDisplayEpisodeNumbers.indexOf(this.post.type) !== -1;
    }
}
