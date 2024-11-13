import React from 'react';

const PostList = ({ posts }) => (
  <div>
    {posts.map((post) => (
      <div key={post.sys.id}>
        <h2>{post.fields.title}</h2>
        <p>{post.fields.description}</p>
      </div>
    ))}
  </div>
);

export default PostList;
