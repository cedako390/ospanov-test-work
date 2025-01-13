import PropTypes from 'prop-types';
import styles from './Card.module.scss';

const SpecializationCard = ({ specialization }) => (
    <div className={styles.card}>
        <div className={styles.stack}>
            <div className={styles.group}>
                <span className={styles.label}>📘 Специальность:</span>
                <span className={styles.value}>{specialization.name}</span>
            </div>

            <div className={styles.group}>
                <span className={styles.label}>🏛 Факультет:</span>
                <span className={styles.value}>{specialization.facultyName}</span>
            </div>
        </div>
    </div>
);

SpecializationCard.propTypes = {
    specialization: PropTypes.shape({
        name: PropTypes.string.isRequired,
        facultyName: PropTypes.string.isRequired,
    }).isRequired,
};

export { SpecializationCard };
