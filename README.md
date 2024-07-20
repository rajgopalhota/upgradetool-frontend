import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

const RepoUploader = () => {
    const [repoLink, setRepoLink] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRepoLinkChange = (event) => {
        setRepoLink(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDownloadAndUpload = async () => {
        try {
            const auth = btoa(`${username}:${password}`);
            const response = await axios.get(repoLink, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            const zip = new JSZip();
            zip.file('repo.zip', response.data);

            const content = await zip.generateAsync({ type: 'blob' });

            const formData = new FormData();
            formData.append('file', content, 'repository.zip');

            await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Repository uploaded successfully!');
        } catch (error) {
            console.error('Error uploading repository:', error);
            alert('Failed to upload repository.');
        }
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Enter Stash repo link" 
                value={repoLink}
                onChange={handleRepoLinkChange}
            />
            <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={handleUsernameChange}
            />
            <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={handlePasswordChange}
            />
            <button onClick={handleDownloadAndUpload}>Upload Repository</button>
        </div>
    );
};

export default RepoUploader;
