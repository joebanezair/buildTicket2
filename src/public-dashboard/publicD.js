import React from 'react';

const PublicD = () => {
  return (
    <div>
      <div>Welcome to the Public Page</div>
      <div>You're not logged-in.</div>
      <button>
        <a href="/login">Login</a>
      </button>
    </div>
  );
}

export default PublicD;
