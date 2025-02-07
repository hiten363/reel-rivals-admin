import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';

const RewardDistribution = () => {
  const { getContests, getCategorys, updateDistributionStatus } = useMain();

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    category: '',
    isDistributed: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: 'Contest Name',
      selector: row => <Link to={`/dashboard/contests/${row.title}/${row._id}`}>{row.title}</Link>,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Contest Category',
      // selector: row => <Link to={`/dashboard/event-users/${row._id}/${row.title}`}>{row.title}</Link>,
      selector: row => row.category?.title,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Total Participants',
      selector: row => row.contestants,
      // sortable: true,
      wrap: true
    },
    {
      name: 'Start Date',
      selector: row => new Date(Number(row.startDate)).toLocaleDateString('en-GB'),
      // sortable: true,
      wrap: true
    },
    {
      name: 'End Date',
      selector: row => new Date(Number(row.endDate)).toLocaleDateString('en-GB'),
      // sortable: true,
      wrap: true
    },
    {
      name: 'Is Distributed?',
      selector: row => <>
        {row?.isDistributed==="false" ? <select onChange={async (e) => {
          if (e.target.value !== "" && e.target.value !== "false") {
            await updateDistributionStatus({ isDistributed: e.target.value, id: row._id });
            setRefreshFlag(!refreshFlag);
          }
        }} defaultValue={row?.isDistributed} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value=''>Select Status</option>
          <option value={'true'}>Yes</option>
          <option value={'false'}>No</option>
        </select> : <button className='bg-green-700 cursor-default text-white px-2 text-[13px] py-1 rounded-sm'>Distributed</button>}
      </>,
      grow: 2
    },
    {
      name: 'Distribute Prize',
      selector: row => <button onClick={() => {
        navigate(`/dashboard/distribute-prize/${row?._id}`);
      }} className='bg-green-700 text-white px-2 text-[13px] py-1 rounded-sm'>Link</button>,
      sortable: true
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getContests('', '', page, perPage, 'false', value.category, '', '', 'false', '', value.isDistributed);
    setData(ans.data);
    setTotalRows(ans.count);

    const ans1 = await getCategorys('', true);
    setCategories(ans1.data);
    setLoadFlag(false);
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
    console.log(value);
    const ans = await getContests('', '', 1, perPage, 'false', value.category, '', '', 'false', '', value.isDistributed);
    // const ans = await getContests('', '', 1, perPage, 'false', value.category, '', '', 'true', '', value.isDistributed);
    setTotalRows(ans.count);
    setPage(1);
    console.log(ans);
    setData(ans.data);
  };
  const handlePageChange = (page) => {
    setPage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Reward Distribution
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className='flex items-center justify-end px-10 pt-3'>
                <div className="flex items-center mr-2 max-w-sm">
                  <select id="category" name="category" onChange={handleChange} value={value?.category} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value=''>Select Category</option>
                    {categories?.map((e, index) => {
                      return (
                        <option key={index} value={e._id}>{e?.title}</option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-center mr-2">
                  <Select label="Is Distributed?" children={<p>Is Distributed?</p>} onChange={(e) => {
                    handleChange(e, 'isDistributed');
                  }}>
                    <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                    <Option value="true" children={<p>Distributed</p>}>Distributed</Option>
                    <Option value="false" children={<p>Not Distributed</p>}>Not Distributed</Option>
                  </Select>
                </div>

                <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
              </div>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Contests"
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

export default RewardDistribution;
