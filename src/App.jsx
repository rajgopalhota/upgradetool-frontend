import React from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';

const App = () => {
  return (
    <div className="bg-gradient-to-tr from-sky-50 to-violet-50 h-full">
      <Header />
      <FileUpload />
    </div>
  );
}

export default App;
