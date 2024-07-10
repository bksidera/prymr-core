import React from 'react';

function Comment({ username, content }) {
  return (

    <div className="comment">

    <p><strong>Someone said:</strong> {content}</p>
    </div>


  );
}

export default Comment;
