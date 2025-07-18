import { XMarkIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import Spinner from '../../../Util/Spinner';

const SocialVerificationActionModal = ({
  showActionDialog,
  setShowActionDialog,
  verificationAction,
  selectedVerification,
  rejectionReason,
  setRejectionReason,
  adminNotes,
  setAdminNotes,
  processing,
  submitVerification
}) => {
  if (!showActionDialog || !selectedVerification) return null;

  const isApproval = verificationAction === 'APPROVED';
  const isRejection = verificationAction === 'REJECTED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-auto max-h-[90vh] max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <Typography variant="h5" color="blue-gray">
            {isApproval ? 'Approve' : 'Reject'} Verification Request
          </Typography>
          <button
            onClick={() => setShowActionDialog(false)}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={processing}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedVerification.user?.img || '/img/user.png'}
                alt={selectedVerification.user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <Typography variant="h6" color="blue-gray">
                  {selectedVerification.user?.name}
                </Typography>
                <Typography color="gray" className="text-sm">
                  @{selectedVerification.user?.userName}
                </Typography>
              </div>
            </div>
          </div>

          {/* Action Confirmation */}
          <div
            className={`p-4 rounded-lg ${
              isApproval
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <Typography
              className={`text-sm ${
                isApproval ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {isApproval
                ? '✅ You are about to approve this social verification request. The user will be marked as verified and can receive collaboration requests from businesses.'
                : '❌ You are about to reject this social verification request. The user will be notified and can resubmit with updated information.'}
            </Typography>
          </div>

          {/* Rejection Reason (only for rejections) */}
          {isRejection && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                required
              />
            </div>
          )}

          {/* Admin Notes (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any internal notes about this verification..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Typography variant="h6" className="mb-2">
              Summary
            </Typography>
            <div className="space-y-1 text-sm">
              <div>
                <strong>Action:</strong> {isApproval ? 'Approve' : 'Reject'}{' '}
                verification
              </div>
              <div>
                <strong>User:</strong> {selectedVerification.user?.name} (@
                {selectedVerification.user?.userName})
              </div>
              {isRejection && rejectionReason && (
                <div>
                  <strong>Reason:</strong> {rejectionReason}
                </div>
              )}
              {adminNotes && (
                <div>
                  <strong>Notes:</strong> {adminNotes}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={() => setShowActionDialog(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            onClick={submitVerification}
            disabled={processing || (isRejection && !rejectionReason.trim())}
            className={`px-6 py-2 text-white rounded font-medium flex items-center gap-2 ${
              isApproval
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
            }`}
          >
            {processing && <Spinner />}
            {processing
              ? 'Processing...'
              : isApproval
              ? 'Approve Request'
              : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialVerificationActionModal;
