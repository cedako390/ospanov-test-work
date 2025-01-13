import PropTypes from 'prop-types';
import styles from './Card.module.scss';

const FacultyCard = ({ faculty }) => (
    <div className={styles.card}>
        <div className={styles.stack}>
            <div className={styles.group}>
                <span className={styles.label}>🏛 Факультет:</span>
                <span className={styles.value}>{faculty.name}</span>
            </div>
        </div>
    </div>
);

FacultyCard.propTypes = {
    faculty: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export { FacultyCard };
