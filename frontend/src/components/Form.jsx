import React, { useRef } from 'react';
import axios from 'axios';


function Form()
{
  const fileValue = useRef();
  const audioVideo = useRef();

  const handleFile = async () => {

    try {
      console.log(fileValue.current.files[0]);
      let file = fileValue.current.files[0];
      let formData = new FormData();
      formData.append('file', file);

      // console.log(formData);
      const data = await axios.post('http://localhost:5500/submit', formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
      console.log('response::::', data);
    }
    catch (error) {
      console.log(error);
    }

  }

  const handleAudioVideo = async()=>
  {
    const transScript = document.getElementById('transScript');
    try 
    {
      transScript.innerHTML = 'Loading...';
      let selectedVideoAudio = audioVideo.current.files[0];
      let videoAudio = new FormData();
      videoAudio.append('file',selectedVideoAudio);
      const data = await axios.post('http://localhost:5500/createTranscript',videoAudio,
      {
      headers:
      {
        "Content-Type": "multipart/form-data",
      }
      });

      console.log(data);
      transScript.innerHTML = data.data;
      
    }
     catch (error)
    {
      console.log(error);  
    }
  }
  return (
    <div>
      <form className='form' action="">

        <div>
          <label htmlFor="fileToUpload">Select Image To Upload</label>
          <input ref={fileValue} style={{ padding: '1rem' }} id='fileToUpload' type="file" />
          <button style={{padding:'.7rem'}} type='button' onClick={handleFile}>Upload</button>
        </div>

        <div>
          <label htmlFor="VideoAudio">Select Video Or Audio</label>
          <input ref={audioVideo} style={{ padding: '1rem' }} id='VideoAudio' type="file" />
          <button style={{padding:'.7rem'}} type='button' onClick={handleAudioVideo}>Upload</button>
        </div>
      </form>
      <div className='transScriptHolder'>

        <p id='transScript' className='transcript'>TransScript Here</p>
      </div>
    </div>
  )
}

export default Form;