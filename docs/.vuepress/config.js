const {version} = require('../../package.json');

module.exports = {
    title: `Vuesora v${version}`,
    description: 'A custom front-end framework and Vue component library for the Musora member\'s area',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    evergreen: true,
    themeConfig: {
        logo: '/logo.png',
        nav: [
            {
                text: 'Project Setup',
                link: '/'
            },
            {
                text: 'Layout & Style',
                link: '/layout/'
            }
        ],
        sidebar: 'auto',
        lastUpdated: 'Last Updated',
    }
};