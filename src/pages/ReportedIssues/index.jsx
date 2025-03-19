import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { Select, Option, Input } from "@material-tailwind/react";
import { Tooltip } from 'react-tooltip';
import xlsx from "json-as-xlsx";
import EditReportedIssuesModal from './Modals/EditReportedIssuesModal';
import ModalImage from 'react-modal-image';

const ReportedIssues = ({ notify }) => {
  const { getIssueReports, deleteIssueReport } = useMain();

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [value, setValue] = useState({
    status: ''
  });
  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns = [
    {
      name: 'Issue Type',
      selector: row => row.issueType,
      sortable: true
    },
    {
      name: 'Description',
      selector: row => row.description,
      wrap: true
    },
    {
      name: 'Steps',
      selector: row => row.steps,
      wrap: true
    },
    {
      name: 'Device Info',
      selector: row => row.deviceInfo,
      wrap: true
    },
    {
      name: 'Screenshot',
      // selector: row => row?.screenshot ? <img className='' src={row?.screenshot} alt='img' /> : 'NA'
      selector: row => <div className='py-1'>
        {row?.screenshot ? <ModalImage
          small={row?.screenshot}
          large={row?.screenshot}
          className='w-12 h-12 object-cover'
        /> : 'NA'}
      </div>
    },
    {
      name: 'Date & Time',
      selector: row => new Date(row.ts).toLocaleString('en-US'),
      sortable: true,
      wrap: true
    },
    {
      name: 'Status',
      selector: row => row?.status,
      sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <Tooltip
          id="my-tooltip-1"
          place="bottom"
          content="Update"
        />
        <div data-tooltip-id="my-tooltip-1" onClick={() => {
          setData1(row);
          document.getElementById('editReportedIssuesModal').classList.toggle('hidden');
        }} className='mr-2 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="update-icon bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
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

  const getData = async () => {
    setLoadFlag(true)
    const ans = await getIssueReports(value.status, page, perPage);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
  };
  const handleDelete = async () => {
    const ans = await deleteIssueReport(id);

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
    const ans = await getIssueReports(value.status, 1, perPage);
    setTotalRows(ans.count);
    setPage(1);
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
    let columns = [
      { label: "Issue Type", value: "issueType" },
      { label: "Description", value: "description" },
      { label: "Steps", value: "steps" },
      { label: "Device Info", value: "deviceInfo" }
    ];

    const ans = await getIssueReports(value.status);
    let data = [
      {
        sheet: 'Reported Issues',
        columns,
        content: ans.data,
      }
    ];

    let settings = {
      fileName: 'reported_issues'
    };

    xlsx(data, settings);
  };

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  return (
    <>
      <EditReportedIssuesModal data1={data1} setRefreshFlag={setRefreshFlag} refreshFlag={refreshFlag} notify={notify} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Issue Reports
              </Typography>

              <Button color="red" className='ml-2' onClick={handleExport}>Export Issue Reports</Button>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 min-h-96">
            <form className="flex items-center justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }} value={value.status}>
                  <Option value="">Select Status</Option>
                  <Option value="open">Open</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="resolved">Resolved</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </div>
              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Reported Issues"
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

export default ReportedIssues;
