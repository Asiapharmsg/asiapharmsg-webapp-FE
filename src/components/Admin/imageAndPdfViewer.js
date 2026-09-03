import { Modal, Button, Image, Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import * as fileType from 'file-type-ext';
const ImageAndPdfViewer = (props) => {
  const { show, onHide, selectedFileBuffer } = props;
  const [isPdf, setIsPdfType] = useState(false);

  useEffect(() => {
    if (selectedFileBuffer) {
      let type = fileType(Buffer.from(selectedFileBuffer));
      console.log(type);
      setIsPdfType(type.ext == 'pdf' ? true : false);
    }
  }, [selectedFileBuffer]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="modal_title"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="active-user-modal">
        <div className="img-container">
          {isPdf ? (
            <object>
              <iframe
                className="pdf-detail"
                type="text/html"
                src={`data:application/pdf;base64,${Buffer.from(
                  selectedFileBuffer
                ).toString('base64')}`}
              />
            </object>
          ) : (
            <Image
              thumbnail="true"
              fluid="true"
              className="img-content"
              src={`data:image/png;base64,${Buffer.from(
                selectedFileBuffer
              ).toString('base64')}`}
              alt="profile-picture"
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <button
                    className="lezada-button lezada-button--medium"
                    onClick={updateButtonHandler}
                >
                    Update
                </button>
                <button
                    className="lezada-button lezada-button--medium lezada-button--transparent-button"
                    onClick={deleteButtonHandler}
                >
                    Delete
                </button> */}
      </Modal.Footer>
    </Modal>
  );
};
export default ImageAndPdfViewer;
