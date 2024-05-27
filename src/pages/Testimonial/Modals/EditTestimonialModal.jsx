import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import { Button } from '@material-tailwind/react';

const EditTestimonialModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateTestimonial } = useMain();

  const [value, setValue] = useState({
    id: '',
    name: '',
    designation: '',
    comment: '',
    file: ''
  });

  const [prevImage, setPrevImage] = useState('');
  const [loadFlag, setLoadFlag] = useState(false);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        // console.log(data);
        setValue({
          id: data._id,
          name: data.name,
          designation: data.designation,
          comment: data.comment,
          file: ''
        });

        if (data.img) {
          setPrevImage(data.img);
        }
      }
    }
  }, [data]);

  const handleChange = (e, type = '') => {
    if (e.target.name !== 'file') {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
    else {
      setValue({ ...value, [e.target.name]: e.target.files[0] });
    }
  };

  const deleteImg = async () => {
    setLoadFlag(true);
    setPrevImage('');
    setLoadFlag(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);

    const ans = await updateTestimonial({ ...value });
    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editTestimonialModal').classList.toggle('hidden');
      if (value.file){
        window.location.reload();
      }
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editTestimonialModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Update testimonial</h3>

              <button type="button" onClick={() => {
                document.getElementById('editTestimonialModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update Testimonial details</h4>
                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                      <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Name .." onChange={handleChange} value={value.name} required />
                    </div>

                    <div>
                      <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900 ">Designation</label>
                      <input type="text" id="designation" name='designation' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter designation .." onChange={handleChange} value={value.designation} required />
                    </div>

                    {prevImage ? <div className='relative package-delete'>
                      <h5 className='mb-2 text-black'>Uploaded Image</h5>
                      <img width={200} className="rounded-md" src={prevImage} alt={prevImage} />

                      {!loadFlag ? <svg onClick={deleteImg} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="cursor-pointer bi bi-trash hover:text-red-600" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                      </svg> : <Spinner />}
                    </div> : <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="file" type="file" name='file' onChange={handleChange} required />
                    </div>}

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="comment">Description</label>
                      <textarea id="comment" name='comment' onChange={handleChange} value={value.comment} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user comment here..." required></textarea>
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
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

export default EditTestimonialModal;
