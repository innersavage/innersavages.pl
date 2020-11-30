import styled from 'styled-components';
import GatsbyLink from 'gatsby-link';
import userConfig from '../../../config';

const Link = styled(GatsbyLink)`
  color: ${userConfig.menuColor};
  font-size: medium;
  text-decoration: none;
  margin: 0 10px 0 10px;
  float: left;
`;

export default Link;