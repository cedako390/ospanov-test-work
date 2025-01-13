import { useState, useEffect } from 'react';
import { Grid, Paper, TextInput, Select, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const SpecializationForm = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            facultyId: '',
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
            await axios.post('/specializations', values);
            notifications.show({
                title: 'Успех!',
                message: 'Специальность успешно добавлена.',
                color: 'green',
                position: 'top-right',
            });
            form.reset();
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось добавить специальность.',
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
                            Добавить специальность
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    );
};

export { SpecializationForm };
