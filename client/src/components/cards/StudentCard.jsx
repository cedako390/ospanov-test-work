import PropTypes from "prop-types";
import styles from './Card.module.scss'
import {useForm} from "@mantine/form";
import {Button, Grid, Modal, Select, TextInput} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import axios from "axios";
import {useEffect, useState} from "react";

const StudentCard = ({student, updateList}) => {
    const [opened, setOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [faculties, setFaculties] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            lastName: student.lastName,
            firstName: student.firstName,
            middleName: student.middleName,
            facultyId: `${student.facultyId}`,
            specializationId: `${student.specializationId}`,
        },
        validate: {
            lastName: (value) => (value ? null : 'Введите фамилию'),
            firstName: (value) => (value ? null : 'Введите имя'),
            facultyId: (value) => (value ? null : 'Выберите факультет'),
            specializationId: (value) => (value ? null : 'Выберите специальность'),
        },
    });
    const fetchFaculties = async () => {
        const response = await axios.get('/faculties?page=-1');
        setFaculties(response.data.data);
    };

    const fetchSpecializations = async () => {
        const response = await axios.get('/specializations?page=-1');
        setSpecializations(response.data.data);
    };

    useEffect(() => {
        fetchFaculties();
        fetchSpecializations();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.put(`/students/${student.id}`, values);
            notifications.show({
                title: 'Успех!',
                message: 'Данные студента успешно обновлены.',
                color: 'green',
                position: 'top-right',
            });
            setOpened(false);
            updateList()
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось обновить данные студента.',
                color: 'red',
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteCard = () => {
        axios.delete(`/students/${student.id}`).then(() => {
            setDeleteOpened(false);
            notifications.show({
                title: 'Успех!',
                message: 'Контент был удален',
                color: 'green',
                position: 'top-right',
            })
            updateList()
        })
    }

    return (
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
                    <span className={styles.label}>🎓 Специальность:</span>
                    <span className={styles.value}>{student.specializationName}</span>
                </div>

                <div className={styles.group}>
                    <span className={styles.label}>📚 Факультет:</span>
                    <span className={styles.value}>{student.facultyName}</span>
                </div>

                <div className={styles.group}>
                    <Button onClick={() => setOpened(true)} variant="outline" className={styles.editButton}>
                        Редактировать
                    </Button>
                    <Button onClick={() => setDeleteOpened(true)} variant={"filled"} className={styles.deleteButton}>
                        Удалить
                    </Button>
                </div>
            </div>
            <Modal
                opened={deleteOpened}
                onClose={() => setDeleteOpened(false)}
                title={"Удаление контента"}>
                <div className={styles.deleteModal}>
                    <div>Вы уверены, что хотите удалить студента {student.firstName} {student.lastName}?</div>
                    <div className={styles.actions}>
                        <Button onClick={deleteCard} variant={"outline"}>Подтвердить</Button>
                        <Button onClick={() => setDeleteOpened(false)} variant={'filled'}>Я передумал</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Редактировать студента"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Фамилия"
                                placeholder="Введите фамилию"
                                {...form.getInputProps('lastName')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Имя"
                                placeholder="Введите имя"
                                {...form.getInputProps('firstName')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Отчество (необязательно)"
                                placeholder="Введите отчество"
                                {...form.getInputProps('middleName')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Select
                                label="Специальность"
                                placeholder="Выберите специальность"
                                data={specializations.map((spec) => ({value: `${spec.id}`, label: spec.name}))}
                                {...form.getInputProps('specializationId')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Select
                                label="Факультет"
                                placeholder="Выберите факультет"
                                data={faculties.map((faculty) => ({value: `${faculty.id}`, label: faculty.name}))}
                                {...form.getInputProps('facultyId')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Button type="submit" fullWidth loading={loading}>
                                Обновить студента
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Modal>
        </div>
    )
};

StudentCard.propTypes = {
    student: PropTypes.shape({
        id: PropTypes.number.isRequired,
        lastName: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        middleName: PropTypes.string,
        facultyName: PropTypes.string.isRequired,
        specializationName: PropTypes.string.isRequired,
        specializationId: PropTypes.string.isRequired,
        facultyId: PropTypes.string.isRequired,
    }).isRequired,
};

export {StudentCard};
