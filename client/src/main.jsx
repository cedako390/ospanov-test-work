import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import '@mantine/core/styles.css';
import {createTheme, MantineProvider} from '@mantine/core';
import axios from "axios";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';

axios.defaults.baseURL = 'http://localhost:8787'
const theme = createTheme({
    fontFamily: 'Inter, sans-serif',
});
createRoot(document.getElementById('root')).render(
    <MantineProvider theme={theme}>
        <Notifications/>
        <App/>
    </MantineProvider>,
)
