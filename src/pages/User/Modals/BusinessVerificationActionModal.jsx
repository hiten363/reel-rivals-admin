import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
  Typography
} from '@material-tailwind/react';

const BusinessVerificationActionModal = ({
  showVerifyDialog,
  setShowVerifyDialog,
  verificationAction,
  selectedVerification,
  rejectionReason,
  setRejectionReason,
  processing,
  submitVerification
}) => {
  return (
    <>
      <Dialog
        open={showVerifyDialog}
        handler={() => setShowVerifyDialog(false)}
      >
        <DialogHeader>
          {verificationAction === 'approve' ? 'Approve' : 'Reject'} Business
          Verification
        </DialogHeader>
        <DialogBody>
          <Typography className="mb-4">
            Are you sure you want to {verificationAction} the business
            verification for{' '}
            <strong>
              {selectedVerification?.businessProfile?.businessName}
            </strong>
            ?
          </Typography>

          {verificationAction === 'reject' && (
            <div>
              <Typography variant="h6" className="mb-2">
                Rejection Reason *
              </Typography>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                rows={4}
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="gray"
            onClick={() => setShowVerifyDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color={verificationAction === 'approve' ? 'green' : 'red'}
            onClick={submitVerification}
            loading={processing}
          >
            {verificationAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BusinessVerificationActionModal;
