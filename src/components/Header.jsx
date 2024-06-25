import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const Header = () => {
  const sentences = [
    'Automate Upgradation to Java 17',
    'Effortlessly Upgrade Your Codebase',
    'Streamline Your Java Migration Process',
    'Upgrade with Confidence',
  ];

  return (
    <header className="bg-sky-200 p-4 font-bold text-zinc-800 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-12 mr-4" />
      </div>
      <div className="text-3xl">
        <Typewriter
          words={sentences}
          loop
          cursor
          cursorStyle='*'
          typeSpeed={50}
          deleteSpeed={30}
          delaySpeed={1000}
        />
      </div>
    </header>
  );
};

export default Header;
