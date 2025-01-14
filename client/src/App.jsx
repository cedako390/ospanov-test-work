import {useEffect, useState} from 'react';
import {Tabs, Grid, Paper, Table, Pagination} from '@mantine/core';
import StudentForm from "./components/forms/StudentForm.jsx";
import {SpecializationForm} from "./components/forms/SpecializationForm.jsx";
import {FacultyForm} from "./components/forms/FacultyForm.jsx";
import axios from "axios";
import {StudentCard} from "./components/cards/StudentCard.jsx";
import styles from './App.module.scss';
import {FacultyCard} from "./components/cards/FacultyCard.jsx";
import {SpecializationCard} from "./components/cards/SpecializationCard.jsx";

const App = () => {
    const [records, setRecords] = useState([]);
    const [currentPages, setCurrentPages] = useState({
        students: 1,
        specializations: 1,
        faculties: 1,
    });

    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('students');

    const fetchRecords = (entity) => {
        const page = currentPages[entity] || 1;
        axios.get(`/${entity}?page=${page}`).then((response) => {
            const {data, meta} = response.data;
            setRecords(data);
            setTotalPages(meta.totalPages);
        });
    };

    const handlePageChange = (page) => {
        setCurrentPages((prev) => ({
            ...prev,
            [activeTab]: page,
        }));
    };

    useEffect(() => {
        fetchRecords(activeTab);
    }, [activeTab, currentPages[activeTab]]);

    return (
        <div className={styles.wrapper}>
            <Paper withBorder shadow="lg" radius="md" p="xl" className={styles.card}>
                <Tabs defaultValue="students" onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="students">Студенты</Tabs.Tab>
                        <Tabs.Tab value="specializations">Специальности</Tabs.Tab>
                        <Tabs.Tab value="faculties">Факультеты</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="students">
                        <div className={styles.grid}>
                            <div className={styles.column}>
                                <StudentForm onSubmit={() => fetchRecords(activeTab)}/>
                            </div>
                            <div className={styles.column}>
                                <div className={styles.scrollable}>
                                    <Table>
                                        {records.map((record, index) => (
                                            <StudentCard
                                                key={index}
                                                student={record}
                                                updateList={() => fetchRecords(activeTab)}
                                            />
                                        ))}
                                    </Table>
                                </div>
                                <div className={styles.paginationWrapper}>
                                    <Pagination
                                        total={totalPages}
                                        page={currentPages[activeTab]}
                                        onChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs.Panel>


                    <Tabs.Panel value="specializations">
                        <div className={styles.grid}>
                            <div className={styles.column}>
                                <SpecializationForm onSubmit={() => fetchRecords(activeTab)} activeTab={activeTab} />
                            </div>
                            <div className={styles.column}>
                                <div className={styles.scrollable}>
                                    <Table>
                                        {records.map((record, index) => (
                                            <SpecializationCard
                                                key={index}
                                                specialization={record}
                                                updateList={() => fetchRecords(activeTab)}
                                            />
                                        ))}
                                    </Table>
                                </div>
                                <div className={styles.paginationWrapper}>
                                    <Pagination
                                        total={totalPages}
                                        page={currentPages[activeTab]}
                                        onChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="faculties">
                        <div className={styles.grid}>
                            <div className={styles.column}>
                                <FacultyForm onSubmit={() => fetchRecords(activeTab)} />
                            </div>
                            <div className={styles.column}>
                                <div className={styles.scrollable}>
                                    <Table>
                                        {records.map((record, index) => (
                                            <FacultyCard
                                                key={index}
                                                faculty={record}
                                                updateList={() => fetchRecords(activeTab)}
                                            />
                                        ))}
                                    </Table>
                                </div>
                                <div className={styles.paginationWrapper}>
                                    <Pagination
                                        total={totalPages}
                                        page={currentPages[activeTab]}
                                        onChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs.Panel>

                </Tabs>
            </Paper>
        </div>
    );
};

export default App;
