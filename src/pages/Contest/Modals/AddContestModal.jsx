import React, { useEffect } from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button, Option, Select } from '@material-tailwind/react';
import FileInput from '@/Util/FileInput';
  
const AddContestModal = (props) => {
  const { postContest, getCategorys } = useMain();

  const [value, setValue] = useState({
    title: '',
    file: '',
    startDate: '',
    endDate: '',
    winning: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loadFlag, setLoadFlag] = useState(true);
  const [uploadFlag, setUploadFlag] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoadFlag(true);
    let ans = await getCategorys('', 'true');
    setCategories(ans.data);

    setLoadFlag(false);
  };

  const handleChange = (e, name = '') => {
    if (name === "") {
      if (e.target.name !== 'img') {
        setValue({ ...value, [e.target.name]: e.target.value });
      }
      else {
        setValue({ ...value, [e.target.name]: e.target.files[0] });
      }
    }
    else {
      setValue({ ...value, [name]: e });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadFlag(true);
    console.log(value);

    const ans = await postContest({ title: value.title, file: value?.file, startDate: new Date(value?.startDate)?.getTime(), endDate: new Date(value?.endDate)?.getTime(), winning: value?.winning, category: value.category });
    console.log(ans);
    if (ans.status) {
      setValue({
        title: '',
        file: '',
        startDate: '',
        endDate: '',
        winning: '',
        category: ''
      });
      e?.target?.reset();
      props.notify('success', ans.message);
      props.setRefreshFlag(!props.refreshFlag);
      document.getElementById('addContestModal').classList.toggle('hidden');
    }
    else {
      props.notify('error', ans.message);
    }
    setUploadFlag(false);
  };

  return (
    <>
      <div id="addContestModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Add new contest</h3>

              <button type="button" onClick={() => {
                document.getElementById('addContestModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {loadFlag ? 'Loading ..' : <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Contest details</h4>

                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title </label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Contest Title .." onChange={handleChange} value={value.title} required />
                    </div>

                    <FileInput value={value} setValue={setValue} isRequired={true} />

                    <div>
                      <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 ">Start Date </label>
                      <input type="date" id="startDate" name="startDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={handleChange} value={value.startDate} required />
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 ">End Date </label>
                      <input type="date" id="endDate" name="endDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={handleChange} value={value.endDate} required />

                      {/* <DateTimePicker locale="en-GB" format='dd-MM-y h:mm:ss a' onChange={(e) => {
                        let ts1 = new Date().getTime();
                        let ts2 = new Date(e).getTime();
                        
                        if (ts2 > ts1 && ts2 > value.startDate) {
                          setValue({ ...value, endDate: e });
                        }
                      }} value={value.endDate} required /> */}
                    </div>

                    <div>
                      <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 ">Contest Category </label>
                      <Select label="Select Category" children={<p>Select Category</p>} onChange={(f) => {
                        setValue({ ...value, category: `${f}` });
                      }} required>
                        {categories?.map((e, index) => {
                          return (
                            <Option key={index} value={e?._id} children={<p>{e?.title}</p>}>{e?.title}</Option>
                          );
                        })}
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="winning" className="block mb-2 text-sm font-medium text-gray-900 ">Total Winnings </label>
                      <input type="number" id="winning" name="winning" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Contest Winnings .." onChange={handleChange} value={value.winning} required />
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button color="green" disabled={uploadFlag} type={uploadFlag ? "button" : "submit"} children="Submit">{uploadFlag ? "Uploading .." : "Submit"}</Button>
                  </div>
                </div>
              </form>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContestModal;
