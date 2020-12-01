const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const createPaginatedPages = require('gatsby-paginate');
const userConfig = require('./config');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          {
            posts: allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}
                                            limit: 1000
                                            filter: {frontmatter: {menu: {ne: true}
                                                                   date: {ne: null}}
                                                    }) {
              edges {
                node {
                  fields {
                    slug
                  }
                  excerpt
                  frontmatter {
                    title
                    date(formatString: "MMMM D, YYYY")
                    featuredImage {
                      childImageSharp {
                        sizes(maxWidth: 2850, quality: 100) {
                          base64
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                      }
                    }
                  }
                }
              }
            }
            pagesMenu: allMarkdownRemark(sort: {fields: frontmatter___order, order: DESC}
                                     limit: 1000
                                     filter: {frontmatter: {menu: {eq: true}}}) {
              edges {
                node {
                  fields {
                    slug
                  }
                  excerpt
                  frontmatter {
                    title
                    date(formatString: "MMMM D, YYYY")
                    featuredImage {
                      childImageSharp {
                        sizes(maxWidth: 2850, quality: 100) {
                          base64
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                      }
                    }
                  }
                }
              }
            }
            pagesFooter: allMarkdownRemark(sort: {fields: frontmatter___order, order: DESC}
                                     limit: 1000
                                     filter: {frontmatter: {menu: {eq: true}
                                                            date: {eq: null}}
                                     }) {
              edges {
                node {
                  fields {
                    slug
                  }
                  excerpt
                  frontmatter {
                    title
                    date(formatString: "MMMM D, YYYY")
                    featuredImage {
                      childImageSharp {
                        sizes(maxWidth: 2850, quality: 100) {
                          base64
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.posts.edges;
        const pagesMenu = result.data.pagesMenu.edges;
        const pagesFooter = result.data.pagesFooter.edges;

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPaginatedPages({
            edges: result.data.posts.edges,
            createPage: createPage,
            pageTemplate: 'src/templates/index.js',
            pageLength: userConfig.postsPerPage,
          });

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          });
        });

        _.each(pagesMenu, (page, index) => {
          const previous =
            index === pagesMenu.length - 1 ? null : pagesMenu[index + 1].node;
          const next = index === 0 ? null : pagesMenu[index - 1].node;
          createPage({
            path: page.node.fields.slug,
            component: blogPost,
            context: {
              slug: page.node.fields.slug,
              previous,
              next,
            },
          });
        });

        _.each(pagesFooter, (page, index) => {
          const previous =
            index === pagesFooter.length - 1 ? null : pagesFooter[index + 1].node;
          const next = index === 0 ? null : pagesFooter[index - 1].node;
          createPage({
            path: page.node.fields.slug,
            component: blogPost,
            context: {
              slug: page.node.fields.slug,
              previous,
              next,
            },
          });
        });

      }),
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
