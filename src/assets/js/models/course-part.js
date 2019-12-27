import ContentModel from './_default';

export default class CoursePartContentModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.card.color_title = this.postInstructor;
        this.card.content_type = '<i class="icon-courses" style="margin-right:5px;"></i> Course Lesson';

        this.list.show_numbers = true;
        this.list.color_title = null;

        if (this.brand === 'guitareo') {
            this.card.color_title = this.getTypeWithIcon();

            this.list.column_data = [
                this.postDuration,
            ];
        }
    }
}
