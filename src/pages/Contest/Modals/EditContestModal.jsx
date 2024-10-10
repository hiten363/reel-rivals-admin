import React, { useState, useEffect } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button, Select, Option } from '@material-tailwind/react';
import FileInput from '@/Util/FileInput';

const EditContestModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateContest, getCategorys } = useMain();

  const [value, setValue] = useState({
    id: '',
    title: '',
    file: '',
    startDate: '',
    endDate: '',
    category: '',
    winning: '',
  });
  const [prevImage, setPrevImage] = useState('');
  const [loadFlag, setLoadFlag] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        // console.log(data);
        getData();
      }
    }
  }, [data]);

  const getData = async () => {
    setLoadFlag(true);

    let ans = await getCategorys('', 'true');
    setCategories(ans.data);
    console.log(data?.category?._id);

    setPrevImage(data?.img);

    setValue({
      id: data._id,
      title: data?.title,
      file: '',
      startDate: new Date(Number(data?.startDate)).toISOString().split('T')[0],
      endDate: new Date(Number(data?.endDate)).toISOString().split('T')[0],
      category: data?.category?._id,
      winning: data?.winning,
    });

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
    // console.log(value);

    const ans = await updateContest({ title: value.title, file: value?.file, startDate: new Date(value?.startDate)?.getTime(), endDate: new Date(value?.endDate)?.getTime(), winning: value?.winning, category: value?.category, id: data?._id });
    console.log(ans);

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editContestModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  const deleteImg = async () => {
    setLoadFlag(true);
    setPrevImage('');
    setLoadFlag(false);
  };

  return (
    <>
      <div id="editContestModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Update contest</h3>

              <button type="button" onClick={() => {
                document.getElementById('editContestModal').classList.toggle('hidden');
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
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Event Title .." onChange={handleChange} value={value.title} required />
                    </div>

                    {prevImage ? <div className='relative package-delete'>
                      <h5 className='mb-2 text-black'>Uploaded Image</h5>
                      <img width={200} className="rounded-md" src={prevImage} alt={prevImage} />

                      {!loadFlag ? <svg onClick={deleteImg} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="cursor-pointer bi bi-trash hover:text-red-600" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                      </svg> : <Spinner />}
                    </div> : <div>
                      <FileInput value={value} setValue={setValue} isRequired={false} />
                    </div>}

                    <div>
                      <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 ">Start Date </label>
                      <input type="date" id="startDate" name="startDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={handleChange} value={value.startDate} required />

                      {/* <DateTimePicker locale="en-GB" format='dd-MM-y h:mm:ss a' onChange={(e) => {
                        let ts1 = new Date().getTime();
                        let ts2 = new Date(e).getTime();
                        if (ts2 > ts1) {
                          setValue({ ...value, startDate: e });

                          if (value.endDate <= ts2) {
                            setValue({ ...value, startDate: e, endDate: (new Date(ts2 + 60000)) });
                          }
                        }
                        else
                        {
                          if(value.endDate==="")
                          {
                            setValue({ ...value, startDate: new Date(), endDate: (new Date(ts1 + 600000)) });
                          }
                          else
                          {
                            setValue({ ...value, startDate: new Date() });
                          }
                        }
                      }} value={value.startDate} required /> */}
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
                      }} value={value.category} required>
                        {categories?.map((e, index) => {
                          return (
                            <Option key={index} value={e?._id} children={<p>{e?.title}</p>}>{e?.title}</Option>
                          );
                        })}
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="winning" className="block mb-2 text-sm font-medium text-gray-900 ">Total Winnings </label>
                      <input type="text" id="winning" name="winning" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Contest Winnings .." onChange={handleChange} value={value.winning} required />
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
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

export default EditContestModal;
