import React from 'react';
import { Link } from '@reach/router';

export default class NotFound extends React.Component {
  render() {
    return (
      <div>
        <p>Page you were looking for does not exists.</p>
        
        <Link to="/resources">Go Back Home</Link>
      </div>
    );
  }
}
