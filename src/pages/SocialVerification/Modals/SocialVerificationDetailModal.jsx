import { XMarkIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';

const SocialVerificationDetailModal = ({
  showViewDialog,
  setShowViewDialog,
  selectedVerification,
  getStatusColor,
  getStatusText
}) => {
  if (!showViewDialog || !selectedVerification) return null;

  const totalFollowers = Object.values(
    selectedVerification.followerCounts || {}
  ).reduce((sum, count) => sum + (count || 0), 0);

  const platformIcons = {
    instagram: '📷',
    youtube: '🎥',
    tiktok: '🎵',
    twitter: '🐦',
    facebook: '👥',
    linkedin: '💼',
    other: '🔗'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <Typography variant="h5" color="blue-gray">
            Social Verification Details
          </Typography>
          <button
            onClick={() => setShowViewDialog(false)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Typography variant="h6" className="mb-3">
              User Information
            </Typography>
            <div className="flex items-center gap-4">
              <img
                src={selectedVerification.user?.img || '/img/user.png'}
                alt={selectedVerification.user?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <Typography variant="h6" color="blue-gray">
                  {selectedVerification.user?.name}
                </Typography>
                <Typography color="gray" className="text-sm">
                  @{selectedVerification.user?.userName}
                </Typography>
                <Typography color="gray" className="text-sm">
                  {selectedVerification.user?.email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Typography color="gray" className="text-sm font-medium mb-1">
                Status
              </Typography>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  selectedVerification.status
                )}`}
              >
                {getStatusText(selectedVerification)}
              </span>
            </div>
            <div>
              <Typography color="gray" className="text-sm font-medium mb-1">
                Submission Date
              </Typography>
              <Typography className="text-sm">
                {new Date(
                  selectedVerification.submissionDate
                ).toLocaleDateString()}
              </Typography>
            </div>
            <div>
              <Typography color="gray" className="text-sm font-medium mb-1">
                Total Followers
              </Typography>
              <Typography className="text-sm font-semibold">
                {totalFollowers.toLocaleString()}
              </Typography>
            </div>
          </div>

          {/* Description */}
          {selectedVerification.description && (
            <div>
              <Typography color="gray" className="text-sm font-medium mb-2">
                Description
              </Typography>
              <div className="bg-gray-50 rounded-lg p-3">
                <Typography className="text-sm whitespace-pre-wrap">
                  {selectedVerification.description}
                </Typography>
              </div>
            </div>
          )}

          {/* Social Links and Follower Counts */}
          <div>
            <Typography variant="h6" className="mb-3">
              Social Media Accounts
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedVerification.socialLinks || {}).map(
                ([platform, link]) => {
                  if (!link) return null;
                  const followerCount =
                    selectedVerification.followerCounts?.[platform] || 0;

                  return (
                    <div key={platform} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {platformIcons[platform] || '🔗'}
                          </span>
                          <Typography className="font-medium capitalize">
                            {platform}
                          </Typography>
                        </div>
                        <Typography className="text-sm font-semibold text-blue-600">
                          {followerCount.toLocaleString()} followers
                        </Typography>
                      </div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {link}
                      </a>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Review Information */}
          {selectedVerification.status !== 'PENDING' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Typography variant="h6" className="mb-3">
                Review Information
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography color="gray" className="text-sm font-medium mb-1">
                    Reviewed By
                  </Typography>
                  <Typography className="text-sm">
                    {selectedVerification.reviewedBy?.name || 'N/A'}
                  </Typography>
                </div>
                <div>
                  <Typography color="gray" className="text-sm font-medium mb-1">
                    Review Date
                  </Typography>
                  <Typography className="text-sm">
                    {selectedVerification.reviewDate
                      ? new Date(
                          selectedVerification.reviewDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </div>
              </div>

              {selectedVerification.rejectionReason && (
                <div className="mt-4">
                  <Typography color="gray" className="text-sm font-medium mb-1">
                    Rejection Reason
                  </Typography>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <Typography className="text-sm text-red-800">
                      {selectedVerification.rejectionReason}
                    </Typography>
                  </div>
                </div>
              )}

              {selectedVerification.adminNotes && (
                <div className="mt-4">
                  <Typography color="gray" className="text-sm font-medium mb-1">
                    Admin Notes
                  </Typography>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <Typography className="text-sm text-blue-800">
                      {selectedVerification.adminNotes}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={() => setShowViewDialog(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialVerificationDetailModal;
