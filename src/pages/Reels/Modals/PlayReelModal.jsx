import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button, Option, Select } from '@material-tailwind/react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required().matches(/^\D*$/, 'Name should not contain integers').min(3).max(30),
  email: Yup.string().email().required(),
  // phone: Yup.string().notRequired().matches(/^[0-9]+$/, 'Phone Number must contain only numbers').min(10).max(10).required(),
  password: Yup.string().required().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
  ).matches(/^[^\s]+$/, 'Password must not contain spaces').min(8).max(25)
});

const PlayReelModal = (props) => {
  return (
    <>
      <div id="playReelModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Play Reel
              </h3>

              <button type="button" onClick={() => {
                document.getElementById('playReelModal').classList.toggle('hidden');
                document.getElementById('vid').pause();
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <video style={{height: '500px', width: '330px', objectFit: 'contain', margin: 'auto', borderRadius: '8px'}} src={props?.link} controls playsInline id="vid"></video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayReelModal;
