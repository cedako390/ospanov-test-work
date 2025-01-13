import { useState } from 'react';
import { Grid, Paper, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const FacultyForm = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value) => (value ? null : 'Введите название факультета'),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('/faculties', values);
            notifications.show({
                title: 'Успех!',
                message: 'Факультет успешно добавлен.',
                color: 'green',
                position: 'top-right',
            });
            form.reset();
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось добавить факультет.',
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
                            label="Название факультета"
                            placeholder="Введите название"
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Button type="submit" fullWidth loading={loading}>
                            Добавить факультет
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    );
};

export { FacultyForm };
