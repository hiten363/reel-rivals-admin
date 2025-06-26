import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';

const BusinessVerificationDetailModal = ({
  showViewDialog,
  setShowViewDialog,
  selectedVerification,
  getStatusColor,
  getStatusText
}) => {
  return (
    <>
      <Dialog
        open={showViewDialog}
        handler={() => setShowViewDialog(false)}
        size="lg"
      >
        <DialogHeader>Business Verification Details</DialogHeader>
        <DialogBody className="space-y-4">
          {selectedVerification && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="h6" className="mb-2">
                  Business Information
                </Typography>
                <div className="space-y-2">
                  <Typography>
                    <strong>Business Name:</strong>{' '}
                    {selectedVerification.businessProfile?.businessName}
                  </Typography>
                  <Typography>
                    <strong>Business Type:</strong>{' '}
                    {selectedVerification.businessProfile?.businessType}
                  </Typography>
                  <Typography>
                    <strong>Website:</strong>{' '}
                    {selectedVerification.businessProfile?.websiteUrl || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Contact Name:</strong> {selectedVerification.name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {selectedVerification.email}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong>{' '}
                    <Chip
                      variant="gradient"
                      color={getStatusColor(
                        getStatusText(selectedVerification).toLowerCase()
                      )}
                      value={getStatusText(selectedVerification)}
                      className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                  </Typography>
                  {selectedVerification.businessProfile?.rejectionReason && (
                    <Typography>
                      <strong>Rejection Reason:</strong>{' '}
                      {selectedVerification.businessProfile.rejectionReason}
                    </Typography>
                  )}
                </div>
              </div>

              <div>
                <Typography variant="h6" className="mb-2">
                  Submitted Documents
                </Typography>
                <div className="space-y-2">
                  <div>
                    <Typography className="font-semibold">
                      Registration Certificate:
                    </Typography>
                    {selectedVerification.businessProfile
                      ?.registrationCertificate ? (
                      <a
                        href={
                          selectedVerification.businessProfile
                            .registrationCertificate
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Document
                      </a>
                    ) : (
                      <Typography color="gray">Not provided</Typography>
                    )}
                  </div>

                  <div>
                    <Typography className="font-semibold">
                      TIN Document:
                    </Typography>
                    {selectedVerification.businessProfile?.tin ? (
                      <a
                        href={selectedVerification.businessProfile.tin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Document
                      </a>
                    ) : (
                      <Typography color="gray">Not provided</Typography>
                    )}
                  </div>

                  <div>
                    <Typography className="font-semibold">
                      Proof of Address:
                    </Typography>
                    {selectedVerification.businessProfile?.proofOfAddress ? (
                      <a
                        href={
                          selectedVerification.businessProfile.proofOfAddress
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Document
                      </a>
                    ) : (
                      <Typography color="gray">Not provided</Typography>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowViewDialog(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BusinessVerificationDetailModal;
