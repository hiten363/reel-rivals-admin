import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import useMain from '../../hooks/useMain';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import { Select, Option, Input } from '@material-tailwind/react';

const PayoutRequests = ({ notify }) => {
  const { getPayoutRequests, processPayoutRequest } = useMain();

  const [data, setData] = useState([]);
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
      name: 'Business Name',
      selector: (row) =>
        row.business?.businessProfile?.businessName ||
        row.business?.name ||
        'N/A',
      sortable: true,
      wrap: true
    },
    {
      name: 'Email',
      selector: (row) => row.business?.email || 'N/A',
      sortable: true,
      wrap: true
    },
    {
      name: 'Amount',
      selector: (row) => `$${row.amount?.toFixed(2)}` || '$0.00',
      sortable: true
    },
    {
      name: 'Star Points',
      selector: (row) => row.starPointsToRedeem?.toLocaleString() || '0',
      sortable: true
    },
    {
      name: 'Conversion Rate',
      selector: (row) => `${row.conversionRate || 10}:1`,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'APPROVED'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : row.status === 'REJECTED'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true
    },
    {
      name: 'Requested Date',
      selector: (row) => new Date(row.requestedAt).toLocaleDateString('en-US'),
      sortable: true
    },
    {
      name: 'Actions',
      selector: (row) => (
        <div className="flex justify-center gap-2">
          <div
            onClick={() => handleViewDetails(row)}
            className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            View
          </div>
          {row.status === 'PENDING' && (
            <>
              <div
                onClick={() => handleProcessRequest(row, 'approve')}
                className="cursor-pointer bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                Approve
              </div>
              <div
                onClick={() => handleProcessRequest(row, 'reject')}
                className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Reject
              </div>
            </>
          )}
        </div>
      ),
      grow: 2
    }
  ];

  const getData = async () => {
    setLoadFlag(true);
    try {
      const ans = await getPayoutRequests(
        value.status,
        value.query,
        page,
        perPage
      );
      if (ans?.status) {
        setData(ans.data?.requests || []);
        setTotalRows(ans.data?.pagination?.totalRequests || 0);
      } else {
        notify('error', ans?.message || 'Failed to fetch payout requests');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      notify('error', 'Failed to fetch payout requests');
      setData([]);
    } finally {
      setLoadFlag(false);
    }
  };

  const handleViewDetails = (request) => {
    alert(`Payout Request Details:
Business: ${
      request.business?.businessProfile?.businessName || request.business?.name
    }
Amount: $${request.amount?.toFixed(2)}
Star Points: ${request.starPointsToRedeem?.toLocaleString()}
Status: ${request.status}
Requested: ${new Date(request.requestedAt).toLocaleDateString()}
${
  request.rejectionReason
    ? `\nRejection Reason: ${request.rejectionReason}`
    : ''
}
${
  request.stripeTransferId
    ? `\nStripe Transfer ID: ${request.stripeTransferId}`
    : ''
}`);
  };

  const handleProcessRequest = async (request, action) => {
    let rejectionReason = '';
    if (action === 'reject') {
      rejectionReason = prompt('Please provide a rejection reason:');
      if (!rejectionReason || !rejectionReason.trim()) {
        notify('error', 'Rejection reason is required');
        return;
      }
    }

    const confirmMessage =
      action === 'approve'
        ? `Are you sure you want to approve this payout request for $${request.amount?.toFixed(
            2
          )}?`
        : `Are you sure you want to reject this payout request?`;

    if (confirm(confirmMessage)) {
      try {
        const ans = await processPayoutRequest({
          requestId: request._id,
          action,
          rejectionReason
        });

        if (ans && ans.status) {
          notify(
            'success',
            ans.message || `Payout request ${action}d successfully`
          );
          setRefreshFlag(!refreshFlag);
        } else {
          notify('error', ans?.message || `Failed to ${action} payout request`);
        }
      } catch (error) {
        console.error('Error processing payout request:', error);
        notify('error', `Failed to ${action} payout request`);
      }
    }
  };

  const handleChange = (e, name = '') => {
    if (name === '') {
      setValue({ ...value, [e.target.name]: e.target.value });
    } else {
      setValue({ ...value, [name]: e });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    setRefreshFlag(!refreshFlag);
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
                Payout Requests Management
              </Typography>
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form
              className="flex items-center justify-end px-10 pt-3"
              onSubmit={handleSubmit}
            >
              <div className="mx-2">
                <Input
                  label="Search business name or email..."
                  name="query"
                  onChange={handleChange}
                  value={value.query}
                />
              </div>
              <div className="flex items-center mr-2">
                <Select
                  label="Status"
                  value={value.status}
                  onChange={(e) => {
                    handleChange(e, 'status');
                  }}
                >
                  <Option value="">All Status</Option>
                  <Option value="PENDING">Pending</Option>
                  <Option value="APPROVED">Approved</Option>
                  <Option value="COMPLETED">Completed</Option>
                  <Option value="REJECTED">Rejected</Option>
                  <Option value="PROCESSING">Processing</Option>
                </Select>
              </div>
              <Button
                type="submit"
                children="Filter"
                size="sm"
                className="ml-3"
              >
                Filter
              </Button>
            </form>

            <DataTable
              columns={columns}
              data={data}
              striped={true}
              title="Payout Requests"
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

export default PayoutRequests;
