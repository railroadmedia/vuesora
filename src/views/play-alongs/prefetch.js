import ContentService from '../../assets/js/services/content';

export default {
    data() {
        return {
            fetching: false,
            preFetchedContent: null,
        };
    },

    methods: {
        preFetchContent({ page = 1 }) {
            return new Promise((resolve) => {
                ContentService.getContent({
                    page,
                    required_fields: this.filterQueryObject.required_fields,
                    limit: this.filterQueryObject.limit,
                    brand: this.brand,
                    included_types: ['play-along'],
                    statuses: ['published'],
                    include_future: 0,
                    required_parent_ids: this.showFavoritesOnly ? [this.userPlaylistId] : undefined,
                })
                    .then((response) => {
                        this.loading = false;

                        resolve(response);
                    });
            });
        },
    },
};
