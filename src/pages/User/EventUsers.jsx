import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import AddUserModal from './Modals/AddUserModal';
import EditUserModal from './Modals/EditUserModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input } from '@material-tailwind/react';
import { NavLink, useParams } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const EventUsers = ({ notify }) => {
  const { getUsers, getDraws } = useMain();

  const { eventId, name } = useParams();

  const [data, setData] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    role: '',
    status: '',
    query: '',
    userFilter: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [eventDetail, setEventDetail] = useState({});
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = [
    {
      name: 'Profile',
      // selector: row => <img src={row?.img ? row?.img : '/img/user.png'} style={{width: '50px', padding:'5px 0px'}} />,
      selector: row => <ModalImage
        small={row?.img ? row?.img : '/img/user.png'}
        large={row?.img ? row?.img : '/img/user.png'}
        className='w-14'
      />,
      sortable: true,
      grow: 0.4
    },
    {
      name: 'Name',
      selector: row => <NavLink to={value?.userFilter === 'true' ? `/dashboard/user/${row._id}/${row.name}/${eventId}/${name}/true` : `/dashboard/user/${row._id}/${row.name}/${eventId}/${name}`}>{row.name}</NavLink>,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Phone',
      selector: row => row.phone && row.phone !== "undefined" ? row.phone : ' - ',
      sortable: true
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getUsers(value.status, value.role, value.query, page, perPage, '', eventId);
    const ans1 = await getDraws(eventId);

    setEventDetail(ans1.data?.[0]);
    let t = [];
    for (let i of ans1.data?.[0]?.events) {
      for (let j of i?.users) {
        t.push(j?.user?._id);
      }
    }
    setWinners(t);

    // console.log(ans);
    setTotalRows(ans.count);
    setData([...ans.data.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })]);

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
    // console.log(value);
    const ans = await getUsers(value.status, value.role, value.query, 1, perPage, '', eventId);
    setTotalRows(ans.count);
    setPage(1);
    // console.log(ans);
    if (value?.userFilter === "true") {
      setData(ans.data.filter(x => winners.includes(x._id)));
    }
    else {
      setData(ans.data);
    }
  };

  // const fetchUsers = async page => {
  // 	setLoading(true);

  // 	const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

  // 	setData(response.data.data);
  // 	setTotalRows(response.data.total);
  // 	setLoading(false);
  // };

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
                Manage Event Users
              </Typography>

              <Button color="red" className='ml-2' onClick={handleExport} children="Export Users">Export Users</Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {!loadFlag && <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>

              {eventDetail?.status === "false" && <div className="flex items-center mr-2">
                <Select label="Filter Users" children={<p>Filter Users</p>} onChange={(e) => {
                  handleChange(e, 'userFilter');
                }}>
                  <Option value="false" children={<p>All Users</p>}>All Users</Option>
                  <Option value="true" children={<p>Winners</p>}>Winners</Option>
                </Select>
              </div>}

              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form>}

            <div className='ml-4 mt-2'>
              <h3 className='text-2xl text-black'>{name}</h3>
            </div>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Users"
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

export default EventUsers;
