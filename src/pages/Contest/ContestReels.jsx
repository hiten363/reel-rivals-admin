import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DeleteModal from '../../Util/DeleteModal';
import useMain from '../../hooks/useMain';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import PlayReelModal from '../Reels/Modals/PlayReelModal';

const WinnerList = ({ data }) => {
  console.log(data);

  return (
    <>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  # Prize Allocation
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Prize
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Count
                </Typography>
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.events?.length === 0 ? 'No Winners' : data?.events?.map((e, index) => {
              const isLast = index === data?.events.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {index === 0 ? 'First Prize' : index === 1 ? 'Second Prize' : 'Third Prize'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.event?.title}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {e?.count}
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

const ContestReels = ({ notify }) => {
  const { getVideos, deleteVideo } = useMain();

  const { userName, userId, contestName, contestId } = useParams();

  const [data, setData] = useState([]);
  const [id, setId] = useState(0);
  const [msg, setMsg] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [loadFlag, setLoadFlag] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [link, setLink] = useState('');

  useEffect(() => {
    getData();
  }, [refreshFlag, page, perPage]);

  const columns = [
    {
      name: 'Video',
      // selector: row => <a href={row.link} target='_blank' className='text-blue-600 cursor-pointer'> Play</a>,
      selector: row => <div className='text-blue-600 cursor-pointer' onClick={() => {
        setLink(row.link);
        document.getElementById('playReelModal').classList.toggle('hidden');
      }}> Play</div>,
      // sortable: true
    },
    {
      name: 'Caption',
      selector: row => <p>{row?.caption}</p>,
      wrap: true,
      grow: 4
      // sortable: true
    },
    {
      name: 'Category',
      selector: row => row.contest.category.title,
      grow: 2
    },
    {
      name: 'Uploaded By',
      selector: row => row.user.userName,
      grow: 2
    },
    {
      name: 'Likes',
      selector: row => row.likes,
      grow: 0.1
    },
    {
      name: 'Rank',
      selector: row => row.rank,
      grow: 0.1
    },
    {
      name: 'Star Points',
      selector: row => row.tokensCount,
      grow: 0.5
    },
    {
      name: 'Views',
      selector: row => row.plays,
      grow: 0.5
    },
    {
      name: 'Uploaded On',
      selector: row => new Date(Number(row.ts)).toLocaleDateString('en-GB')
    },
    {
      name: 'Status',
      selector: row => (Number(row?.contest?.endDate) > new Date().getTime()) ? <span className='text-green-500 font-semibold'>In Contest</span> : <span className='text-red-500 font-semibold'>Not In Contest</span>,
      // sortable: true
    },
    {
      name: "Actions",
      selector: row => <div className="flex justify-center">
        <div onClick={async () => {
          setId(row._id);
          setMsg("Are you sure you want to delete selected Video?");
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
    setLoadFlag(true);
    const ans = await getVideos('', '', contestId, '', userId, '', '', '', page, perPage);
    setData(ans.data);
    setTotalRows(ans.count);
    setLoadFlag(false);
  };

  const handleDelete = async () => {
    console.log(id);
    const ans = await deleteVideo(id);

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('deleteModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
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
      <PlayReelModal link={link} />
      <DeleteModal msg={msg} handleDelete={handleDelete} />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="white">
                Manage Contest Reels
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* <form className="flex items-center flex-wrap justify-end px-10 pt-3" onSubmit={handleSubmit}>
              <div className='mx-2'>
                <Input label="Search .." name="query" onChange={handleChange} value={value.query} />
              </div>

              <div className='mb-2'>
                <select id="user" name="user" onChange={handleChange} value={value?.user} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value=''>Select User</option>
                  {users?.map((e, index) => {
                    return (
                      <option key={index} value={e._id}>{e?.userName}</option>
                    );
                  })}
                </select>
              </div>

              <div className='mx-2 mb-2'>
                <select id="category" name="category" onChange={handleChange} value={value?.category} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value=''>Select Category</option>
                  {categories?.map((e, index) => {
                    return (
                      <option key={index} value={e._id}>{e?.title}</option>
                    );
                  })}
                </select>
              </div>

              <div className='mr-2 mb-2'>
                <select id="contest" name="contest" onChange={handleChange} value={value?.contest} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value=''>Select Contest</option>
                  {contests?.map((e, index) => {
                    return (
                      <option key={index} value={e._id}>{e?.title}</option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center">
                <Select label="Status" children={<p>Status</p>} onChange={(e) => {
                  handleChange(e, 'status');
                }}>
                  <Option value="" children={<p>Select Status</p>}>Select Status</Option>
                  <Option value="true" children={<p>In Contest</p>}>In Contest</Option>
                  <Option value="false" children={<p>Not In Contest</p>}>Not In Contest</Option>
                </Select>
              </div>
              <Button type='submit' children="Filter" size='sm' className='ml-3'>Filter</Button>
            </form> */}

            <div className='ml-4 mt-2'>
              <h3 className='text-lg text-black'>User - {userName}</h3>
            </div>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title={`${contestName} Videos`}
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

export default ContestReels;
