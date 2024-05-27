import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import EditWinnerModal from './Modals/EditWinnerModal';
import ModalImage from "react-modal-image";

const Winners = ({ notify }) => {
  const { getDraws } = useMain();

  const navigate=useNavigate();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: '',
    query: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = [
    {
      name: 'Event Image',
      selector: row => <ModalImage
      small={row?.img ? row?.img : '/img/user.png'}
      large={row?.img ? row?.img : '/img/user.png'}
      className='w-20 h-20 object-cover'
    />,
      sortable: true
    },
    {
      name: 'Event Name',
      selector: row => <Link to={`/dashboard/event-users/${row._id}/${row.title}`}>{row.title}</Link>,
      sortable: true,
      wrap: true
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Active</span> : <span className='text-red-500 font-semibold'>Inactive</span>,
      sortable: true,
      // grow: 0.1
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <Button className='text-[11px] py-1.5 px-2 font-medium rounded-md' onClick={()=>{
          setData1(row);
          document.getElementById('editWinnerModal').classList.toggle('hidden');
        }} children={<p>Update Winners</p>}>Update Winners</Button>
      </div>,
      grow: 1.2
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    const ans = await getDraws('', 'false', page, perPage, 'false');
    console.log(ans);
    setData(ans.data);
    setTotalRows(ans.count);                     
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
    const ans = await getDraws('', value.status, 1, perPage, 'false');
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

  return (
    <>
      <EditWinnerModal setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} data={data1} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">Manage Winners</Typography>

              {/* <Button color="red" onClick={() => {
                document.getElementById('addFaqModal').classList.toggle('hidden');
              }} children="Add Faq +">Add Faq +</Button> */}
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>

              <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }}>
                  <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                  <Option value="false" children={<p>Past Draws</p>}>Past Draws</Option>
                  <Option value="true" children={<p>Current Events</p>}>Current Events</Option>
                </Select>
              </div>

              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form> */}

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Winners"
              progressPending={loadFlag}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              paginationRowsPerPageOptions={[5,10,20,50,100]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Winners;
