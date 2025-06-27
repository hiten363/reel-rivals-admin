import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  Tab
} from '@material-tailwind/react';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useMain from '@/hooks/useMain';
import BusinessVerificationDetailModal from './Modals/BusinessVerificationDetailModal';
import BusinessVerificationActionModal from './Modals/BusinessVerificationActionModal';

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'green';
    case 'pending':
      return 'orange';
    case 'rejected':
      return 'red';
    default:
      return 'blue';
  }
};

const BusinessVerification = ({ notify }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verificationAction, setVerificationAction] = useState('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { verifyBusinessAccount, getAllBusinessVerifications } = useMain();

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const response = await getAllBusinessVerifications({
        page: 1,
        perPage: 50,
        status: activeTab === 'all' ? '' : activeTab,
        search: searchTerm
      });
      if (response.status) {
        setVerifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
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
    setShowVerifyDialog(true);
  };
  const submitVerification = async () => {
    if (verificationAction === 'reject' && !rejectionReason.trim()) {
      notify('error', 'Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      const response = await verifyBusinessAccount({
        userId: selectedVerification._id,
        approved: verificationAction === 'approve',
        rejectionReason: verificationAction === 'reject' ? rejectionReason : ''
      });

      if (response.status) {
        notify('success', response.message);
        setShowVerifyDialog(false);
        fetchVerifications();
      } else {
        notify('error', response.message || 'Failed to process verification');
      }
    } catch (error) {
      notify('error', 'Failed to process verification');
    } finally {
      setProcessing(false);
    }
  };
  const getStatusText = (verification) => {
    if (verification.businessProfile?.isBusinessVerified) return 'Approved';
    if (verification.businessProfile?.rejectionReason) return 'Rejected';
    return 'Pending';
  };

  useEffect(() => {
    fetchVerifications();
  }, [activeTab]);

  const filteredVerifications = verifications;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading verification requests...</Typography>
      </div>
    );
  }

  return (
    <>
      <BusinessVerificationDetailModal
        showViewDialog={showViewDialog}
        setShowViewDialog={setShowViewDialog}
        selectedVerification={selectedVerification}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
      <BusinessVerificationActionModal
        showVerifyDialog={showVerifyDialog}
        setShowVerifyDialog={setShowVerifyDialog}
        verificationAction={verificationAction}
        selectedVerification={selectedVerification}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        processing={processing}
        submitVerification={submitVerification}
      />

      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Business Verification Management
            </Typography>
          </CardHeader>
          <CardBody className="px-6 pt-0 pb-2">
            {/* Search and Filters */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <Input
                  label="Search by business name, contact name, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                color="blue"
                onClick={() => fetchVerifications()}
                variant="outlined"
              >
                Submit
              </Button>
            </div>

            {/* Status Tabs */}
            <Tabs value={activeTab} className="mb-6">
              <TabsHeader>
                <Tab value="all" onClick={() => setActiveTab('all')}>
                  All ({verifications.length})
                </Tab>
                <Tab value="pending" onClick={() => setActiveTab('pending')}>
                  Pending (
                  {
                    verifications.filter(
                      (v) =>
                        !v.businessProfile?.isBusinessVerified &&
                        !v.businessProfile?.rejectionReason
                    ).length
                  }
                  )
                </Tab>
                <Tab value="approved" onClick={() => setActiveTab('approved')}>
                  Approved (
                  {
                    verifications.filter(
                      (v) => v.businessProfile?.isBusinessVerified
                    ).length
                  }
                  )
                </Tab>
                <Tab value="rejected" onClick={() => setActiveTab('rejected')}>
                  Rejected (
                  {
                    verifications.filter(
                      (v) => v.businessProfile?.rejectionReason
                    ).length
                  }
                  )
                </Tab>
              </TabsHeader>
            </Tabs>

            {filteredVerifications.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  No Verifications Found
                </Typography>
                <Typography color="gray" className="font-normal">
                  {activeTab === 'all'
                    ? 'No business verification requests found.'
                    : `No ${activeTab} verification requests found.`}
                </Typography>
              </div>
            ) : (
              <div className="overflow-x-scroll">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {[
                        'Business Name',
                        'Contact',
                        'Business Type',
                        'Submitted',
                        'Status',
                        'Last Updated',
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
                    {filteredVerifications.map((verification, key) => {
                      const className = `py-3 px-5 ${
                        key === filteredVerifications.length - 1
                          ? ''
                          : 'border-b border-blue-gray-50'
                      }`;
                      const status = getStatusText(verification);

                      return (
                        <tr key={verification._id}>
                          <td className={className}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {verification.businessProfile?.businessName ||
                                  'N/A'}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {verification.name}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {verification.email}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {verification.businessProfile?.businessType ||
                                'N/A'}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {verification.businessProfile?.submissionDate
                                ? new Date(
                                    verification.businessProfile.submissionDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={getStatusColor(status.toLowerCase())}
                              value={status}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {verification.businessProfile?.verificationDate
                                ? new Date(
                                    verification.businessProfile.verificationDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </Typography>
                          </td>
                          <td className={className}>
                            <div className="flex gap-2">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => handleView(verification)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                variant="text"
                                color="green"
                                onClick={() =>
                                  handleVerifyAction(verification, 'approve')
                                }
                                disabled={
                                  verification.businessProfile
                                    ?.isBusinessVerified
                                }
                              >
                                <CheckIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                variant="text"
                                color="red"
                                onClick={() =>
                                  handleVerifyAction(verification, 'reject')
                                }
                                disabled={
                                  verification.businessProfile
                                    ?.isBusinessVerified
                                }
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default BusinessVerification;
