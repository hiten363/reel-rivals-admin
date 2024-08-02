import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import EditRewardpoolModal from './Modals/EditRewardpoolModal';

const Rewardpool = ({ notify }) => {
  const { getRewardpools } = useMain();

  const { event } = useParams();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
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
    const ans = await getRewardpools(event);
    // console.log(ans);
    setData(ans.data?.[0]);
  };

  return (
    <>
      <EditRewardpoolModal data={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Events
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
              title="Rewards Distribution"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Rewardpool;
