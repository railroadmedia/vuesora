import ContentModel from './_default';

export default class SongContentModel extends ContentModel {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.color_title = this.getPostField('artist');
        this.card.grey_title = ContentModel.mapDifficulty(this.post);

        this.list.color_title = this.getPostField('artist');
        this.list.column_data = [
            ContentModel.mapDifficulty(this.post),
            this.getPostDuration(),
            this.postPublisedOn,
        ];

        if(this.brand === 'guitareo'){
            this.card.color_title = this.getTypeWithIcon();
            this.card.grey_title = this.postInstructor + ', ' + ContentModel.mapDifficulty(this.post);

            this.list.color_title = null;
            this.list.column_data = [
                ContentModel.mapDifficulty(this.post),
                this.getPostField('style'),
                this.postChildLessonCount,
                this.postPublisedOn,
            ]
        }

        if(this.brand === 'pianote'){
            this.card.color_title = this.getTypeWithIcon();

            this.list.column_data = [
                this.getPostField('style'),
                ContentModel.mapDifficulty(this.post),
                this.postPublisedOn,
            ]
        }
    }
}