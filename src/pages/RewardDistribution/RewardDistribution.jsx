import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const RewardDistribution = ({ notify }) => {
  const { getContests, deleteContest, undoContest, getCategorys, updateDistributionStatus } = useMain();
  // console.log('yes');

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    category: '',
    isDistributed: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [contest, setContest] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

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
            let ans = await updateDistributionStatus({ isDistributed: e.target.value, id: row._id });
            setRefreshFlag(!refreshFlag);
          }
        }} defaultValue={row?.isDistributed} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value=''>Select Status</option>
          <option value={'true'}>Yes</option>
          <option value={'false'}>No</option>
        </select> : <button className='bg-green-700 cursor-default text-white px-2 text-[13px] py-1 rounded-sm'>Distributed</button>}
      </>
      ,
      sortable: true,
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
    // const ans = await getContests('', '', page, perPage, 'false', value.category, '', '', 'true', '', value.isDistributed);
    setData(ans.data);
    setTotalRows(ans.count);

    const ans1 = await getCategorys('', true);

    setCategories(ans1.data);
    setLoadFlag(false);
  };

  const handleDelete = async () => {
    console.log(id);
    const ans = await deleteContest(id);

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
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

  const handleExport = async () => {
    const ans = await getContests('', value.status, '', '', value.deleted);
    let data = [
      {
        sheet: "Contests",
        columns: [
          { label: "Event Name", value: "title" },
          { label: "Start Date & Time", value: row => new Date(Number(row.startDate)).toLocaleString('en-GB') },
          { label: "End Date & Time", value: row => new Date(Number(row.endDate)).toLocaleString('en-GB') },
          { label: "First Prize", value: row => row.events[0].event.title },
          { label: "Second Prize", value: row => row.events[1].event.title },
          { label: "Third Prize", value: row => row.events[2].event.title },
          { label: "Event Status", value: (e) => e.status === 'true' ? 'Active' : 'Finished' }
        ],
        content: ans.data,
      }
    ];

    let settings = {
      fileName: "contests"
    };

    xlsx(data, settings);
  };

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
              {/* <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div> */}

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
            // expandableRows
            // expandableRowsComponent={WinnerList}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default RewardDistribution;
