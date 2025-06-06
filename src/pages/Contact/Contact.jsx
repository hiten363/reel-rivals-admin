import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import ReplyContactModal from './Modals/ReplyContactModal';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { Tooltip } from 'react-tooltip';
import xlsx from "json-as-xlsx";

const Contact = ({ notify }) => {
  const { getContacts, deleteContact, undoContact } = useMain();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: '',
    query: '',
    ticketType: 'contact'
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const contactColumns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Message',
      selector: row => row.message,
      sortable: true,
      wrap: true
    },
    {
      name: 'Date & Time',
      selector: row => new Date(Number(row.ts)).toLocaleString('en-US'),
      sortable: true,
      wrap: true
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Replied</span> : <span className='text-red-500 font-semibold'>Not Replied</span>,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <Tooltip
          id="my-tooltip-1"
          place="bottom"
          content="Reply"
        />
        <div data-tooltip-id="my-tooltip-1" onClick={() => {
          setData1(row);
          document.getElementById('addReplyModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-all-fill" viewBox="0 0 16 16">
            <path d="M8.021 11.9 3.453 8.62a.719.719 0 0 1 0-1.238L8.021 4.1a.716.716 0 0 1 1.079.619V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
            <path d="M5.232 4.293a.5.5 0 0 1-.106.7L1.114 7.945a.5.5 0 0 1-.042.028.147.147 0 0 0 0 .252.503.503 0 0 1 .042.028l4.012 2.954a.5.5 0 1 1-.593.805L.539 9.073a1.147 1.147 0 0 1 0-1.946l3.994-2.94a.5.5 0 0 1 .699.106z" />
          </svg>
        </div>

        <Tooltip
          id="my-tooltip-2"
          place="bottom"
          content="Delete"
        />
        <div data-tooltip-id="my-tooltip-2" onClick={async () => {
          setId(row._id);
          setMsg("Are you sure you want to delete selected user query?");
          document.getElementById('deleteModal').classList.toggle('hidden');
        }} className='me-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </div>,
      grow: 0.5
    }
  ];
  const supportColumns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Subject',
      selector: row => row.subject,
      sortable: true
    },
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true
    },
    {
      name: 'Priority',
      selector: row => row.priority,
      sortable: true
    },
    {
      name: 'Message',
      selector: row => row.message,
      sortable: true,
      wrap: true
    },
    {
      name: 'Date & Time',
      selector: row => new Date(Number(row.ts)).toLocaleString('en-US'),
      sortable: true,
      wrap: true
    },
    {
      name: 'Status',
      selector: row => row.status === 'true' ? <span className='text-green-500 font-semibold'>Replied</span> : <span className='text-red-500 font-semibold'>Not Replied</span>,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <Tooltip
          id="my-tooltip-1"
          place="bottom"
          content="Reply"
        />
        <div data-tooltip-id="my-tooltip-1" onClick={() => {
          setData1(row);
          document.getElementById('addReplyModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-all-fill" viewBox="0 0 16 16">
            <path d="M8.021 11.9 3.453 8.62a.719.719 0 0 1 0-1.238L8.021 4.1a.716.716 0 0 1 1.079.619V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
            <path d="M5.232 4.293a.5.5 0 0 1-.106.7L1.114 7.945a.5.5 0 0 1-.042.028.147.147 0 0 0 0 .252.503.503 0 0 1 .042.028l4.012 2.954a.5.5 0 1 1-.593.805L.539 9.073a1.147 1.147 0 0 1 0-1.946l3.994-2.94a.5.5 0 0 1 .699.106z" />
          </svg>
        </div>

        <Tooltip
          id="my-tooltip-2"
          place="bottom"
          content="Delete"
        />
        <div data-tooltip-id="my-tooltip-2" onClick={async () => {
          setId(row._id);
          setMsg("Are you sure you want to delete selected user query?");
          document.getElementById('deleteModal').classList.toggle('hidden');
        }} className='me-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </div>,
      grow: 0.5
    }
  ];
  const feedbackColumns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Feedback Type',
      selector: row => row.feedbackType,
      sortable: true
    },
    {
      name: 'Area',
      selector: row => row.area,
      sortable: true
    },
    {
      name: 'Rating',
      selector: row => row.rating,
      sortable: true
    },
    {
      name: 'Beta OptIn',
      selector: row => row.betaOptIn ? 'Yes' : 'No',
      sortable: true
    },
    {
      name: 'Message',
      selector: row => row.message,
      sortable: true,
      wrap: true
    },
    {
      name: 'Date & Time',
      selector: row => new Date(Number(row.ts)).toLocaleString('en-US'),
      sortable: true,
      wrap: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <Tooltip
          id="my-tooltip-2"
          place="bottom"
          content="Delete"
        />
        <div data-tooltip-id="my-tooltip-2" onClick={async () => {
          setId(row._id);
          setMsg("Are you sure you want to delete selected user query?");
          document.getElementById('deleteModal').classList.toggle('hidden');
        }} className='me-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </div>,
      grow: 0.5
    }
  ];

  const getData = async () => {
    setLoadFlag(true)
    const ans = await getContacts(value.status, value.query, value.ticketType, page, perPage);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
  };
  const handleDelete = async () => {
    const ans = await deleteContact(id);

    if (ans?.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
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
    const ans = await getContacts(value.status, value.query, value.ticketType, 1, perPage);
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
    let columns = value.ticketType === 'contact' ? [
      { label: "Name", value: "name" },
      { label: "Email", value: 'email' },
      { label: "Phone", value: "phone" },
      { label: "Message", value: "message" },
    ] : value.ticketType === 'support' ? [
      { label: "Name", value: "name" },
      { label: "Email", value: 'email' },
      { label: "Subject", value: "subject" },
      { label: "Category", value: "category" },
      { label: "Priority", value: "priority" },
      { label: "Message", value: "message" },
    ] : value.ticketType === 'feedback' ? [
      { label: "Name", value: "name" },
      { label: "Email", value: 'email' },
      { label: "Feedback Type", value: "feedbackType" },
      { label: "Area", value: "area" },
      { label: "Rating", value: "rating" },
      { label: "Beta OptIn", value: "betaOptIn" },
      { label: "Message", value: "message" },
    ] : [];

    const ans = await getContacts('', '', value.ticketType);
    let data = [
      {
        sheet: value.ticketType === 'contact' ? 'User Enquiries' : value.ticketType === 'support' ? 'Support Tickets' : value.ticketType === 'feedback' ? 'User Feedbacks' : '',
        columns,
        content: ans.data,
      }
    ];

    let settings = {
      fileName: value.ticketType === 'contact' ? 'User_Enquiries' : value.ticketType === 'support' ? 'Support_Tickets' : value.ticketType === 'feedback' ? 'User_Feedbacks' : ''
    };

    xlsx(data, settings);
  };

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  return (
    <>
      <ReplyContactModal data1={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage {value.ticketType === 'contact' ? 'User Enquiries' : value.ticketType === 'support' ? 'Support Tickets' : value.ticketType === 'feedback' ? 'User Feedbacks' : ''}
              </Typography>

              <Button color="red" className='ml-2' onClick={handleExport}>Export {value.ticketType === 'contact' ? 'User Enquiries' : value.ticketType === 'support' ? 'Support Tickets' : value.ticketType === 'feedback' ? 'User Feedbacks' : ''}</Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 min-h-96">
            <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>
              <div className='mx-2'>
                <Select label="Ticket Type" children={<p>Ticket Type</p>} onChange={(e) => {
                  handleChange(e, 'ticketType');
                }} value={value.ticketType}>
                  <Option value="" disabled>Select </Option>
                  <Option value="contact">Contact</Option>
                  <Option value="support">Support</Option>
                  <Option value="feedback">Feedback</Option>
                </Select>
              </div>
              <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }} value={value.status}>
                  <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                  <Option value="true" children={<p>Replied</p>}>Replied</Option>
                  <Option value="false" children={<p>Not Replied</p>}>Not Replied</Option>
                </Select>
              </div>
              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form>

            <DataTable
              columns={value.ticketType === 'contact' ? contactColumns : value.ticketType === 'support' ? supportColumns : value.ticketType === 'feedback' ? feedbackColumns : ''}
              data={data}
              striped={true}
              title={value.ticketType === 'contact' ? 'User Enquiries' : value.ticketType === 'support' ? 'Support Tickets' : value.ticketType === 'feedback' ? 'User Feedbacks' : ''}
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

export default Contact;
