import React from 'react';
import ReactImgCrop from 'react-image-crop';
import { storage } from './firebaseConfig';
import ShowCroppedImages from './ShowCroppedImages';
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
export default class ImgUploadComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imgSrc: '',
            imgWidth: 0,
            imgHeight: 0,
            validFileTypes: ["image/jpg", "image/jpeg", "image/bmp", "image/gif", "image/png"],
            crop: {
                width: 1024,
                height: 1024,
                unit: 'px'
            },
            validImgPixel: false,
            showReactCropper: false,
            canvasWidth: 0,
            canvasHeight: 0,
            canvasReady: false,
            croppedCanvasObj: {},
            croppedCanvasBlob: '',
            showCroppedModal: false,
            showLoader: false
        }
        this.selectImg = this.selectImg.bind(this);
        this.validateFileType = this.validateFileType.bind(this);
    }

    validateFileType(file) {
        let isValid = false;
        if (this.state.validFileTypes.includes(file.type)) {
            isValid = true;
        }
        return isValid;
    }
    selectImg(event) {
        toastr.clear();
        if (event.target.files && event.target.files.length > 0) {
            const isValid = this.validateFileType(event.target.files[0]);
            if (isValid) {
                this.setState({ selectedFile: event.target.files[0] });
                this.setState({
                    imgSrc: URL.createObjectURL(event.target.files[0])
                });
                const image = new Image();
                image.src = URL.createObjectURL(event.target.files[0]);
                image.onload = () => {
                    if (image.width === 1024 && image.height === 1024) {
                        toastr.info(`Image is of valid size width : ${image.width} & Height: ${image.height}`, '', loderOptions);
                        this.setState({ validImgPixel: true });
                        // const ctx = this.canvas.getContext('2d');
                        // ctx.drawImage(image,0,0);
                    }
                    else {
                        toastr.error(`Image is of invalid size width : ${image.width} & Height: ${image.height}, Acceptable[width :1024 & Height: 1024]`, '', erroroptions);
                        this.setState({
                            imgSrc: '', validImgPixel: false, showReactCropper: false
                        })
                    }
                }
            }
            else {
                toastr.error(`File is of unacceptable type ${event.target.files[0].type}, Acceptable Types: ${this.state.validFileTypes}`, '', erroroptions);
                this.setState({
                    imgSrc: '', validImgPixel: false, showReactCropper: false
                });
            }
        }
    }
    setCrop = (newCrop) => {
        this.setState({ crop: newCrop })
        console.log(this.state.crop)
    }
    handleImgLoaded = (img) => {
        console.log(img)
    }
    handleImgCropComplete = (crop, percentCrop) => {

        // this.setState({
        //     canvasWidth: crop.width,
        //     canvasHeight: crop.height
        // });
        const image = new Image()
        image.src = URL.createObjectURL(this.state.selectedFile)
        image.onload = () => {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            this.canvas.width = crop.width
            this.canvas.height = crop.height
            const ctx = this.canvas.getContext('2d');
            //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            );
            this.setState({
                canvasReady: true, croppedCanvasObj: {
                    imageSrc: image,
                    srcXCord: crop.x * scaleX,
                    srcYCord: crop.y * scaleY,
                    srcWidth: crop.width * scaleX,
                    srcHeight: crop.height * scaleY,
                    dsXCord: 0,
                    dsYCord: 0,
                    dsWidth: crop.width,
                    dsHeight: crop.height
                }
            })
        }

        console.log(crop, percentCrop, 'crop,percentCrop')
    }
    handleBtnClick = (e) => {
        this.setState({ showReactCropper: true, imgSrc: URL.createObjectURL(this.state.selectedFile) });
        if (e.target.innerText.trim() === 'Horizontal') {
            this.setState({
                crop: {
                    width: 755,
                    height: 450,
                    unit: 'px',
                    x: 0,
                    y: 0,
                }
            });
        }
        else if (e.target.innerText.trim() === 'Vertical') {
            this.setState({
                crop: {
                    width: 365,
                    height: 450,
                    unit: 'px',
                    x: 0,
                    y: 0
                }
            });
        }
        else if (e.target.innerText.trim() === 'Horizontal Small') {
            this.setState({
                crop: {
                    width: 365,
                    height: 212,
                    unit: 'px',
                    x: 0,
                    y: 0
                }
            });
        }
        else if (e.target.innerText.trim() === 'Gallery') {
            this.setState({
                crop: {
                    width: 380,
                    height: 380,
                    unit: 'px',
                    x: 0,
                    y: 0
                }
            });
        }
    }
    saveCroppedImg = (e) => {
        toastr.info("Saving image", '', loderOptions);
        this.setState({showLoader: true});
        let currentImageName = "firebase-image-" + Date.now();
        this.canvas.toBlob(blob => {
            var image = new Image();
            image.src = blob;
            this.setState({ croppedCanvasBlob: blob }, () => {
                let uploadImage = storage.ref(`images/${currentImageName}`).put(this.state.croppedCanvasBlob);

                uploadImage.on('state_changed',
                    (snapshot) => { },
                    (error) => {
                        alert(error);
                    },
                    () => {
                        storage.ref('images').child(currentImageName).getDownloadURL().then(url => {
                            // store image object in the database
                            let payloadObj = {
                                srcImage:URL.createObjectURL(this.state.selectedFile),
                                imageName: currentImageName,
                                imageData: url,
                                imageObj: this.state.croppedCanvasObj
                            }
                            fetch('http://localhost:5000/api/croppedImage', {
                                method: 'POST',
                                body: JSON.stringify(payloadObj),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                            .then(response => response.json())
                            .then(
                                response => {
                                    
                                    this.setState({
                                        showCroppedModal: true,
                                        croppedImageData: response,
                                        showLoader: false
                                    },()=>toastr.clear())
                                },
                                error => {
                                    toastr.error(`Failed to save image due to ${error}`, '', erroroptions);
                                    this.setState({
                                        showCroppedModal: false,
                                        showLoader: false
                                    })
                                }
                            );
                        })
                    })
            })
        });

    }
    hideModal = (bool) =>{
        this.setState({showCroppedModal:bool})
    }
    render() {
        const { imgSrc, crop, validImgPixel, showReactCropper, canvasReady, showCroppedModal, croppedImageData } = this.state;
        return (
            
            <div className="view-content">
            <Loader show={this.state.showLoader}/>
                <div className='col-md-8'>
                    <form>
                        <div className="custom-file">
                            <span><i className="fa fa-image"></i></span>
                            <input type="file" className="custom-file-input" id="customFile" onChange={(e) => this.selectImg(e)} />
                            <label className="custom-file-label" htmlFor="customFile"> Upload Image</label>
                        </div>
                    </form>

                </div>
                {validImgPixel &&
                    <React.Fragment>
                        <p className="p-font"><strong>Choose the crop type for your image</strong></p>
                        <div className='col-md-8 row'>
                            <div className='col-md-3'><button title="width:755,Height:450" id="horizontalBtn" type="button" className="btn btn-light" onClick={(e) => this.handleBtnClick(e)}>Horizontal</button></div>
                            <div className='col-md-3'><button title="width:365,Height:450" id="verticalBtn" type="button" className="btn btn-light" onClick={(e) => this.handleBtnClick(e)}>Vertical</button></div>
                            <div className='col-md-3'><button title="width:365,Height:212" id="horizontalSmlBtn" type="button" className="btn btn-light" onClick={(e) => this.handleBtnClick(e)}>Horizontal Small</button></div>
                            <div className='col-md-3'><button title="width:380,Height:380" id="galleryBtn" type="button" className="btn btn-light" onClick={(e) => this.handleBtnClick(e)}>Gallery</button></div>
                        </div>
                    </React.Fragment>
                }
                <div className='col-md-8'>
                    {imgSrc !== '' && showReactCropper &&
                        <div>
                            {/* <canvas ref={(canvas)=>this.canvas=canvas} width="1024" height="1024" /> */}
                            <ReactImgCrop src={imgSrc}
                                crop={crop}
                                onChange={(newCrop) => this.setCrop(newCrop)}
                                onImageLoaded={this.handleImgLoaded}
                                onComplete={this.handleImgCropComplete}
                                locked />
                        </div>
                    }
                </div>
                <div className='col-md-8'>
                    {imgSrc !== '' && showReactCropper &&
                        <div>
                            <p className="p-font"><strong>Preview of the cropped image</strong></p>
                            <canvas ref={(canvas) => this.canvas = canvas} />
                        </div>
                    }
                </div>
                <div className='col-md-8'>
                    {imgSrc !== '' && showReactCropper && canvasReady &&
                        <div>
                            <button type="button" class="btn btn-success" onClick={(e) => this.saveCroppedImg(e)}>Save Image</button>
                        </div>
                    }
                </div>
                <div className='col-md-8'>
                    {showCroppedModal &&
                        <div>
                            <ShowCroppedImages showCroppedModal={showCroppedModal}
                            croppedImageData={croppedImageData}
                            hideModal={this.hideModal}/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}