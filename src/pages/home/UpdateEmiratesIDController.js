export default class UpdateEmiratesIDController {
    static modalRef;

    static setModalRef = function(ref) {
        this.modalRef = ref;
    };

    static run = function(props) {
        if (this.modalRef.current) {
            this.modalRef.current.run(props);
        }
    };

    static clearStates = function(props) {
        if (this.modalRef.current) {
            this.modalRef.current.clearStates(props);
        }
    };
}
