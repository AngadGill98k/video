import React, { useRef } from 'react';
import Navbar from '../navbar/navbar';
import './upload.css';

const Upload = () => {
  const url = 'http://localhost:3001';

  const videoNameRef = useRef(null);
  const videoFileRef = useRef(null);
  const imageRef = useRef(null);

  const handleClick = () => {
    const video_name = videoNameRef.current.value;
    const video = videoFileRef.current.files[0];
    const img = imageRef.current.files[0];

    if (!video_name || !video || !img) {
      return alert("Please fill all fields.");
    }

    const formData = new FormData();
    formData.append("video_name", video_name);
    formData.append("video", video); // must match backend's `upload.fields([{ name: 'video' }, ...])`
    formData.append("img", img);

    fetch(`${url}/up_video`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.msg);
        alert('Upload successful!');
      })
      .catch(err => {
        console.error('Upload failed:', err);
        alert('Error during upload.');
      });
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h2>Upload a Video</h2>
        <input type="text" placeholder="Video Title" ref={videoNameRef} />
        <label>Choose video file:</label>
        <input type="file" ref={videoFileRef} accept="video/*" />
        <label>Choose thumbnail image:</label>
        <input type="file" ref={imageRef} accept="image/*" />
        <button onClick={handleClick}>Upload</button>
      </div>
    </>
  );
};

export default Upload;
