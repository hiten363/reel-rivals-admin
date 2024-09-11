import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input, Switch } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';

const UserDetails1 = ({ notify }) => {
  const { getCoupans, getDraws } = useMain();

  const { id, name, eventId, eventName } = useParams();

  const [data, setData] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    role: '',
    status: '',
    query: '',
    isRevealedCoupan: '',
    isRewardCoupan: '',
    event: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  useEffect(() => {
    getData1();
  }, []);

  const columns = [
    {
      name: 'Voucher Code',
      selector: row => row._id,
      sortable: true,
      wrap: true
    },
    {
      name: 'Prize Draw?',
      selector: row => row.prizeWon !== "" ? 'Yes' : 'No',
      sortable: true
    },
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getCoupans(value.status, value.query, page, perPage, id, 'true', eventId !== '0' ? eventId : '');
    console.log(ans);
    setTotalRows(ans.count);
    setData(ans.data);
    setLoadFlag(false);
  };

  const getData1 = async () => {
    const ans1 = await getDraws('', '', '', '', 'false');
    setEvents([{ title: 'Select Event', _id: '' }, ...ans1.data]);
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
    // console.log(value);
    const ans = await getCoupans(value.status, value.query, 1, perPage, id, value.isRevealedCoupan ? 'false' : 'true', eventId !== '0' ? eventId : '');
    setTotalRows(ans.count);
    setPage(1);
    // console.log(ans);
    setData(ans.data);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage User Vouchers
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex items-start justify-end px-5 pt-3" onSubmit={handleSubmit}>
              <div className='flex items-center justify-start flex-wrap w-full'>
                <div className='mr-2 w-[23%] min-w-[220px] mb-2'>
                  <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
                </div>

                {eventId === '0' && <div className="flex items-center w-[23%] min-w-[220px] mb-2">
                  <Select label="Event" children={<p>Event</p>} onChange={(e) => {
                    handleChange(e, 'event');
                  }}>
                    {events?.map((e, index) => {
                      return (
                        <Option key={index} value={e?._id} children={<p>{e?.title}</p>}>{e?.title}</Option>
                      );
                    })}
                  </Select>
                </div>}

                {/* <div className='w-[23%] min-w-[250px] ml-2.5 mb-2'>
                  <Switch label="Show Winning Vouchers Only" name='isRewardCoupan' onChange={(e) => { handleChange(e, 'isRewardCoupan', true) }} />
                </div> */}
              </div>

              <Button type='submit' children="Filter" size='sm' className='ml-3 mt-1'>Filter</Button>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title={eventName !== '0' ? `${name} (${eventName})` : name}
              progressPending={loadFlag}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UserDetails1;
