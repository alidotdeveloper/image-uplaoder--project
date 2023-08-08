import React, { useState,useEffect } from 'react';
import axios from 'axios';
  
function FileUpload() {
  const [file, setfile] = useState()
  const [images,setImages] = useState([])

  const handleFile = ((e) => {
    setfile(e.target.files[0]);
  })
 

// use effect to display
  
  // in there we will use axios.get() method, it will take link to mentioned in that 
 //  we will add the localhost address
  // and add "then" property for res cosnolelog 
  // for error handle
  
  useEffect(() => {
    // Fetch the list of image file paths from the server
    axios.get('http://localhost:3000/images')
      .then(res => {
        setImages(res.data);
      })
      .catch(err => console.log(err));
  }, []);


  function handleupload() {
    const formdata = new FormData();
    formdata.append("image", file);
    
    axios.post('http://localhost:8080/upload',formdata)
    .then(res => console.log(res))
    .catch(err =>console.log(err))
    
  } 

  return (
      <div className='container'>
      <input type='file' onChange={handleFile}></input>
      <button onClick={handleupload}>Upload</button>

     
      <div className="image-container">
        {images.map((imagePath, index) => (
          <img key={index} src={`http://localhost:3000/images/${imagePath}`} width="200px"alt={"img"} />
        ))}

        
      </div>
    </div>
  );
}

         
  
  


export default FileUpload