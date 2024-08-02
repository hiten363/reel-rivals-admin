import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';

const AddRewardpoolModal = (props) => {
  const { postRewardpool } = useMain();

  const [value, setValue] = useState([{
    startRank: '',
    endRank: '',
    reward: ''
  }]);

  const handleChange = (e, index) => {
    let t=[...value];
    t[index]={...value[index], [e.target.name]: e.target.value};
    setValue(t);
  };

  const handleAddBtn = () => {
    setValue(value.concat({
      startRank: '',
      endRank: '',
      reward: ''
    }));
  };

  const handleRemoveBtn = (index) => {
    setValue(() => {
      return value.filter((e, i) => {
        return i !== index;
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);
    console.log(props.event);

    const ans = await postRewardpool({ rewards: value, event: props.event });
    console.log(ans);
    if (ans.status) {
      setValue([{
        startRank: '',
        endRank: '',
        reward: ''
      }]);
      props.notify('success', ans.message);
      props.setRefreshFlag(!props.refreshFlag);
      document.getElementById('addRewardpoolModal').classList.toggle('hidden');
    }
    else {
      props.notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="addRewardpoolModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add new rewardpool
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('addRewardpoolModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Rewardpool details</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">Enter Rank Range & Rewards</label>

                      {value.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="number" name='startRank' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Start Rank" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.startRank} required />

                              <input type="number" name='endRank' className="bg-gray-50 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="End Rank" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.endRank} required />

                              <input type="text" name='reward' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Reward" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.reward} required />
                            </div>

                            {index === 0 ? <div className="add-btn">
                              <Button onClick={handleAddBtn} children="+" size='sm' className='text-xl py-1 w-[42px] text-center ml-1' color="green">+</Button>
                            </div> : <div className="remove-btn">
                              <Button onClick={() => { handleRemoveBtn(index); }} children="-" size='sm' className='text-xl py-1 w-[42px] ml-1' color="red">-</Button>
                            </div>}
                          </div>
                        );
                      })}
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

export default AddRewardpoolModal;
