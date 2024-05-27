import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Button, Option, Select } from '@material-tailwind/react';

const EditCoupanModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateCoupan, getSubscriptions } = useMain();

  const [value, setValue] = useState({
    id: '',
    prizeWon: '',
    offer: '',
    expiryDate: '',
    startDate: '',
    subscription: ''
  });

  const [loadFlag, setLoadFlag] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        setValue({
          id: data._id,
          prizeWon: data.prizeWon,
          offer: data.offer,
          expiryDate: new Date(Number(data.expiryDate)).toISOString().split('T')[0],
          startDate: data.startDate,
          subscription: data?.subscription?._id
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        getData();
      }
    }
  }, []);

  const getData = async () => {
    setLoadFlag(false);
    const ans = await getSubscriptions();
    setSubscriptions(ans.data);
    setLoadFlag(true);
  };

  const handleChange = (e, name = '') => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
    else {
      setValue({ ...value, [name]: e });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    if (!value.prizeWon || value.prizeWon === "") {
      alert('Reward Voucher is required');
      return;
    }

    if (!value.subscription || value.subscription === "") {
      alert('Subscription is required');
      return;
    }

    const ans = await updateCoupan({ ...value, subscription: subscriptions.find(x => x._id === value.subscription) });
    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editCouponModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editCouponModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Update Voucher
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('editCouponModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {loadFlag ? <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Voucher details</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="offer" className="block mb-2 text-sm font-medium text-gray-900 ">Offer</label>
                      <input type="text" id="offer" name="offer" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Offer .." onChange={handleChange} value={value.offer} required />
                    </div>

                    <div>
                      <label htmlFor="expiryDate" className="block mb-2 text-sm font-medium text-gray-900 ">Expiry Date</label>
                      <input type="date" id="expiryDate" name='expiryDate' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Expiry Date .." onChange={handleChange} value={value.expiryDate} required />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Reward Voucher</label>
                      <Select label="Select Reward Voucher" children={<p>Select Reward Voucher</p>} value={value.prizeWon} onChange={(e) => {
                        handleChange(e, 'prizeWon');
                      }}>
                        <Option value="true" children={<p>Yes</p>}>Yes</Option>
                        <Option value="false" children={<p>No</p>}>No</Option>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Select Subscription</label>
                      <Select label="Select Subscription" children={<p>Select Subscription</p>} value={value.subscription} onChange={(e) => {
                        handleChange(e, 'subscription');
                      }}>
                        {subscriptions.map((e, index) => {
                          return (
                            <Option key={index} value={e._id} children={<p>{e.title}</p>}>{e.title}</Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
                  </div>
                </div>
              </form> : 'Loading ..'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCoupanModal;
