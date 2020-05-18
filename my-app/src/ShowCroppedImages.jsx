import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Loader from './Loader';
import toastr from 'toastr';
var loderOptions= {
    "positionClass": "toast-top-center",
    "hideDuration": 0,
    "timeOut": 0,
    "closeButton": false,
    "progressBar": false,
    "showEasing": "swing",
    "hideEasing": "swing",
    "showMethod": "slideDown",
    "hideMethod": "slideUp",
    "tapToDismiss": false,
    "toastClass":"toastrInfo"
}
var erroroptions= {
    "positionClass": "toast-top-center",
    "extendedTimeOut": 0,
    "timeOut": 0,
    "closeButton": true,
    "progressBar": false,
    "showEasing": "swing",
    "hideEasing": "swing",
    "showMethod": "slideDown",
    "hideMethod": "slideUp",
    "toastClass":"toastrErr"
}
export default class ShowCroppedImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCroppedModal: this.props.showCroppedModal,
            imagesDisplay: false,
            showLoader: false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.showCroppedModal) {
            this.setState({ showCroppedModal: nextProps.showCroppedModal })
        }
        else{
            this.setState({ showCroppedModal: !nextProps.showCroppedModal })
        }
    }
    drawCanvas = (crop) => {
        crop.forEach(croppedImg =>{
            this.setState({firebaseImg:croppedImg.imageData})
            const image = new Image()
            image.src = croppedImg.srcImage
            image.onload = () => {
                this.canvas.width = croppedImg.imageObj.dsWidth
                this.canvas.height = croppedImg.imageObj.dsHeight
                const ctx = this.canvas.getContext('2d');
                //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                ctx.drawImage(
                    image,
                    croppedImg.imageObj.srcXCord,
                    croppedImg.imageObj.srcYCord,
                    croppedImg.imageObj.srcWidth,
                    croppedImg.imageObj.srcHeight,
                    croppedImg.imageObj.dsXCord,
                    croppedImg.imageObj.dsYCord,
                    croppedImg.imageObj.dsWidth,
                    croppedImg.imageObj.dsHeight,
                );
            }
        })
            
    }
    handleConfirmation = (e) => {
        if (e.target.innerText === 'Yes') {
            this.setState({ showCroppedModal: false,showLoader: true })
            fetch(`http://localhost:5000/api/getImages/${this.props.croppedImageData.image._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(
                    async response => {
                        toastr.info(`Fetched image successfully`, '', loderOptions);
                        await this.setState({ imagesDisplay: true,showLoader: false }, () => {
                            this.drawCanvas(response);
                        })
                    },
                    error => {
                        toastr.info(`Failed to load image due to ${error}`, '', loderOptions);
                        this.setState({showLoader: false })
                    }
                );
        }
        else if (e.target.innerText === 'No') {
            this.setState({ showCroppedModal: false });
            this.props.hideModal(false);
        }
    }
    hideConfirmation = () => {
        this.setState({ showCroppedModal: false });
    }
    closeModal= () => {
        this.setState({ imagesDisplay: false });
        this.props.hideModal(false);
    }
    render() {
        return (
            <React.Fragment>
                <Loader show={this.state.showLoader}/>
                <Modal
                    size="lg"
                    onHide={this.hideConfirmation}
                    show={this.state.showCroppedModal}
                    backdrop={false}
                    centered={true}
                    animation={false}
                    backdropClassName={""} >
                    <Modal.Header className='conf-header-background'>
                        <Modal.Title>
                            <h4 id="confTitle">
                                <i className="fa fa-exclamation-circle" ></i>Confirmation
								</h4>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row ">
                            <p className="conf-body">
                                &nbsp;<i className="fa fa-check-circle" aria-hidden="true"></i>
                                &nbsp;&nbsp;{`Do you want to fetch the recent cropped images?`}</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button id="yesButton" variant="info" className="btn btn-sm btn-success footer-yes-btn" onClick={(e) => this.handleConfirmation(e)}>
                                Yes
                            </Button>
                            <Button id="noButton" variant="info" className="btn btn-sm btn-danger footer-no-btn" onClick={(e) => this.handleConfirmation(e)}>
                                No
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
                <Modal
                    size="lg"
                    show={this.state.imagesDisplay}
                    backdrop={false}
                    centered={true}
                    animation={false}
                    backdropClassName={""}
                    dialogClassName="my-modal" >
                    <Modal.Header className='conf-header-background'>
                        <Modal.Title>
                            <Button variant="info" className="btn btn-sm btn-danger" onClick={this.closeModal}>
                                    <i className="fa fa-times"></i>
                                </Button>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="view-content p-align">
                        <div className="col-md-12">
                            <canvas ref={(canvas) => this.canvas = canvas} style={{'border':'2px solid #000000'}}/>
                        </div>
                        <div className="col-md-12 ">
                            <p >Same image can be found on image hosting provider Google firebase at </p>
                            <a className="btn btn-success" href={this.state.firebaseImg} target="_blank">View Image on Firebase</a>
                        </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}