import DataMapper from './_default';

export default class PackBundleDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.card.show_description = true;
        this.card.color_title = null;
        this.card.grey_title = this.postChildLessonCount;

        this.list.column_data = [
            this.postChildLessonCount
        ];
    }
}