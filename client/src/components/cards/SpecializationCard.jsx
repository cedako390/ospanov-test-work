import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button, Modal, Grid, TextInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import styles from './Card.module.scss';

const SpecializationCard = ({ specialization, updateList }) => {
    const [opened, setOpened] = useState(false);
    const [deleteOpened, setDeleteOpened] = useState(false);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: specialization.name,
            facultyId: `${specialization.facultyId}`,
        },
        validate: {
            name: (value) => (value ? null : 'Введите название специальности'),
            facultyId: (value) => (value ? null : 'Выберите факультет'),
        },
    });

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await axios.get('/faculties?page=-1');
                setFaculties(response.data.data);
            } catch (error) {
                console.error('Ошибка при загрузке факультетов:', error);
            }
        };

        fetchFaculties();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.put(`/specializations/${specialization.id}`, values);
            notifications.show({
                title: 'Успех!',
                message: 'Данные специальности успешно обновлены.',
                color: 'green',
                position: 'top-right',
            });
            setOpened(false);
            updateList();
        } catch (error) {
            console.log(error)
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось обновить данные специальности.',
                color: 'red',
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteCard = async () => {
        try {
            await axios.delete(`/specializations/${specialization.id}`);
            notifications.show({
                title: 'Успех!',
                message: 'Специальность была удалена.',
                color: 'green',
                position: 'top-right',
            });
            setDeleteOpened(false);
            updateList();
        } catch (error) {
            console.log(error)
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось удалить специальность.',
                color: 'red',
                position: 'top-right',
            });
        }
    };

    return (
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
                title="Удаление специальности"
            >
                <div className={styles.deleteModal}>
                    <div>Вы уверены, что хотите удалить специальность {specialization.name}?</div>
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
                title="Редактировать специальность"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={12}>
                            <TextInput
                                label="Название специальности"
                                placeholder="Введите название"
                                {...form.getInputProps('name')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Select
                                label="Факультет"
                                placeholder="Выберите факультет"
                                data={faculties.map((faculty) => ({
                                    value: `${faculty.id}`,
                                    label: faculty.name,
                                }))}
                                {...form.getInputProps('facultyId')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Button type="submit" fullWidth loading={loading}>
                                Сохранить изменения
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Modal>
        </div>
    );
};

SpecializationCard.propTypes = {
    specialization: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        facultyName: PropTypes.string.isRequired,
        facultyId: PropTypes.string.isRequired,
    }).isRequired,
    updateList: PropTypes.func.isRequired,
};

export { SpecializationCard };
