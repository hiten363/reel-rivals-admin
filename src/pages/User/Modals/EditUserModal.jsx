import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required().matches(/^\D*$/, 'Name should not contain integers').min(3).max(30),
  // email: Yup.string().email().required(),
  phone: Yup.string().matches(/^[0-9]+$/, 'Must contain only numbers').min(10).max(10).required(),
  // password: Yup.string().required().matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
  // ).matches(/^[^\s]+$/, 'Password must not contain spaces').min(8).max(25)
});

const EditUserModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateUser } = useMain();

  const [value, setValue] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        console.log(data);
        setValue({
          _id: data._id,
          name: data?.name,
          phone: data?.phone && data?.phone!=="undefined" ? data?.phone : ''
        });
      }
    }
  }, [data]);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(value);
      let validate=await schema.validate(value);
  
      const ans = await updateUser({ ...value });
      console.log(ans);
      if (ans.status) {
        setValue({
          name: '',
          phone: ''
        });
        notify('success', ans.message);
        setRefreshFlag(!refreshFlag);
        document.getElementById('editUserModal').classList.toggle('hidden');
      }
      else {
        notify('error', ans.message);
      }
    } catch (error) {
      notify('error', error?.message?.replace('name', 'Name'));
    }
  };

  return (
    <>
      <div id="editUserModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Update User
              </h3>

              <button type="button" onClick={() => {
                document.getElementById('editUserModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update User details</h4>
                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>
                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name1" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                      <input type="text" id="name1" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Name .." onChange={handleChange} value={value.name} required />
                    </div>
                    <div>
                      <label htmlFor="phone1" className="block mb-2 text-sm font-medium text-gray-900 ">Phone</label>
                      <input type="text" id="phone1" name="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter phone number .." onChange={handleChange} value={value.phone} />
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button type='submit' children="Submit">Submit</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;
