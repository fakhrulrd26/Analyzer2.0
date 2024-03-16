import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import FeedbackForm from "../pages/user/feedback";

function FeedbackModal({ isModalOpen, closeModal }) {
  const [step, setStep] = useState(1);
  return (
    <div>
      <Modal isOpen={isModalOpen}>
        <ModalHeader>Feedback Aplikasi</ModalHeader>
        <ModalBody>
          {step === 1 ? (
            <FeedbackForm setStep={setStep} />
          ) : (
            <div className="text-center my-3">
              <h4>
                Thank you for the review you have given, I hope you are
                satisfied using this site.
              </h4>
              <h4>Stay healthy :)</h4>
              <Button
                color="primary"
                className="w-100 mt-3"
                onClick={() => closeModal()}
              >
                Tutup
              </Button>
            </div>
          )}
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary">Do Something</Button>{" "}
        </ModalFooter> */}
      </Modal>
    </div>
  );
}

export default FeedbackModal;
