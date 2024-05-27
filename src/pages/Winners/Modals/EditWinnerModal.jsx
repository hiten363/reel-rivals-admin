import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import { Button } from '@material-tailwind/react';

function checkURL(url) {
  return /\.(jpeg|jpg|jfif|pjpeg|pjp|gif|png|webp|apng|bmp|ico|svg|svgz|tiff|tif|avif)$/i.test(url);
}

const EditWinnerModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateDraw, uploadImage } = useMain();

  const [value, setValue] = useState({
    id: '',
    event: {}
  });
  const [mainEvent, setMainEvent] = useState({});
  const [loadFlag, setLoadFlag] = useState(true);
  const [uploadFlag, setUploadFlag] = useState({});

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        setLoadFlag(true);
        console.log(data);
        setValue({
          id: data._id,
          event: data
        });
        setMainEvent(data);
        setLoadFlag(false);
      }
    }
  }, [data]);

  const handleChange = (e, type = '') => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(mainEvent);

    const ans = await updateDraw({ events: mainEvent?.events, id: value.id });
    if (ans.status) {
      notify('success', 'Winners assgined successfully');
      setRefreshFlag(!refreshFlag);
      document.getElementById('editWinnerModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editWinnerModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Update Winners</h3>

              <button type="button" onClick={() => {
                document.getElementById('editWinnerModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                {loadFlag ? 'Loading ...' : <div className="bus-form">
                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className='text-xl mb-3'>Event Name: {value?.event?.title}</div>

                  {value?.event?.events?.map((e, index) => {
                    if (e?.users?.length > 0) {
                      return (
                        <div key={index} className='border-b-2 mb-3'>
                          <h4 className='text-lg font-semibold'>Prize: {e?.event?.title}</h4>

                          {e?.users?.map((f, index1) => {
                            return (
                              <div key={index1} className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                                <div>
                                  <label htmlFor={`comment${index1}`} className="block mb-2 text-sm font-medium text-gray-900 ">User Comment</label>
                                  <textarea id={`comment${index1}`} name='comment' onChange={(g) => {
                                    // console.log(g.target.value);
                                    mainEvent.events[index].users[index1].winner = {
                                      ...mainEvent.events[index].users[index1].winner,
                                      comment: g.target.value
                                    };
                                    // console.log(mainEvent);
                                  }} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Comment..." defaultValue={mainEvent.events[index].users[index1]?.winner?.comment} required></textarea>
                                </div>

                                <div>
                                  {mainEvent.events[index].users[index1]?.winner?.file ? checkURL(mainEvent.events[index].users[index1]?.winner?.file) ? <img style={{ width: '100px', height: '100px' }} src={mainEvent.events[index].users[index1]?.winner?.file} /> : <video style={{ width: '140px', height: '100px' }} controls>
                                    <source src={mainEvent.events[index].users[index1]?.winner?.file} />
                                  </video> : null}

                                  {uploadFlag[`${index}-${index}`] && <span className='text-base mb-2'>Uploading ...</span>}

                                  <label htmlFor={`file${index1}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Image/Video</label>
                                  <input type="file" id={`file${index1}`} name="file" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5" onChange={async (g) => {
                                    setUploadFlag({
                                      ...uploadFlag, [`${index}-${index}`]: true
                                    });
                                    console.log(uploadFlag);
                                    let ans = await uploadImage({ file: g.target.files[0] });
                                    // console.log(ans);
                                    mainEvent.events[index].users[index1].winner={
                                      ...mainEvent.events[index].users[index1].winner,
                                      file: ans.data
                                    };
                                    setUploadFlag({
                                      ...uploadFlag, [`${index}-${index}`]: false
                                    });
                                  }} required={!mainEvent.events[index].users[index1]?.winner?.file} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })}

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
                  </div>
                </div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditWinnerModal;
