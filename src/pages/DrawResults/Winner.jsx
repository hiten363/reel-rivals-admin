import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Switch, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';

const WinnerList = ({ data }) => {
  console.log(data);

  return (
    <>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 min-w-60">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Voucher #
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 min-w-60">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Name
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 min-w-60">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Email
                </Typography>
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.users?.length === 0 ? 'No Winners' : data?.users?.map((e, index) => {
              const isLast = index === data?.users.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      #{e?.ticket}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.user?.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.user?.email}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
};

const Winners = ({ notify }) => {
  const { getDraws, drawResults } = useMain();

  const { id, type } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: '',
    query: '',
    isRevealedCoupan: '',
    isAvailableCoupan: '',
    isRewardCoupan: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [refreshFlag]);

  const columns = [
    {
      name: 'Event Name',
      selector: row => row?.event?.title,
      sortable: true
    },
    {
      name: 'Prize Allocation',
      selector: (row, index) => index === 0 ? 'First Prize' : index === 1 ? 'Second Prize' : index === 2 ? 'Third Prize' : '',
      sortable: true
    },
    {
      name: 'Winners Count',
      selector: row => row?.count,
      sortable: true,
      wrap: true
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    if (type === 'recent') {
      const ans1 = await drawResults({ id });
      console.log(ans1);
      if (!ans1.status) {
        notify('error', 'Something went wrong. Try again after sometime');
        navigate('/draw-results');
        return;
      }
      notify('success', ans1.message);
    }
    const ans = await getDraws(id);
    console.log(ans);
    setData(ans.data[0]?.events);
    setTotalRows(ans.count);
    setLoadFlag(false)
  };

  const handleChange = (e, name = '', checkFlag = false) => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
    else {
      if (checkFlag) {
        setValue({ ...value, [name]: e.target.checked });
      }
      else {
        setValue({ ...value, [name]: e });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadFlag(true);
    console.log(value);
    const ans = await getCoupans(value.status, value.query, 1, perPage, '', value.isRevealedCoupan, value.isAvailableCoupan, value.isRewardCoupan);
    setTotalRows(ans.count);
    setPage(1);
    setData(ans.data);
    setLoadFlag(false);
  };

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">{'Winner List'}</Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* <form className="flex items-start justify-end px-5 pt-3" onSubmit={handleSubmit}>
              <div className='flex items-center justify-start flex-wrap w-full'>
                <div className='mr-2 w-[23%] min-w-[220px] mb-2'>
                  <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
                </div>

                <div className="flex items-center w-[23%] min-w-[220px] mb-2">
                  <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                    handleChange(e, 'status');
                  }}>
                    <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                    <Option value="true" children={<p>Active</p>}>Active</Option>
                    <Option value="false" children={<p>Deleted</p>}>Deleted</Option>
                  </Select>
                </div>

                <div className='w-[23%] min-w-[250px] ml-2.5 mb-2'>
                  <Switch label="Show Revealed Tickets Only" className='text-sm font-semibold' name='isRevealedCoupan' onChange={(e)=>{handleChange(e, 'isRevealedCoupan', true)}} />
                </div>

                <div className='w-[23%] min-w-[250px] ml-2.5 mb-2'>
                  <Switch label="Show Available Tickets Only" className='text-sm font-semibold' name='isAvailableCoupan' onChange={(e)=>{handleChange(e, 'isAvailableCoupan', true)}} />
                </div>

                <div className='w-[23%] min-w-[250px] ml-2.5 mb-2'>
                  <Switch label="Show Rewarded Tickets Only" name='isRewardCoupan' onChange={(e)=>{handleChange(e, 'isRewardCoupan', true)}} />
                </div>
              </div>

              <Button type='submit' children="Filter" size='sm' className='ml-3 mt-1'>Filter</Button>
            </form> */}

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Winner List"
              progressPending={loadFlag}
              pagination
              paginationTotalRows={totalRows}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              expandableRows
              expandableRowsComponent={WinnerList}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Winners;
