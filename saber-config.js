module.exports = {
  siteConfig: {
    title: "Artin's Blog",
    author: 'Artin',
    email:
      '&#108;&#101;&#110;&#103;&#116;&#104;&#109;&#105;&#110;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;',
    description: 'Web/Python/机器学习/深度学习/自然语言处理',
    url: 'https://lengthmin.me',
  },

  theme: './minimb',
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'About',
        link: '/about',
      },
      {
        text: 'CV',
        link: '/cv',
      },
    ],
    social: {
      twitter: 'lengthmin2',
      github: 'lengthmin',
      rss: true,
    },
    cvConfig: {
      projects: 'pinned-repos',
      skills: [
        {
          topic: 'nodejs',
          description: `I love Node.js and I use it every single day.`,
        },
        {
          topic: 'vue',
          description: `I contribute to Vue ecosytem every a few days`,
        },
        {
          topic: 'webpack',
          description: `I'm pretty good at webpack, probably`,
        },
      ],
    },
  },

  permalinks: {
    page: '/:slug',
    post: '/posts/:slug',
  },

  plugins: [
    {
      resolve: 'saber-plugin-query-posts',
      options: {
        perPage: 6,
      },
    },
    {
      resolve: 'saber-plugin-feed',
      options: {
        atomFeed: true,
      },
    },
  ],
};
