import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, TextField } from '@mui/material';
import './InvoiceForm.css';

const InvoiceForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploadStatus('Invoice uploading...');

    axios.post(`${process.env.REACT_APP_API_URL}/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setUploadStatus('Invoice uploaded!');
        console.log('File uploaded successfully:', response.data);
        setSelectedFile(null); // Limpa o input de arquivo após o upload
      })
      .catch(error => {
        setUploadStatus('Error uploading invoice');
        console.error('There was an error uploading the file!', error);
      });
  };

  return (
    <div className='invoice-form'>
      <Typography variant='h4' gutterBottom>
        Upload Invoice
      </Typography>
      <input
        accept='application/pdf'
        style={{ display: 'none' }}
        id='raised-button-file'
        type='file'
        onChange={handleFileChange}
      />
      <label htmlFor='raised-button-file'>
        <Button variant='contained' component='span'>
          Choose File
        </Button>
      </label>
      <TextField
        disabled
        variant='outlined'
        margin='normal'
        fullWidth
        value={selectedFile ? selectedFile.name : 'No file chosen'}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleUpload}
        disabled={!selectedFile}
        className={selectedFile ? 'enabled-button' : ''}
      >
        Upload
      </Button>
      {uploadStatus && (
        <Typography variant='body1' gutterBottom>
          {uploadStatus}
        </Typography>
      )}
    </div>
  );
};

export default InvoiceForm;
