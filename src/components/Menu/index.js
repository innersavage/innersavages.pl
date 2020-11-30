import React from 'react';
import Wrapper from "./Wrapper"
import Link from "./Link"
import { StaticQuery, graphql } from 'gatsby'

const query = graphql`
  query MenuQuery {
    allMarkdownRemark(filter: {frontmatter: {menu: {eq: true}}}, sort: {fields: frontmatter___order, order: ASC}) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            menu
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

const Menu = () => {
  return (
    <StaticQuery query={query}
      render={(items) => (
          <Wrapper>
            <Link to={'/'} key={'00'}>{'Aktualności'}</Link>
            {
              items.allMarkdownRemark.edges.map((item, index) => (<Link to={item.node.fields.slug} key={index}>{item.node.frontmatter.title}</Link>))
            }
          </Wrapper>
        )}
    />
  )
}

export default Menu;