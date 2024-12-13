import '@fortawesome/fontawesome-free/css/all.min.css';

//check marks
const BooleanIcon = ({ value }: { value: boolean }) => {
    return value ? (
        <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
    ) : (
        <i className="fas fa-times-circle" style={{ color: 'red' }}></i>
    );
};

export default BooleanIcon;
