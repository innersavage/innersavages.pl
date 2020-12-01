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
                                            filter: {frontmatter: {menu: {ne: true}}}) {
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
                        sizes(maxWidth: 850) {
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
            pages: allMarkdownRemark(sort: {fields: frontmatter___order, order: DESC}
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
                        sizes(maxWidth: 850) {
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
        const pages = result.data.pages.edges;

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

        _.each(pages, (page, index) => {
          const previous =
            index === pages.length - 1 ? null : pages[index + 1].node;
          const next = index === 0 ? null : pages[index - 1].node;
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
