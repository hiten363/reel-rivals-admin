import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button, Option, Select } from '@material-tailwind/react';
import * as Yup from 'yup';
import FileInput from '@/Util/FileInput';
import { getAge } from '@/Util/utils';

const schema = Yup.object().shape({
  name: Yup.string().required().matches(/^\D*$/, 'Name should not contain integers').min(3).max(30),
  email: Yup.string().email().required(),
  // phone: Yup.string().notRequired().matches(/^[0-9]+$/, 'Phone Number must contain only numbers').min(10).max(10).required(),
  password: Yup.string().required().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
  ).matches(/^[^\s]+$/, 'Password must not contain spaces').min(8).max(25)
});

const AddUserModal = (props) => {
  const { createUser } = useMain();

  const [value, setValue] = useState({
    name: '',
    email: '',
    phone: '',
    userName: '',
    password: '',
    dob: '',
    password1: '',
    role: 'USER',
    userPermissions: [],
    file: ''
  });

  const handleChange = (e, name = "") => {
    if (name === "") {
      if (e.target.name === 'file') {
        setValue({ ...value, [e.target.name]: e.target.files[0] });
      }
      else {
        setValue({ ...value, [e.target.name]: e.target.value });
      }
    }
    else {
      setValue({ ...value, [name]: e });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);

    if (!value.role || value.role === "") {
      alert('Role is required');
      return;
    }

    if (value.password !== value.password1) {
      alert('Password and Confirm Password must be same');
      return;
    }

    if (getAge(value.dob) < 18) {
      notify('error', 'User must be at least 18 years old');
      return;
    }
    try {
      let validate = await schema.validate(value);

      const ans = await createUser({ ...value });
      console.log(ans);
      if (ans.status) {
        setValue({
          name: '',
          email: '',
          phone: '',
          userName: '',
          password: '',
          dob: '',
          password1: '',
          role: 'SUBADMIN',
          userPermissions: [],
          file: ''
        });
        props.notify('success', ans.message);
        props.setRefreshFlag(!props.refreshFlag);
        document.getElementById('addUserModal').classList.toggle('hidden');
        window.location.reload();
      }
      else {
        props.notify('error', ans.message);
      }
    } catch (error) {
      props.notify('error', error?.message?.replace('name', 'Name'));
    }
  };

  return (
    <>
      <div id="addUserModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add new user
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('addUserModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter User details</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>
                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                      <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Name .." onChange={handleChange} value={value.name} required />
                    </div>

                    <div>
                      <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
                      <input type="text" id="userName" name="userName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter User Name .." onChange={handleChange} value={value.userName} required />
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                      <input type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter User Email .." onChange={handleChange} value={value.email} required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 ">Phone</label>
                      <input type="number" id="phone" name='phone' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter User Phone .." onChange={handleChange} value={value.phone} required />
                    </div>
                    <div>
                      <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 ">D.O.B</label>
                      <input type="date" id="dob" name='dob' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter dob .." onChange={handleChange} value={value.dob} required />
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Create Password .." onChange={handleChange} value={value.password} required />
                    </div>
                    <div>
                      <label htmlFor="password1" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm Password</label>
                      <input type="password" id="password1" name='password1' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Re-type Password .." onChange={handleChange} value={value.password1} required />
                    </div>

                    {/* <div>
                      <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 ">Role</label>
                      <Select
                        label="Select Role"
                        animate={{
                          mount: { y: 0 },
                          unmount: { y: 25 }
                        }}
                        value={value.role}
                        name="role"
                        onChange={(e) => handleChange(e, 'role')}
                        children={<p>Select Role</p>}
                      >
                        <Option value="USER" children={<p>User</p>}>User</Option>
                        <Option value="SUBADMIN" children={<p>Sub Admin</p>}>Sub Admin</Option>
                      </Select>
                    </div> */}

                    <FileInput value={value} setValue={setValue} isRequired={true} />
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

export default AddUserModal;
