import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import EditLeaderboardModal from './Modals/EditLeaderboardModal';

const Leaderboard = ({ notify }) => {
  const { getParticipations, getRewardpools } = useMain();

  const { event } = useParams();

  const [data, setData] = useState([]);
  const [rewardPool, setRewardPool] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    if(event)
    {
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
      selector: row => row.reward,
      sortable: true
    },
  ];

  const getData = async () => {
    const ans1=await getRewardpools(event);
    const ans = await getParticipations(event);
    // console.log(ans);
    setRewardPool(ans1.data);
    setData(ans.data?.[0]);
  };

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Leaderboard
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Leaderboard"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Leaderboard;
