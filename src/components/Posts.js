import React, {useState}from 'react';
import './css/posts.css'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    height             : '90%',
    transform             : 'translate(-50%, -50%)'
  }
};
const Posts = ({ posts, loading }) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [postData, setPostData] = useState({})
  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (posts == null) {
    return <h2>Sorry! No movie data available.</h2>
  }
  function modalStateChange() {
    isModalOpen? setIsModalOpen(true) : setIsModalOpen(false);
  }

  return (
    <div className='posts_container'>
      {posts.map(post => (
        <div onClick={e => {
          setIsModalOpen(true)
          setPostData(post)
        }} key={post._id} id={post.id} className='posts '>
          {/* <img src={post.thumbnail} alt={post.movie_name} /> */}
          <video data-play="Hover" preload="auto"
            key={post._id}
            poster={post.thumbnail}
            onMouseOver={e => e.target.play()}
            onMouseOut={e => {
              e.target.currentTime = 0
              e.target.pause()
            }}
            muted="muted"
            src={post.video} >
          </video>
          <div className='posts_names'>
            <p>{post.movie_name}</p>
          </div>
        </div>
      ))}
      <Modal
          isOpen={isModalOpen}
          onAfterOpen={modalStateChange}
        onRequestClose={modalStateChange}
        style={customStyles}
          contentLabel="Video View Modal"
      >
        <video style={{width: '100%'}} controls preload="auto"
            key={postData._id}
            src={postData.video} >
          </video>
        <h1>Movie Name: {postData.movie_name}</h1>
        <h2>Movie Language: {postData.language}</h2>
        <h4>Release Date: {new Date(postData.release_date).toLocaleDateString()}</h4>
            <button style={{marginLeft: "auto"}} className='btn btn-success' onClick={e=>setIsModalOpen(false)}>Close</button>
        </Modal>
    </div>
  );
};

export default Posts;
