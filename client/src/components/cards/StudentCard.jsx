import PropTypes from "prop-types";
import styles from './Card.module.scss'

const StudentCard = ({student}) => (
    <div className={styles.card}>
        <div className={styles.stack}>
            <div className={styles.group}>
                <span className={styles.label}>Фамилия:</span>
                <span className={styles.value}>{student.lastName}</span>
            </div>

            <div className={styles.group}>
                <span className={styles.label}>Имя:</span>
                <span className={styles.value}>{student.firstName}</span>
            </div>

            <div className={styles.group}>
                <span className={styles.label}>Отчество:</span>
                <span className={styles.value}>{student.middleName || "Не указано"}</span>
            </div>


            <div className={styles.group}>
                <span className={styles.label}>📚 Факультет:</span>
                <span className={styles.value}>{student.facultyName}</span>
            </div>

            <div className={styles.group}>
                <span className={styles.label}>🎓 Специальность:</span>
                <span className={styles.value}>{student.specializationName}</span>
            </div>
        </div>
    </div>
);

StudentCard.propTypes = {
    student: PropTypes.shape({
        id: PropTypes.number.isRequired,
        lastName: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        middleName: PropTypes.string,
        facultyName: PropTypes.string.isRequired,
        specializationName: PropTypes.string.isRequired,
    }).isRequired,
};

export {StudentCard};
