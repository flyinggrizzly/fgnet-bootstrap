module.exports = {
  siteMetadata: {
    title: `Flying Grizzly`,
    description: `Tabletop games things, code stuff, and general chatter`,
    siteUrl: `https://www.flyinggrizzly.net/`,
    twitterUsername: `@flying_grizzly`,
    author: `Sean DMR`,
  },
  plugins: [
    'gatsby-plugin-resolve-src',
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'fgnet-gatsby'
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        globalScope: `
          import Callout from '${__dirname}/src/components/mdx_components/callout'
          import ImageCaption from '${__dirname}/src/components/mdx_components/image_caption'

          export default {
            Callout,
            ImageCaption
          }
        `,
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: 'gatsby-remark-numbered-footnotes',
          }
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts/`,
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            output: `feed.xml`,
            title: `Flying Grizzly feed`,
            serialize: ({ query: { site, allMdx } }) => {
              return  allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  title: edge.node.fields.title,
                  description: edge.node.fields.excerpt,
                  date: edge.node.fields.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                 allMdx(
                  sort: { order: DESC, fields: [fields___date] },
                ) {
                  edges {
                    node {
                      id
                      body
                      excerpt
                      html
                      fields {
                        slug
                        date
                        title
                        excerpt
                      }
                    }
                  }
                }
              }
            `,
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",

        // WebApp Manifest Configuration
        appName: null, // Inferred with your package.json
        appDescription: null,
        developerName: null,
        developerURL: null,
        dir: "auto",
        lang: "en-US",
        background: "#fff",
        theme_color: "#fff",
        display: "standalone",
        orientation: "any",
        start_url: "/?homescreen=1",
        version: "1.0",
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-clean-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        //icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
