import React from 'react';
import './css/posts.css'

const Posts = ({ posts, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

{/* <div key={post.id} className='posts'>
          {post.title}
        </div> */}

  return (
    <ul className='posts_container'>
      {posts.map(post => (
        <div key={post.id} id={post.id} className='posts '>
          <img src='https://cdn.pocket-lint.com/r/s/1200x/assets/images/151442-cameras-feature-stunning-photos-from-the-national-sony-world-photography-awards-2020-image1-evuxphd3mr.jpg' />
          <div className='posts_names'>
            <p>{post.movie_name}</p>
          </div>
        </div>
      ))}
    </ul>
  );
};

export default Posts;
