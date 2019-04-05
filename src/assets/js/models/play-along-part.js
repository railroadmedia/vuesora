import DataMapper from './_default';

export default class PlayAlongPartDataMapper extends DataMapper {
    constructor({brand = 'drumeo', post}){
        super({
            brand,
            post
        });

        this.list.column_data = [
            this.getPostDuration(),
        ];
    }
}