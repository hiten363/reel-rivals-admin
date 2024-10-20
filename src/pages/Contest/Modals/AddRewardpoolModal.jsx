import React, { useEffect } from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';
import { Country, State } from 'country-state-city';
import cloneDeep from 'clone-deep';

const AddRewardpoolModal = (props) => {
  const { postRewardPool, getSanctionLists } = useMain();

  const [value, setValue] = useState([{
    startRank: '',
    endRank: '',
    reward: '',
    tokens: 0
  }]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryRewards, setCountryRewards] = useState([]);
  const [countryRewards1, setCountryRewards1] = useState([]);
  const [stateRewards, setStateRewards] = useState([]);
  const [stateRewards1, setStateRewards1] = useState([]);

  useEffect(() => {
    getCountries();
    getStates('US');
  }, []);

  const getCountries = async () => {
    const list = await getSanctionLists();
    let countries = Country.getAllCountries();
    let list1 = list.data[0].countries.map(x => x.value);
    setCountries(countries.filter(x => !list1.includes(x.isoCode)).map((e) => {
      return { label: e.name, value: e.isoCode };
    }));
  };

  const getStates = (isoCode) => {
    let states = State.getStatesOfCountry(isoCode);
    // console.log(states);
    setStates(states.map((e) => {
      return { label: e.name, value: e.isoCode };
    }));
  };

  const handleAddCountry = () => {
    let t = [...countryRewards];
    t.push({
      country: '',
      rewards: [{
        startRank: '',
        endRank: '',
        reward: '',
        tokens: 0
      }]
    });
    setCountryRewards(t);
  };

  const handleAddState = () => {
    let t = [...stateRewards];
    t.push({
      state: '',
      rewards: [{
        startRank: '',
        endRank: '',
        reward: '',
        tokens: 0
      }]
    });
    setStateRewards(t);
  };

  const handleChange1 = (e, index, index1, type) => {
    let t;
    console.log(type);
    if (type === 'COUNTRY') {
      t = [...countryRewards];
    }
    else {
      t = [...stateRewards];
    }

    if (e.target.name === 'country') {
      t[index] = { ...t[index], country: e.target.value };
    }
    else if (e.target.name === 'state') {
      t[index] = { ...t[index], state: e.target.value };
    }
    else {
      let t1 = [...t[index].rewards];
      t1[index1] = { ...t1[index1], [e.target.name]: e.target.value };
      t[index] = { ...t[index], rewards: t1 };
    }

    if (type === 'COUNTRY') {
      setCountryRewards(t);
    }
    else {
      setStateRewards(t);
    }
  };

  const handleChange = (e, index) => {
    let t = [...value];
    t[index] = { ...value[index], [e.target.name]: e.target.value };
    setValue(t);
  };

  const handleAddBtn1 = (index, type) => {
    if (type === 'COUNTRY') {
      let t1 = [...countryRewards];
      t1[index] = {
        ...t1[index], rewards: t1[index].rewards.concat({
          startRank: '',
          endRank: '',
          reward: '',
          tokens: 0
        })
      }
      setCountryRewards(t1);
    }
    else {
      let t1 = [...stateRewards];
      t1[index] = {
        ...t1[index], rewards: t1[index].rewards.concat({
          startRank: '',
          endRank: '',
          reward: '',
          tokens: 0
        })
      }
      setStateRewards(t1);
    }
  };

  const handleRemoveBtn1 = (index, index1, type) => {
    if (type === 'COUNTRY') {
      let t1 = [...countryRewards];
      t1[index] = { ...t1[index], rewards: t1[index].rewards.filter((x, i) => i !== index1) };
      setCountryRewards(t1);
    }
    else {
      let t1 = [...stateRewards];
      t1[index] = { ...t1[index], rewards: t1[index].rewards.filter((x, i) => i !== index1) };
      setStateRewards(t1);
    }
  };

  const handleAddBtn = () => {
    setValue(value.concat({
      startRank: '',
      endRank: '',
      reward: '',
      tokens: 0
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
    // console.log(value);
    // console.log(countryRewards);
    // console.log(stateRewards);

    const ans = await postRewardPool({
      rewards: [...value.map((x) => { return { ...x, tokens: (x.tokens && x.tokens !== "") ? x.tokens : 0, reward: x.reward.trim() } })], contest: props.contest, countryRewards: countryRewards.map(x => {
        let c = countries.find(y => y.value === x.country);
        return { ...x, country: { label: c.label, value: c.value } };
      }), stateRewards: stateRewards.map(x => {
        let c = states.find(y => y.value === x.state);
        return { ...x, state: { label: c.label, value: c.value } };
      })
    });

    if (ans.status) {
      setValue([{
        startRank: '',
        endRank: '',
        reward: ''
      }]);
      setCountryRewards([]);
      setStateRewards([]);
      props.notify('success', ans.message);
      props.setRefreshFlag(!props.refreshFlag);
      document.getElementById('addRewardpoolModal').classList.toggle('hidden');
    }
    else {
      props.notify('error', ans.message);
    }
  };

  const handleCountryGlobal = (flag) => {
    if (flag) {
      if (countryRewards1.length === 0) {
        let t = cloneDeep(countryRewards);
        setCountryRewards1(t);
      }
      let newCountryRewards = [...countries.map((x) => { return { rewards: value, country: x.value } })];
      setCountryRewards(newCountryRewards);
    }
    else {
      setCountryRewards(countryRewards1);
    }
  };

  const handleStateGlobal = (flag) => {
    if (flag) {
      if (stateRewards1.length === 0) {
        let t = cloneDeep(stateRewards);
        setStateRewards1(t);
      }
      let newStateRewards = [...states.map((x) => { return { rewards: value, state: x.value } })];
      setStateRewards(newStateRewards);
    }
    else {
      setStateRewards(stateRewards1);
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
                      <label className="block mb-3 text-base font-medium text-gray-900">Enter Rank Range & Rewards</label>
                      <div className="flex step2-box mb-1.5">
                        <p className='w-full text-sm font-medium ml-1'>Start Rank</p>
                        <p className='w-full text-sm font-medium ml-3'>End Rank</p>
                        <p className='w-full text-sm font-medium ml-2'>Cash Reward</p>
                        <p className='w-full text-sm font-medium ml-2'>Star Points</p>
                      </div>

                      {value.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="number" name='startRank' min={1} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Start Rank" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.startRank} required />

                              <input type="number" name='endRank' min={1} className="bg-gray-50 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="End Rank" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.endRank} required />

                              <input type="text" name='reward' className="bg-gray-50 mr-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Reward" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.reward} />

                              <input type="number" name='tokens' min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Star Points" onChange={(e) => {
                                handleChange(e, index);
                              }} value={value[index]?.tokens} required />
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

                  <div className="flex items-center mb-5 gap-3">
                    <h3 className='text-xl'>Country Wise Rewards</h3>

                    <Button color="amber" size='sm' type="button" children="Add rewards +" onClick={handleAddCountry}>Add rewards +</Button>

                    {countryRewards?.length > 0 && <div className="flex items-center ml-5">
                      <input id="global-country" type="checkbox" value="" onChange={(e) => {
                        handleCountryGlobal(e.target.checked);
                      }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="global-country" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Set As Globally</label>
                    </div>}
                  </div>

                  {countryRewards?.map((e, index) => {
                    return (
                      <div key={index} className="grid gap-6 px-0.5 py-0.5 mb-6">
                        <div>
                          <div className="max-w-sm mx-auto flex gap-2 items-center">
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={e.country} name="country" onChange={(g) => {
                              handleChange1(g, index, -1, 'COUNTRY');
                            }}>
                              <option value=''>Choose a country</option>
                              {countries?.map((f, index1) => {
                                return (
                                  <option key={index1} value={f.value}>{f.label}</option>
                                );
                              })}
                            </select>

                            <Button color="red" size='sm' style={{ padding: '7px 8px', width: '100px', height: 'fit-content' }} type="button" children="Remove" onClick={() => {
                              setCountryRewards(countryRewards?.filter((_, indd) => {
                                return indd !== index;
                              }));
                            }}>Remove</Button>
                          </div>

                          <label className="block mb-3 text-base font-medium text-gray-900">Enter Rank Range & Rewards</label>
                          <div className="flex step2-box mb-1.5">
                            <p className='w-full text-sm font-medium ml-1'>Start Rank</p>
                            <p className='w-full text-sm font-medium ml-3'>End Rank</p>
                            <p className='w-full text-sm font-medium ml-2'>Cash Reward</p>
                            <p className='w-full text-sm font-medium ml-2'>Star Points</p>
                          </div>

                          {e.rewards.map((f, index1) => {
                            return (
                              <div key={index1} className="flex pt-0.5 px-0.5 mb-2 items-center">
                                <div className="flex step2-box">
                                  <input type="number" name='startRank' min={1} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Start Rank" onChange={(g) => {
                                    handleChange1(g, index, index1, 'COUNTRY');
                                  }} value={countryRewards[index]?.rewards?.[index1]?.startRank} required />

                                  <input type="number" name='endRank' min={1} className="bg-gray-50 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="End Rank" onChange={(f) => {
                                    handleChange1(f, index, index1, 'COUNTRY');
                                  }} value={countryRewards[index]?.rewards?.[index1]?.endRank} required />

                                  <input type="text" name='reward' className="bg-gray-50 mr-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Reward" onChange={(f) => {
                                    handleChange1(f, index, index1, 'COUNTRY');
                                  }} value={countryRewards[index]?.rewards?.[index1]?.reward} />

                                  <input type="number" name='tokens' min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Star Points" onChange={(f) => {
                                    handleChange1(f, index, index1, 'COUNTRY');
                                  }} value={countryRewards[index]?.rewards?.[index1]?.tokens} required />
                                </div>

                                {index1 === 0 ? <div className="add-btn">
                                  <Button onClick={() => {
                                    handleAddBtn1(index, 'COUNTRY')
                                  }} children="+" size='sm' className='text-xl py-1 w-[42px] text-center ml-1' color="green">+</Button>
                                </div> : <div className="remove-btn">
                                  <Button onClick={() => { handleRemoveBtn1(index, index1, 'COUNTRY'); }} children="-" size='sm' className='text-xl py-1 w-[42px] ml-1' color="red">-</Button>
                                </div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {countryRewards?.find(x => x.country === 'US') && <>
                    <div className="flex items-center mb-5 gap-3">
                      <h3 className='text-xl'>State Wise Rewards</h3>

                      <Button color="amber" size='sm' type="button" children="Add rewards +" onClick={handleAddState}>Add rewards +</Button>

                      {stateRewards?.length > 0 && <div className="flex items-center ml-5">
                        <input id="global-country" type="checkbox" value="" onChange={(e) => {
                          handleStateGlobal(e.target.checked);
                        }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="global-country" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Set As Globally</label>
                      </div>}
                    </div>

                    {stateRewards?.map((e, index) => {
                      return (
                        <div key={index} className="grid gap-6 px-0.5 py-0.5 mb-6">
                          <div>
                            <div className="max-w-sm mx-auto flex gap-2 items-center">
                              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={e.state} name="state" onChange={(g) => {
                                handleChange1(g, index, -1, 'STATE');
                              }}>
                                <option value=''>Choose a state</option>
                                {states?.map((f, index1) => {
                                  return (
                                    <option key={index1} value={f.value}>{f.label}</option>
                                  );
                                })}
                              </select>

                              <Button color="red" size='sm' style={{ padding: '7px 8px', width: '100px', height: 'fit-content' }} type="button" children="Remove" onClick={() => {
                                setStateRewards(stateRewards?.filter((_, indd) => {
                                  return indd !== index;
                                }));
                              }}>Remove</Button>
                            </div>

                            <label className="block mb-3 text-base font-medium text-gray-900">Enter Rank Range & Rewards</label>
                            <div className="flex step2-box mb-1.5">
                              <p className='w-full text-sm font-medium ml-1'>Start Rank</p>
                              <p className='w-full text-sm font-medium ml-3'>End Rank</p>
                              <p className='w-full text-sm font-medium ml-2'>Cash Reward</p>
                              <p className='w-full text-sm font-medium ml-2'>Star Points</p>
                            </div>

                            {e.rewards.map((f, index1) => {
                              return (
                                <div key={index1} className="flex pt-0.5 px-0.5 mb-2 items-center">
                                  <div className="flex step2-box">
                                    <input type="number" name='startRank' min={1} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Start Rank" onChange={(g) => {
                                      handleChange1(g, index, index1, 'STATE');
                                    }} value={stateRewards[index]?.rewards?.[index1]?.startRank} required />

                                    <input type="number" name='endRank' min={1} className="bg-gray-50 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="End Rank" onChange={(f) => {
                                      handleChange1(f, index, index1, 'STATE');
                                    }} value={stateRewards[index]?.rewards?.[index1]?.endRank} required />

                                    <input type="text" name='reward' className="bg-gray-50 mr-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Reward" onChange={(f) => {
                                      handleChange1(f, index, index1, 'STATE');
                                    }} value={stateRewards[index]?.rewards?.[index1]?.reward} />

                                    <input type="number" name='tokens' min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Star Points" onChange={(f) => {
                                      handleChange1(f, index, index1, 'STATE');
                                    }} value={stateRewards[index]?.rewards?.[index1]?.tokens} required />
                                  </div>

                                  {index1 === 0 ? <div className="add-btn">
                                    <Button onClick={() => {
                                      handleAddBtn1(index, 'STATE');
                                    }} children="+" size='sm' className='text-xl py-1 w-[42px] text-center ml-1' color="green">+</Button>
                                  </div> : <div className="remove-btn">
                                    <Button onClick={() => { handleRemoveBtn1(index, index1, 'STATE'); }} children="-" size='sm' className='text-xl py-1 w-[42px] ml-1' color="red">-</Button>
                                  </div>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </>}

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
