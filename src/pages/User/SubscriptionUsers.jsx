import React from 'react';
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography, Select, Option, Input } from '@material-tailwind/react';
import { Link, NavLink, useParams } from 'react-router-dom';
import ModalImage from "react-modal-image";
import xlsx from "json-as-xlsx";

const SubscriptionUsers = ({ notify }) => {
  const { getUsers, getSubscriptions } = useMain();

  const { subscriptionId, subscriptionName } = useParams();

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

  const getData = async () => {
    setLoadFlag(true);
    let ans = await getUsers('', '', '', page, perPage, '', '', subscriptionId);
    let ans1=await getSubscriptions('', '', '', '', '', '', subscriptionId);
    console.log(ans1.data);

    setData(ans.data?.map(x=>{return {...x, subscriptionRenewDate: ans1.data.type==="VOTES" ? x.stripeSubscriptionId.find(x=>x.name==='VOTES').subscriptionRenewDate : ans1.data.tier==='3' ? x.subscriptionRenewDate : x.stripeSubscriptionId.find(x=>x.name==='SUBSCRIPTIONS').subscriptionRenewDate}}));

    setTotalRows(ans.count);
    setLoadFlag(false);
  };

  const columns = [
    {
      name: 'Image',
      selector: row => <ModalImage
        small={row?.img ? row?.img : '/img/user.png'}
        large={row?.img ? row?.img : '/img/user.png'}
        className='w-12 h-12 object-cover'
      />,
      sortable: true,
      grow: 0.4
    },
    {
      name: 'Name',
      selector: row => <NavLink to={`/dashboard/user/${row._id}/${row.name}`}>{row.name}</NavLink>,
      // selector: row => row.name,
      sortable: true
    },
    {
      name: 'Username',
      // selector: row => <NavLink to={`/dashboard/user/${row._id}/${row.name}/0/0`}>{row.name}</NavLink>,
      selector: row => row.userName,
      sortable: true
    },
    {
      name: 'Renew Date',
      // selector: row => <NavLink to={`/dashboard/user/${row._id}/${row.name}/0/0`}>{row.name}</NavLink>,
      selector: row => new Date(Number(row.subscriptionRenewDate)).toLocaleDateString(),
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
    },
    {
      name: 'Country',
      selector: row => row.country && row.country !== "undefined" && row.country.label ? row.country.label : ' - ',
      sortable: true
    },
    {
      name: 'State',
      selector: row => row.state && row.state !== "undefined" && row.state.label ? row.state.label : ' - ',
      sortable: true
    }
  ];

  const handleChange = (e, name = '') => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
    else {
      setValue({ ...value, [name]: e });
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
    const ans = await getUsers('', '', '', '', '', '', '', subscriptionId);
    let data = [
      {
        sheet: `${subscriptionName.replaceAll('^', '/')}`,
        columns: [
          { label: "Name", value: "name" }, 
          { label: "Username", value: "userName" }, 
          { label: "Email", value: 'email' }, 
          { label: "Phone", value: "phone" }, 
          { label: "Country", value: (e) => e.country && e.country !== "undefined" && e.country.label ? e.country.label : ' - ' },
          { label: "State", value: (e) => e.state && e.state !== "undefined" && e.state.label ? e.state.label : ' - ' }
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
                Manage Subscribers
              </Typography>

              <Button color="red" className='ml-2' onClick={handleExport} children="Export Users">Export Users</Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title={subscriptionName.replaceAll('^', '/')}
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

export default SubscriptionUsers;
