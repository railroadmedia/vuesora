import ContentModel from './_default';
import {DateTime} from "luxon";

export default class CoachStreamModel extends ContentModel {
    constructor({ brand = 'drumeo', post }) {
        super({
            brand,
            post,
        });

        this.list.column_data = [
            DateTime.fromSQL(this.post.live_event_start_time_in_timezone).toFormat('LLL d/yy'),
            DateTime.fromSQL(this.post.live_event_start_time_in_timezone).toFormat('h:mm a'),
        ];
    }
}
