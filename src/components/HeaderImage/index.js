import React from 'react';
import Link from 'gatsby-link';

import Wrapper from './Wrapper';
import imgSrc from '../../innersavages_logo.svg';

function HeaderImage() {
  return (
    <Wrapper>
      <Link to="/">
        <img src={imgSrc} alt="Inner Savages Logo"/>
      </Link>
    </Wrapper>
  );
}

export default HeaderImage;
