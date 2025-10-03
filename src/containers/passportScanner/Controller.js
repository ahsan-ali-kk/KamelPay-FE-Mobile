export default class PassportController {
    static modalRef;

    static setModalRef = function(ref) {
        this.modalRef = ref;
    };

    static run = function(props) {
        if (this.modalRef.current) {
            this.modalRef.current.open(props);
        }
    };

    static clearStates = function(props) {
        if (this.modalRef.current) {
            this.modalRef.current.clearStates(props);
        }
    };
}
