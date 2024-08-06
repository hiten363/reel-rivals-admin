import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import EditRewardpoolModal from './Modals/EditRewardpoolModal';

const Rewardpool = ({ notify }) => {
  const { getRewardPools } = useMain();

  const { contest } = useParams();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    if (contest) {
      getData();
    }
  }, [refreshFlag]);

  const columns = [
    {
      name: 'Start Rank',
      selector: row => row.startRank,
      sortable: true
    },
    {
      name: 'End Rank',
      selector: row => row.endRank,
      sortable: true
    },
    {
      name: 'Reward',
      selector: row => row.reward!=="" && row.tokens!==0 ? `${row.reward} + ${row.tokens} Star Points` : row.reward!=="" ? row.reward : `${row.tokens} Star Points`,
      sortable: true
    },
  ];

  const getData = async () => {
    const ans = await getRewardPools(contest);
    // console.log(ans);
    setData(ans.data?.[0]);
  };

  return (
    <>
      <EditRewardpoolModal data={data1} contest={contest} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Rewardpool
              </Typography>

              <Button color="amber" onClick={() => {
                setData1(data);
                document.getElementById('editRewardpoolModal').classList.toggle('hidden');
              }} children="Update Reward Pool">Update Reward Pool</Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <DataTable
              columns={columns}
              data={data?.rewards}
              striped={true}
              title="Global Rewards Distribution"
            />
          </CardBody>

          {data?.countryRewards && data.countryRewards.length > 0 && <>
            <h3 className='text-2xl mt-2 ml-3 text-black'>Countrywise Rewards Distribution</h3>

            {data?.countryRewards?.map((e, index) => {
              return (
                <CardBody key={index} className="overflow-x-scroll px-0 pt-0 pb-2">
                  <DataTable
                    columns={columns}
                    data={e?.rewards}
                    striped={true}
                    title={e.country.label}
                  />
                </CardBody>
              );
            })}
          </>}

          {data?.stateRewards && data.stateRewards.length > 0 && <>
            <h3 className='text-2xl mt-2 ml-3 text-black'>Statewise Rewards Distribution</h3>
            
            {data?.stateRewards?.map((e, index) => {
              return (
                <CardBody key={index} className="overflow-x-scroll px-0 pt-0 pb-2">
                  <DataTable
                    columns={columns}
                    data={e?.rewards}
                    striped={true}
                    title={e.state.label}
                  />
                </CardBody>
              );
            })}
          </>}
        </Card>
      </div>
    </>
  );
};

export default Rewardpool;
