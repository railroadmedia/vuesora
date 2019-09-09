import ContentService from '../../assets/js/services/content';

export default {
    data() {
        return {
            fetching: false,
            preFetchedContent: null,
        };
    },

    methods: {
        preFetchContent(page = 1) {
            if (!this.fetching) {
                this.fetching = true;

                return ContentService.getContent({
                    page,
                    included_fields: this.filterQueryObject.included_fields,
                    limit: this.filterQueryObject.limit,
                    brand: this.brand,
                    included_types: ['play-along'],
                    statuses: ['published'],
                })
                    .then((response) => {
                        if (response) {
                            const playedContentIds = this.playedContent.map(content => content.id);
                            const fetchedContentIds = response.data.data.map(data => data.id);

                            const allContentHasBeenPlayed = playedContentIds
                                .filter(id => fetchedContentIds.indexOf(id) !== -1).length === fetchedContentIds.length;

                            if (allContentHasBeenPlayed) {
                                this.preFetchContent(this.getRandomPageNumber());
                            } else {
                                this.preFetchedContent = response;
                            }
                        }
                        this.fetching = false;

                        return Promise.resolve(response != null);
                    });
            }

            return Promise.resolve(false);
        },

        appendPreFetchedContent() {
            if (this.preFetchedContent !== null && !this.loading) {
                this.content = this.preFetchedContent.data.data;
                this.page = this.preFetchedContent.data.meta.page;
                this.totalResults = this.preFetchedContent.data.meta.totalResults;

                this.preFetchedContent = null;

                this.loading = false;
            } else {
                this.loading = true;

                this.preFetchContent()
                    .then((resolved) => {
                        if (resolved) {
                            this.appendPreFetchedContent();
                        }
                    });
            }
        },
    },
};
