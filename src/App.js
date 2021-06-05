import React, { useState, useEffect } from 'react';
import Posts from './components/Posts';
import Pagination from './components/Pagination';
import axios from 'axios';
import Modal from 'react-modal'
import './App.css';
import {storage} from './firebase'


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(2);
  const [postLimit, setPostLimit] = useState(postsPerPage)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await axios.get('https://intern-backend.herokuapp.com/getall');
      console.log(res)
      setPosts(res.data.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const [addMovieState, setAddMovieState] = useState(false)

  function addMovieStateChange() {
    !addMovieState? setAddMovieState(true):setAddMovieState(false)
  }
  const [thumbnail, setThumbnail] = useState(null)
  const [video, setVideo] = useState(null)
  const [movieName, setMovieName] = useState(null)
  const [language, setLanguage] = useState(null)
  const [date, setDate] = useState(null)
  
  const [videoSelect, setVideoSelect] = useState(null)
  const [imgSelect, setImgSelect] = useState(null)
  const [imgProgress, setImgProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [movieDataUploading, setMovieDataUploading] = useState(false)
  const [error, setError] = useState({
    status: null,
    color: null,
    message: null
  })
  

  var uploadImg = ()=> {
    const uploadTask = storage.ref(`images/${imgSelect.name}`).put(imgSelect);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImgProgress(progress)
        
      },
      error => {
        // Error function ...
        console.log(error);
      },
      async() => {
        // complete function ...
        await storage
          .ref("images")
          .child(imgSelect.name)
          .getDownloadURL()
          .then(url => {
            setThumbnail(url)
          });
      }
    );
  }
  var uploadVideo = () => {
    const uploadTask = storage.ref(`video/${videoSelect.name}`).put(videoSelect);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setVideoProgress(progress)
      },
      error => {
        // Error function ...
        console.log(error);
      },
      async() => {
        // complete function ...
        await storage
          .ref("video")
          .child(videoSelect.name)
          .getDownloadURL()
          .then(url => {
            setVideo(url)
          });
      }
    );
  };
  var addMovieData = async (moviename, language, releaseDate, thumbnail, video) => {
    setMovieDataUploading(true)
    const data = {
      movie_name: moviename,
      release_date: releaseDate,
      language: language,
      thumbnail: thumbnail,
      video: video
    };
    axios.post('https://intern-backend.herokuapp.com/uploaddata', data)
      .then(response => {
        setError({
          status: response.data.status,
          color: 'green',
          message: response.data.message
        })
        console.log(response.data)
        setMovieDataUploading(false)
      }).catch(err => {
        setError({
          status: err.status,
          color: 'red',
          message: err.message
        })
        setMovieDataUploading(false)
        });
    // console.log(moviename)
    // console.log(language)
    // console.log(releaseDate)
    // console.log(thumbnail)
    // console.log(video)
  }

  return (
    <div>
      <nav className='navbar'>
        <h1 className='nav_title'>Movie site</h1>
        <div>
          <input placeholder='Paginate Post No' onChange={e => setPostLimit(e.target.value)} type='number' />
          <button onClick={e=>setPostsPerPage(postLimit)} className='btn btn-success-outline'>set</button>
        </div>
        <button onClick={e=>setAddMovieState(true)} className='btn btn-danger'>Add Movie</button>
      </nav>
      <Posts posts={currentPosts} loading={loading} />
      <div className='paginate'>
        {
          loading===true?null:<Pagination 
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
        />
        }
          
      </div>
      <Modal
          isOpen={addMovieState}
          // onAfterOpen={addMovieStateChange}
          onRequestClose={addMovieStateChange}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <form>
          <h3>Add New Movie Data</h3><br/>
            <label class="sr-only" for="inlineFormInputName">Movie Name</label>
          <input onChange={e=>setMovieName(e.target.value)} type="text" class="form-control" id="inlineFormInputName" placeholder="Movie Name: Ex. Inception" required/><br/>
          <label class="sr-only" for="inlineFormInputName">Movie Language</label>
          <input onChange={e=>setLanguage(e.target.value)} type="text" class="form-control" id="inlineFormInputName" placeholder="Lanuage: Ex. English" required/><br/>
          <label class="sr-only" for="inlineFormInputName">Release Date</label>
          <input onChange={e=>setDate(e.target.value)} type="date" class="form-control" id="inlineFormInputName" placeholder="Release Date: 5/6/1999"  required/><br />
          <label>Choose Video Thumbnail:</label><br/>
          <input onChange={e=>setImgSelect(e.target.files[0])} type="file" accept=".gif,.jpg,.jpeg,.png," placeholder='Video Thumbnail' capture required/>
          <p onClick={e => {
            if (thumbnail == null) {
              imgSelect === null ? setError({
                status: null,
                color: 'red',
                message: 'You have to select a thumbnail first.'
              }):uploadImg()
            } else {
              setError({
                status: null,
                color: 'red',
                message: 'You have already uploaded video thumbnail.'
              })
            }
          }} className='btn btn-success'>{thumbnail == null ? 'Upload' : 'Done'}</p><br/>
          <progress id="file" value={imgProgress} max="100"> </progress>
          <br /><br />
          <label>Choose Video:</label><br/>
          <input onChange={e=>setVideoSelect(e.target.files[0])} type="file" accept=".mp4,.mov" capture required/>
          <p onClick={e => {
            if (video == null) {
              videoSelect===null?setError({
                status: null,
                color: 'red',
                message: 'You have to select a video first.'
              }):uploadVideo()
            } else {
              setError({
                status: null,
                color: 'red',
                message: 'You have already uploaded movie video.'
              })
            }
          }} className='btn btn-success'>{video == null ? 'Upload' : 'Done'}</p><br/>
          <progress id="file" value={videoProgress} max="100"></progress><br /><br />
          <p style={{color: error.color}}>
            {
            error.message===null?null:error.message
          }
          </p>
          <br />
          <p className='btn btn-danger float-left' onClick={e => {
            setMovieName(null)
            setVideo(null)
            setThumbnail(null)
            setVideoSelect(null)
            setImgSelect(null)
            setDate(null)
            setLanguage(null)
            
          }}>Close</p>
          <p class="btn btn-primary float-right" onClick={e => {
            if (movieName === null) {
              setError({
                status: null,
                color: 'red',
                message: 'You have to give movie name.'
              })
            } else if (language === null) {
              setError({
                status: null,
                color: 'red',
                message: 'You have to give movie language.'
              })
            } else if (date === null) {
              setError({
                status: null,
                color: 'red',
                message: 'You have to give movie release date.'
              })
            } else if (thumbnail === null) {
              setError({
                status: null,
                color: 'red',
                message: 'You have to upload thumbnail first'
              })
            } else if(video===null){
              setError({
                status: null,
                color: 'red',
                message: 'You have upload video first'
              })
            } else {
              addMovieData(movieName, language, new Date(date), thumbnail, video);
            }
          }}>Add Movie {
              movieDataUploading?<i class="fa fa-spinner fa-spin"></i>:null
            }
          </p>
          </form>
        </Modal>
    </div>
  );
};

export default App;
