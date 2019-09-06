import React from 'react';
import SignIn from './SignIn';

export default class Welcome extends React.Component {
  render() {
    return <div className="home">
      <img alt="background" className="blurred-bg" />
      <div className="content-2">
{/*         <img className="welcome-logo" />
 */}        <div className="text">
          <p>Welcome to, Jotform Intern Resources</p>
          <p>A Simple Website for Jotform Interns to check out past interns projects and shared resources.</p>
          <p>Click the button below to start using Jotform Intern Resources.Registration is not needed.</p>
        </div>
        <div className="login">
          <SignIn />
        </div>
      </div>
    </div>
  }
}