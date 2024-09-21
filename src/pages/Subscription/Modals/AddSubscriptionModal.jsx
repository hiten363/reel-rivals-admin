import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';

const AddSubscriptionModal = (props) => {
  const { postSubscription } = useMain();

  const [value, setValue] = useState({
    title: '',
    subtitle: '',
    tier: '',
    desc: '',
    desc1: '',
    desc2: '',
    desc3: '',
    type: '',
    subType: '',
    starPointsOffered: '',
    amount: '',
    discount: 0
  });

  const handleChange = (e, type = '') => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);

    const ans = await postSubscription({ ...value });
    console.log(ans);
    if (ans.status) {
      setValue({
        title: '',
        subtitle: '',
        tier: '',
        desc: '',
        desc1: '',
        desc2: '',
        desc3: '',
        type: '',
        subType: '',
        starPointsOffered: '',
        amount: '',
        discount: 0
      });
      props.notify('success', ans.message);
      props.setRefreshFlag(!props.refreshFlag);
      document.getElementById('addSubscriptionModal').classList.toggle('hidden');
    }
    else {
      props.notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="addSubscriptionModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add new plan
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('addSubscriptionModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Plan details</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Title .." onChange={handleChange} value={value.title} />
                    </div>

                    <div>
                      <label htmlFor="subtitle" className="block mb-2 text-sm font-medium text-gray-900 ">Sub Title</label>
                      <input type="text" id="subtitle" name='subtitle' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Sub Title .." onChange={handleChange} value={value.subtitle} />
                    </div>

                    {value?.type==='SUBSCRIPTIONS' && <div>
                      <label htmlFor="tier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscription Tier</label>
                      <select id="tier" onChange={handleChange} value={value.tier} name="tier" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                        <option value="">Choose a tier</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                      <p className='text-xs font-semibold pl-0.5 pt-1 text-blue-700'>Choosing to the highest tier means selecting the most advanced and costly plan.</p>
                    </div>}

                    <div>
                      <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plan Type</label>
                      <select id="type" onChange={handleChange} value={value.type} name="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                        <option value="">Choose a type</option>
                        <option value="SUBSCRIPTIONS">Subscription</option>
                        <option value="VOTES">Votes</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interval</label>
                      <select id="subType" onChange={handleChange} value={value.subType} name="subType" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                        <option value="">Choose an interval</option>
                        {value?.type !== "VOTES" && <option value="MONTHLY">Monthly</option>}
                        {value?.type !== "SUBSCRIPTIONS" && <option value="BIWEEKLY">Bi-Weekly</option>}
                        {value?.type !== "SUBSCRIPTIONS" && <option value="FIXED">Fixed</option>}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="starPointsOffered" className="block mb-2 text-sm font-medium text-gray-900 ">Star Points Offered</label>
                      <input type="number" id="starPointsOffered" name='starPointsOffered' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Count .." onChange={handleChange} value={value.starPointsOffered} required />
                    </div>

                    <div>
                      <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 ">Amount</label>
                      <input type="number" id="amount" name='amount' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Amount .." onChange={handleChange} value={value.amount} required />
                    </div>
                    <div>
                      <label htmlFor="discount" className="block mb-2 text-sm font-medium text-gray-900 ">Discount</label>
                      <input type="number" id="discount" name='discount' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Discount .." onChange={handleChange} value={value.discount} />
                    </div>
                    <div>
                      <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 ">Description 1</label>
                      <input type="text" id="desc" name='desc' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Description 1 .." onChange={handleChange} value={value.desc} />
                    </div>
                    <div>
                      <label htmlFor="desc1" className="block mb-2 text-sm font-medium text-gray-900 ">Description 2</label>
                      <input type="text" id="desc1" name='desc1' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Description 2 .." onChange={handleChange} value={value.desc1} />
                    </div>
                    <div>
                      <label htmlFor="desc2" className="block mb-2 text-sm font-medium text-gray-900 ">Description 3</label>
                      <input type="text" id="desc2" name='desc2' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Description 3 .." onChange={handleChange} value={value.desc2} />
                    </div>
                    <div>
                      <label htmlFor="desc3" className="block mb-2 text-sm font-medium text-gray-900 ">Description 4</label>
                      <input type="text" id="desc3" name='desc3' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Description 4 .." onChange={handleChange} value={value.desc3} />
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

export default AddSubscriptionModal;
