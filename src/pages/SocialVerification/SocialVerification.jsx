import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography
} from '@material-tailwind/react';
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import useMain from '../../hooks/useMain';
import Spinner from '../../Util/Spinner';
import SocialVerificationDetailModal from './Modals/SocialVerificationDetailModal';
import SocialVerificationActionModal from './Modals/SocialVerificationActionModal';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SocialVerification = ({ notify }) => {
  const { getAllSocialVerifications, reviewSocialVerification } = useMain();

  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [verificationAction, setVerificationAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const response = await getAllSocialVerifications({
        status: statusFilter,
        search: searchQuery,
        page,
        perPage
      });

      if (response.status) {
        setVerifications(response.data);
      } else {
        notify('error', 'Failed to fetch verification requests');
      }
    } catch (error) {
      notify('error', 'Failed to fetch verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (verification) => {
    setSelectedVerification(verification);
    setShowViewDialog(true);
  };

  const handleVerifyAction = (verification, action) => {
    setSelectedVerification(verification);
    setVerificationAction(action);
    setRejectionReason('');
    setAdminNotes('');
    setShowActionDialog(true);
  };

  const submitVerification = async () => {
    setProcessing(true);
    try {
      const response = await reviewSocialVerification({
        requestId: selectedVerification._id,
        action: verificationAction,
        rejectionReason:
          verificationAction === 'REJECTED' ? rejectionReason : '',
        adminNotes
      });

      if (response.status) {
        notify(
          'success',
          `Request ${verificationAction.toLowerCase()} successfully`
        );
        setShowActionDialog(false);
        fetchVerifications();
      } else {
        notify('error', response.message || 'Failed to process request');
      }
    } catch (error) {
      notify('error', 'Failed to process request');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusText = (verification) => {
    if (verification.status === 'APPROVED') return 'Approved';
    if (verification.status === 'REJECTED') return 'Rejected';
    return 'Pending Review';
  };

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter, searchQuery, page, perPage]);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Social Verification Management
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 px-6 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by description or notes..."
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner />
              </div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  No verification requests found
                </Typography>
                <Typography color="gray" className="text-sm">
                  {statusFilter || searchQuery
                    ? 'Try adjusting your filters'
                    : 'No social verification requests have been submitted yet'}
                </Typography>
              </div>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      'User',
                      'Submission Date',
                      'Social Links',
                      'Total Followers',
                      'Status',
                      'Actions'
                    ].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((verification) => {
                    const totalFollowers = Object.values(
                      verification.followerCounts || {}
                    ).reduce((sum, count) => sum + (count || 0), 0);

                    const activePlatforms = Object.keys(
                      verification.socialLinks || {}
                    ).filter((platform) => verification.socialLinks[platform]);

                    return (
                      <tr key={verification._id}>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex items-center gap-4">
                            <img
                              src={verification.user?.img || '/img/user.png'}
                              alt={verification.user?.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {verification.user?.name}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-xs font-normal text-blue-gray-500"
                              >
                                @{verification.user?.userName}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {new Date(
                              verification.submissionDate
                            ).toLocaleDateString()}
                          </Typography>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex flex-wrap gap-1">
                            {activePlatforms.slice(0, 3).map((platform) => (
                              <span
                                key={platform}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {platform}
                              </span>
                            ))}
                            {activePlatforms.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{activePlatforms.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            className="text-xs font-semibold"
                          >
                            {totalFollowers.toLocaleString()}
                          </Typography>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              verification.status
                            )}`}
                          >
                            {getStatusText(verification)}
                          </span>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(verification)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>

                            {verification.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() =>
                                    handleVerifyAction(verification, 'APPROVED')
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Approve"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleVerifyAction(verification, 'REJECTED')
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  title="Reject"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      <SocialVerificationDetailModal
        showViewDialog={showViewDialog}
        setShowViewDialog={setShowViewDialog}
        selectedVerification={selectedVerification}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />

      {/* Action Modal */}
      <SocialVerificationActionModal
        showActionDialog={showActionDialog}
        setShowActionDialog={setShowActionDialog}
        verificationAction={verificationAction}
        selectedVerification={selectedVerification}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        processing={processing}
        submitVerification={submitVerification}
      />
    </>
  );
};

export default SocialVerification;
