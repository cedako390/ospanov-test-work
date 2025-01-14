import PropTypes from 'prop-types';
import styles from './Card.module.scss';
import { useState } from 'react';
import { Button, Modal, TextInput, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const FacultyCard = ({ faculty, updateList }) => {
    const [opened, setOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: faculty.name,
        },
        validate: {
            name: (value) => (value ? null : 'Введите название факультета'),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.put(`/faculties/${faculty.id}`, values);
            notifications.show({
                title: 'Успех!',
                message: 'Факультет успешно обновлён.',
                color: 'green',
                position: 'top-right',
            });
            setOpened(false);
            updateList();
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось обновить факультет.',
                color: 'red',
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteCard = async () => {
        try {
            await axios.delete(`/faculties/${faculty.id}`);
            notifications.show({
                title: 'Успех!',
                message: 'Факультет был удалён.',
                color: 'green',
                position: 'top-right',
            });
            setDeleteOpened(false);
            updateList();
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось удалить факультет.',
                color: 'red',
                position: 'top-right',
            });
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.stack}>
                <div className={styles.group}>
                    <span className={styles.label}>🏛 Факультет:</span>
                    <span className={styles.value}>{faculty.name}</span>
                </div>
                <div className={styles.group}>
                    <Button onClick={() => setOpened(true)} variant="outline" className={styles.editButton}>
                        Редактировать
                    </Button>
                    <Button onClick={() => setDeleteOpened(true)} variant="filled" className={styles.deleteButton}>
                        Удалить
                    </Button>
                </div>
            </div>

            {/* Модальное окно для удаления */}
            <Modal
                opened={deleteOpened}
                onClose={() => setDeleteOpened(false)}
                title="Удаление факультета"
            >
                <div className={styles.deleteModal}>
                    <div>Вы уверены, что хотите удалить факультет {faculty.name}?</div>
                    <div className={styles.actions}>
                        <Button onClick={deleteCard} variant="outline">Подтвердить</Button>
                        <Button onClick={() => setDeleteOpened(false)} variant="filled">Я передумал</Button>
                    </div>
                </div>
            </Modal>

            {/* Модальное окно для редактирования */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Редактировать факультет"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Название факультета"
                                placeholder="Введите название"
                                {...form.getInputProps('name')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Button type="submit" fullWidth loading={loading}>
                                Обновить факультет
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Modal>
        </div>
    );
};

FacultyCard.propTypes = {
    faculty: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    updateList: PropTypes.func.isRequired,
};

export { FacultyCard };
