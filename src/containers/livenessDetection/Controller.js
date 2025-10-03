export default class LivenessDetectionController {
    static modalRef;

    static setModalRef = function(ref) {
        this.modalRef = ref;
    };

    static toggleModal = function(value) {
        if (this.modalRef.current) {
            this.modalRef.current.toggleModal(value);
        }
    };

    static getCapturedPicture = function() {
        if (this.modalRef.current) {
           return this.modalRef.current.getAndSetCapturedPicture();
        }
    };

    static clearCapturedPicture = function() {
        if (this.modalRef.current) {
            this.modalRef.current.getAndSetCapturedPicture("CLEAR");
        }
    };
}
