import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input } from '@material-tailwind/react';
import { Link, NavLink, useParams } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const ContestUsers = ({ notify }) => {
  const { getUsers, getContests, getCategorys } = useMain();

  const { userId, name } = useParams();

  const [data, setData] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    role: '',
    status: '',
    category: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  useEffect(() => {
    getData1();
  }, []);

  const columns = [
    // {
    //   name: 'Image',
    //   selector: row => <ModalImage
    //     small={row?.img ? row?.img : '/img/user.png'}
    //     large={row?.img ? row?.img : '/img/user.png'}
    //     className='w-14'
    //   />,
    //   sortable: true,
    //   grow: 0.4
    // },
    {
      name: 'Contest Name',
      selector: row => <Link to={`/dashboard/reels/${name}/${userId}/${row.title}/${row._id}`}>{row.title}</Link>,
      sortable: true
    },
    {
      name: 'Contest Category',
      selector: row => row.category.title,
      sortable: true
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
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getContests('', '', page, perPage, '', value.category, '', '', value.status, userId);
    setData(ans.data);
    setLoadFlag(false);
  };

  const getData1 = async () => {
    const ans2 = await getCategorys('', true);
    setCategories(ans2.data);
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
    // console.log(value);
    const ans = await getContests('', '', page, perPage, '', value.category, '', '', value.status, userId);
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

  const handleExport = async () => {
    const ans = await getUsers(value.status, value.role, value.query, '', '', '', eventId);
    let data = [
      {
        sheet: "Users",
        columns: [
          { label: "Name", value: "name" },
          { label: "Email", value: 'email' },
          { label: "Phone", value: "phone" },
          { label: "Address", value: "address" }
        ],
        content: ans.data,
      }
    ];

    let settings = {
      fileName: "users"
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
                Manage User Contests
              </Typography>

              {/* <Button color="red" className='ml-2' onClick={handleExport} children="Export Users">Export Users</Button> */}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {!loadFlag && <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              {/* <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div> */}

              <div className='mx-2 mb-0'>
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
                <Select label="Filter Contests" children={<p>Filter Contests</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }}>
                  <Option value="" children={<p>All Contests</p>}>All Contests</Option>
                  <Option value="true" children={<p>Active Contests</p>}>Active Contests</Option>
                  <Option value="false" children={<p>Past Contests</p>}>Past Contests</Option>
                </Select>
              </div>

              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form>}

            {/* <div className='ml-4 mt-2'>
              <h3 className='text-2xl text-black'>{name}</h3>
            </div> */}

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title={`${name}'s Contests`}
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

export default ContestUsers;
