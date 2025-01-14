import { useState, useEffect } from 'react';
import { Grid, Paper, TextInput, Select, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const StudentForm = ({onSubmit, activeTab}) => {
    const [specializations, setSpecializations] = useState([]);
    const [filteredFaculties, setFilteredFaculties] = useState([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            lastName: '',
            firstName: '',
            middleName: '',
            facultyId: '',
            specializationId: '',
        },
        validate: {
            lastName: (value) => (value ? null : 'Введите фамилию'),
            firstName: (value) => (value ? null : 'Введите имя'),
            facultyId: (value) => (value ? null : 'Выберите факультет'),
            specializationId: (value) => (value ? null : 'Выберите специальность'),
        },
    });

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await axios.get('/specializations?page=-1');
                setSpecializations(response.data.data);
            } catch (error) {
                console.error("Ошибка загрузки специальностей:", error);
            }
        };

        fetchSpecializations();
    }, [activeTab]);

    useEffect(() => {
        const fetchFilteredFaculties = async () => {
            if (!form.values.specializationId) {
                setFilteredFaculties([]);
                return;
            }

            try {
                const response = await axios.get(`/faculties/by-specialization/${form.values.specializationId}`);
                setFilteredFaculties(response.data.data);
            } catch (error) {
                console.error("Ошибка загрузки факультетов:", error);
                setFilteredFaculties([]);
            }
        };

        fetchFilteredFaculties();
    }, [form.values.specializationId]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('/students', values);
            notifications.show({
                title: 'Успех!',
                message: 'Студент успешно добавлен.',
                color: 'green',
                position: 'top-right',
            });
            form.reset();
            setFilteredFaculties([]);
            onSubmit()
        } catch (error) {
            console.error("Ошибка добавления студента:", error);
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось добавить студента.',
                color: 'red',
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper withBorder shadow="sm" p="md">
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
                            data={specializations.map((spec) => ({ value: `${spec.id}`, label: spec.name }))}
                            {...form.getInputProps('specializationId')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Select
                            label="Факультет"
                            placeholder="Выберите факультет"
                            data={filteredFaculties.map((faculty) => ({ value: `${faculty.id}`, label: faculty.name }))}
                            {...form.getInputProps('facultyId')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Button type="submit" fullWidth loading={loading}>
                            Добавить студента
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    );
};

export default StudentForm;
