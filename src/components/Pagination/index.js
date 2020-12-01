import React from 'react';

import Wrapper from './Wrapper';
import Button from '../Button';

function Pagination({previousUrl, nextUrl, isFirst = false, isLast = false}) {
  return (
    <Wrapper>
      {!isFirst &&
        <Button to={previousUrl}>&larr; Newer Posts</Button>
      }
      {!isLast &&
        <Button to={nextUrl}>Older Posts &rarr;</Button>
      }
      <div style={{ margin: '10px' }}><a href={'/privacypolicy/'}>Polityka Prywatności</a></div>
      <div style={{ margin: '10px' }}>Inner Savages &copy; 2020</div>
    </Wrapper>
  );
}

export default Pagination;