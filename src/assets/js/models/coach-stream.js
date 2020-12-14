import ContentModel from './_default';

export default class CoachStreamModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.getPostDuration(),
            this.postPublisedOn, // todo - may be remaped to live event start
        ];
    }
}
