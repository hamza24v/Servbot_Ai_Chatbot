
import React from 'react';
import { raleway } from '../fonts';


const Logo = () => {
    return (
      <div className={`${raleway.className} flex items-center pl-4`}>
        <h1 className="text-4xl font-bold text-blue-800" >
          ServBot AI
        </h1>
      </div>
    );
  };

export default Logo