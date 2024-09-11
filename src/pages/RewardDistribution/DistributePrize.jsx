import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Option, Select, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import { Country, State } from 'country-state-city';
// import list from '../../Util/sanctionList.json';
import OutsideClickHandler from 'react-outside-click-handler';

const DistributePrize = ({ notify }) => {
  const { getRewardPools, getVideosWinners, getSanctionLists } = useMain();

  const { contest } = useParams();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    type: 'GLOBAL',
    country: '',
    state: ''
  });
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [type1, setType1] = useState('GLOBAL');

  useEffect(() => {
    getCountries();
    getStates('US');
  }, []);

  useEffect(() => {
    if (contest) {
      getData();
    }
  }, [refreshFlag]);

  // const columns = [
  //   {
  //     name: 'Start Rank',
  //     selector: row => row.startRank,
  //     sortable: true
  //   },
  //   {
  //     name: 'End Rank',
  //     selector: row => row.endRank,
  //     sortable: true
  //   },
  //   {
  //     name: 'Reward',
  //     selector: row => row.reward && row.reward !== "" && row.tokens && row.tokens !== 0 ? `${row.reward} + ${row.tokens} Star Points` : row.reward !== "" ? row.reward : `${row.tokens} Star Points`,
  //     sortable: true
  //   },
  //   {
  //     name: 'User Details',
  //     selector: (row, index) => <button onClick={() => {
  //       console.log(index);
  //       setUserDetails(users[index]?.user);
  //     }} className='bg-green-700 text-white px-2 text-[13px] py-1 rounded-sm'>Show</button>,
  //     sortable: true
  //   }
  // ];

  const columns = [
    {
      name: 'Rank',
      selector: row => row.rank,
      sortable: true
    },
    {
      name: 'Reward',
      selector: row => row.reward,
      sortable: true
    },
    {
      name: 'User Details',
      selector: (row) => <button onClick={() => {
        console.log(users[row.userIndex]?.user);
        setUserDetails(users[row.userIndex]?.user);
        document.getElementById('winningcash-modal').classList.toggle('hidden');
        document.querySelector('.shadow1').classList.toggle('none1');
      }} className='bg-green-700 text-white px-2 text-[13px] py-1 rounded-sm'>Show</button>,
      sortable: true
    }
  ];

  const getCountries = async () => {
    const list=await getSanctionLists();
    let countries = Country.getAllCountries();
    let list1=list.data[0].countries.map(x=>x.value);
    setCountries(countries.filter(x => !list1.includes(x.isoCode)).map((e) => {
      return { label: e.name, value: e.isoCode };
    }));
  };

  const getStates = (isoCode) => {
    let states = State.getStatesOfCountry(isoCode);
    setStates(states.map((e) => {
      return { label: e.name, value: e.isoCode };
    }));
  };

  const getData = async () => {
    const ans = await getRewardPools(contest, value.type, value.country, value.state);

    if (ans && ans?.data && ans?.data?.length > 0) {
      let t = [];

      if (value.type === 'GLOBAL') {
        for (let j of ans.data?.[0].rewards) {
          for (let i = j.startRank; i <= j.endRank; j++) {
            t.push({
              rank: i,
              reward: j.reward && j.reward !== "" && j.tokens && j.tokens !== 0 ? `${j.reward} + ${j.tokens} Star Points` : j.reward !== "" ? j.reward : `${j.tokens} Star Points`,
              userIndex: i - 1
            });
          }
        }
      }
      else if (value.type === 'COUNTRY') {
        if (ans.data?.[0].countryRewards?.length > 0) {
          for (let j of ans.data?.[0].countryRewards?.[0]?.rewards) {
            for (let i = j.startRank; i <= j.endRank; j++) {
              t.push({
                rank: i,
                reward: j.reward && j.reward !== "" && j.tokens && j.tokens !== 0 ? `${j.reward} + ${j.tokens} Star Points` : j.reward !== "" ? j.reward : `${j.tokens} Star Points`,
                userIndex: i - 1
              });
            }
          }
        }
      }
      else if (value.type === 'STATE') {
        if (ans.data?.[0].stateRewards?.length > 0) {
          for (let j of ans.data?.[0].stateRewards?.[0]?.rewards) {
            for (let i = j.startRank; i <= j.endRank; j++) {
              t.push({
                rank: i,
                reward: j.reward && j.reward !== "" && j.tokens && j.tokens !== 0 ? `${j.reward} + ${j.tokens} Star Points` : j.reward !== "" ? j.reward : `${j.tokens} Star Points`,
                userIndex: i - 1
              });
            }
          }
        }
      }

      // setData(ans.data?.[0]);
      console.log(t);
      setData(t);
    }

    const ans1 = await getVideosWinners(contest, value.type, value.country, value.state);
    if (ans1 && ans1?.data) {
      setUsers(ans1.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    setType1(value.type);
    setRefreshFlag(!refreshFlag);
  };

  return (
    <>
      <div className='none1 bg-[#00000045] fixed inset-0 z-30 h-full w-full shadow1'></div>

      <div id="winningcash-modal" tabIndex={-1} className="hidden z-[100] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-screen-lg max-h-full mx-auto top-5">
          <OutsideClickHandler onOutsideClick={() => {
            let b1 = document.getElementById('winningcash-modal');
            let b2 = document.querySelector('.Toastify__toast-container');

            if (!b2 && !b1.classList.contains('hidden')) {
              b1.classList.toggle('hidden');
              document.querySelector('.shadow1').classList.toggle('none1');
            }
          }}>
            <div className="relative bg-white rounded-lg shadow">
              <div className="login-close" onClick={() => {
                document.querySelector('.shadow1').classList.toggle('none1');
                document.getElementById('winningcash-modal').classList.toggle('hidden');
              }}>
                <i className="las la-times" />
              </div>

              <div className="login-title">
                <h3 className="title mb-0 text-2xl font-semibold text-center pt-5">User Information</h3>
              </div>

              <div className="p-5 px-8">
                <div className="winninginfo-sec">
                  <div className="inner-winninginfo flex flex-wrap">
                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Name</label>
                      <p>{userDetails?.name}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Username</label>
                      <p>{userDetails?.userName}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Email</label>
                      <p>{userDetails?.email}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Bank Name</label>
                      <p>{userDetails?.bankName ? userDetails?.bankName : " - "}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Bank Account Number</label>
                      <p>{userDetails?.bankAccountNumber ? userDetails?.bankAccountNumber : " - "}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Beneficiary Name</label>
                      <p>{userDetails?.bankUserName ? userDetails?.bankUserName : " - "}</p>
                    </div>

                    <div className="formgroup my-3 basis-1/4">
                      <label className='font-semibold'>Swift Code</label>
                      <p>{userDetails?.swiftCode ? userDetails?.swiftCode : " - "}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </div>

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <form onSubmit={handleSubmit} className='flex items-center'>
          <div className="flex items-center mr-2 w-52">
            <Select label="Distribution Type" children={<p>Distribution Type</p>} value={value.type} onChange={(e) => {
              setValue({ ...value, type: e, country: '', state: '' });
            }} required>
              <Option value="" children={<p>Select Type</p>}>Select Type</Option>
              <Option value="GLOBAL" children={<p>Global</p>}>Global</Option>
              <Option value="COUNTRY" children={<p>Country wise</p>}>Country wise</Option>
              <Option value="STATE" children={<p>State wise</p>}>State wise</Option>
            </Select>
          </div>

          {value.type !== 'GLOBAL' && <div className="flex items-center mr-2 w-52">
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={value.country} name="country" onChange={(e) => {
              setValue({ ...value, country: e.target.value, state: '' });
            }} required>
              <option value=''>Choose a country</option>
              {countries?.map((f, index1) => {
                return (
                  <option key={index1} value={f.value}>{f.label}</option>
                );
              })}
            </select>
          </div>}

          {value.type === 'STATE' && <div className="flex items-center mr-2 w-52">
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={value.state} name="state" onChange={(e) => {
              setValue({ ...value, state: e.target.value });
            }} required>
              <option value=''>Choose a state</option>
              {states?.map((f, index1) => {
                return (
                  <option key={index1} value={f.value}>{f.label}</option>
                );
              })}
            </select>
          </div>}

          <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
        </form>

        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Distribute Rewards
              </Typography>
            </div>
          </CardHeader>

          {type1 === 'GLOBAL' && (data && data?.length > 0 ? <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Global Rewards Distribution"
            />
          </CardBody> : <div className='text-lg text-center'>No Data Available</div>)}

          {type1 === 'COUNTRY' && (data?.length > 0 ? <>
            <h3 className='text-2xl mt-2 ml-3 text-black'>Countrywise Rewards Distribution</h3>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <DataTable
                columns={columns}
                data={data}
                striped={true}
              />
            </CardBody>
          </> : <div className='text-lg text-center'>No Data Available</div>)}

          {type1 === 'STATE' && (data?.length > 0 ? <>
            <h3 className='text-2xl mt-2 ml-3 text-black'>Statewise Rewards Distribution</h3>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <DataTable
                columns={columns}
                data={data}
                striped={true}
              />
            </CardBody>
          </> : <div className='text-lg text-center'>No Data Available</div>)}
        </Card>
      </div>
    </>
  );
};

export default DistributePrize;
