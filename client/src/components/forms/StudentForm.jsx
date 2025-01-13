import { useState, useEffect } from 'react';
import { Grid, Paper, TextInput, Select, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const StudentForm = () => {
    const [faculties, setFaculties] = useState([]);
    const [specializations, setSpecializations] = useState([]);
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
        const fetchFaculties = async () => {
            const response = await axios.get('/faculties?page=-1');
            setFaculties(response.data.data);
        };

        const fetchSpecializations = async () => {
            const response = await axios.get('/specializations?page=-1');
            setSpecializations(response.data.data);
        };

        fetchFaculties();
        fetchSpecializations();
    }, []);

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
        } catch (error) {
            console.log(error)
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
                            label="Факультет"
                            placeholder="Выберите факультет"
                            data={faculties.map((faculty) => ({ value: `${faculty.id}`, label: faculty.name }))}
                            {...form.getInputProps('facultyId')}
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
