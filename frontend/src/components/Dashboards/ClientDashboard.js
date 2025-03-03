import { Analytics, Logout, Preview, TableChart } from '@mui/icons-material';
import { AppBar, Button, Container, Grid, Toolbar, Typography, Box, Stack, TextField, Autocomplete, styled, Tab, Tabs, } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
// import { TypeAnimation } from 'react-type-animation';
import swal from 'sweetalert';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import UserContext from '../Context/UserContext';
import { LinearGradient } from 'react-text-gradients'
import { motion } from "framer-motion"
import Loader from '../Loader';
import Instance from '../../api/apiInstance';
import TableView from './TableView';
import GraphView from './GraphView';
import DetailedView from './DetailedView';

const AntTabs = styled(Tabs)({

    borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
        backgroundColor: '#00a4cc',
    },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
        minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        color: '#00a4cc',
        opacity: 1,
    },
    '&.Mui-selected': {
        color: '#00a4cc',
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: '#d1eaff',
    },
}));

const accessType={
    'table view' : 'Table View',
    'graph view' : 'Graph view',
    'detailed view' : 'Detailed View'
}
const accessIcon ={
    'table view' : <TableChart />,
    'graph view' : <Analytics />,
    'detailed view' : <Preview />
}

function ClientDashboard() {
    const [campaigns, setCampaigns] = useState([])
    const [searchFields, setSearchFields] = useState({ campaign_name: null, from_date: '', to_date: '' })
    const [inputValue, setInputValue] = useState('');
    const [selectedCamp, setSelectedCamp] = useState('')
    const [loader, setLoader] = useState(false)
    const [value, setValue] = React.useState(0);
    const [tableViewData, setTableViewData] = useState({ insights: [], tableData: [] })
    const [detailedViewData, setDetailedViewData] = useState({})
    const [mainAccess, setMainAccess] = useState([])


    const navigate = useNavigate()
    const { userDetails } = useContext(UserContext)
    const handleChange = (_, newValue) => {
        //console.log(newValue)
        setValue(newValue);
    };


    useEffect(() => {
        const getData = async () => {
            try {
                setLoader(true)
                const api = Instance()
                const res = await api.get('/api/clientdashboard', { params: { client_id: userDetails.id } })
                // console.log(res.data)
                setMainAccess(res.data.mainAccess)
                setValue(res.data.mainAccess[0])
                setTableViewData(res.data.tableView)
                setDetailedViewData(res.data.detailedView)
                setCampaigns(res.data.campaigns)
                setSearchFields({ campaign_name: res.data.selectedCamp, from_date: '', to_date: '' })
                res.data.selectedCamp && setSelectedCamp(res.data.selectedCamp.campaign_name)
                setLoader(false)
            }
            catch (err) {
                swal({
                    title: "Error Occured!",
                    text: err.response.data,
                    icon: 'error'
                })
                setLoader(false)
            }
        }
        if (userDetails.id) {
            getData()
        }
        // console.log('came',userDetails)

    }, [userDetails])

    if (Cookies.get('ssid') === undefined) {
        return <Navigate to="/login" replace={true} />;
    }



    const handleLogout = () => {
        Cookies.remove('ssid')
        navigate('/login')
    }


    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            const api = Instance()
            const res = await api.get('/api/searchcampaign', { params: searchFields })
            // console.log(res.data)
            setTableViewData(res.data.tableView)
            setDetailedViewData(res.data.detailedView)
        }
        catch (err) {
            swal({
                title: "Error Occured!",
                text: err.response.data,
                icon: 'error'
            })
        }

    }


    const handleCampaignChange = async (_, newValue) => {
        if (newValue) {
            try {
                setLoader(true)
                const api = Instance()
                
                const res = await api.get('/api/campaigninfo', { params: { client_id: userDetails.id, campaign: newValue } })
                // console.log(res.data)
                setValue(res.data.mainAccess[0])
                setMainAccess(res.data.mainAccess)
                
                setTableViewData(res.data.tableView)
                setDetailedViewData(res.data.detailedView)
                setSelectedCamp(newValue.campaign_name)

                setLoader(false)
            }
            catch (err) {
                swal({
                    title: "Error Occured!",
                    text: err.response.data,
                    icon: 'error'
                })
                setLoader(false)
            }
        }
        setSearchFields({ ...searchFields, campaign_name: newValue });

    }


    return (
        <Box sx={{ width: '100%', height: '100%', }}>
            <AppBar position='static' sx={{ backgroundColor: 'white' }} >{/* sx={{backgroundColor:'white'}}*/}
                <Container maxWidth="100%">
                    <Toolbar disableGutters  >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%',alignItems:'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', height: '60px', }}>
                                <img src='companyLogo.png' alt='companyLogo' style={{ width: '80%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                            {userDetails.company_logo !== '' && <Box sx={{ display: 'flex', justifyContent: 'flex-start', height: '70px', }}>
                                <img src={process.env.REACT_APP_BACKEND_SERVER+userDetails.company_logo} alt='companyLogo' style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                            </Box>}
                            <Box >
                                <Button

                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{ my: 2, color: 'black', }}
                                >
                                    Logout
                                </Button>

                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', p: 1 }}>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} lg={7.5}>
                        <Box sx={{ height: '100px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>

                            {/* <Typography variant='h3' fontFamily={'"Times New Roman", Times, serif;'} >
                                {userDetails.client_name !== '' && <TypeAnimation
                                    sequence={[
                                        'Welcome, ' + userDetails.client_name,
                                        5000, // Waits 1s
                                        '',
                                    ]}

                                    cursor={true}
                                    repeat={Infinity}

                                />}
                            </Typography> */}
                        </Box>

                    </Grid>

                    <Grid item xs={12} sm={12} lg={4.5}  >

                        <Box sx={{ bgcolor: '#fff', width: '100%' }}>
                            <AntTabs centered value={value}   onChange={handleChange} >
                                {
                                    mainAccess.map(acc=> <AntTab key={acc} value={acc}  icon={accessIcon[acc]} iconPosition="start" label={accessType[acc]} />)
                                }
                                {/* <AntTab  icon={<TableChart />} iconPosition="start" label="Table View" />
                                <AntTab icon={<Analytics />} iconPosition="start" label="Graph View" />
                                <AntTab icon={<Preview />} iconPosition="start" label="Detailed View" /> */}
                            </AntTabs>

                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={12} lg={8} xl={8}>
                        <Stack component={'form'} onSubmit={handleSearch} spacing={2} direction={{ xs: 'column', lg: 'row' }}>

                            <Autocomplete
                                disablePortal
                                options={campaigns}
                                fullWidth
                                size='small'
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                getOptionLabel={(option) => option.campaign_name || ""}
                                renderInput={(params) => <TextField required size='small' {...params} label='Select Campaign Name' />}
                                inputValue={inputValue}
                                onInputChange={(_, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                value={searchFields.campaign_name}
                                onChange={handleCampaignChange}
                            />
                            <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }}>
                                <TextField
                                    label='From Date'
                                    size='small'
                                    fullWidth
                                    type='date'
                                    name='fromDate'
                                    value={searchFields.from_date}
                                    onChange={(e) => setSearchFields({ ...searchFields, from_date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: searchFields.campaign_name ? new Date(searchFields['campaign_name']['start_date']).toLocaleString('en-CA').slice(0, 10) : '', max: searchFields.campaign_name ? new Date(searchFields['campaign_name']['end_date']).toLocaleString('en-CA').slice(0, 10) : '' }}
                                    required

                                />


                                <TextField
                                    label='To Date'
                                    size='small'
                                    fullWidth
                                    type='date'
                                    name='toDate'
                                    value={searchFields.to_date}
                                    onChange={(e) => setSearchFields({ ...searchFields, to_date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: searchFields.campaign_name ? new Date(searchFields['campaign_name']['start_date']).toLocaleString('en-CA').slice(0, 10) : '', max: searchFields.campaign_name ? new Date(searchFields['campaign_name']['end_date']).toLocaleString('en-CA').slice(0, 10) : '' }}
                                    required


                                />
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button variant='outlined' color='warning' type='submit'>Search</Button>
                                </Box>
                            </Stack>
                        </Stack>

                    </Grid>

                    <Grid item xs={12} sm={12} lg={12} xl={12}>

                        <motion.div

                            initial={{
                                opacity: 0,
                                // if odd index card,slide from right instead of left
                                x: -50
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0, // Slide in to its original position
                                transition: {
                                    duration: 1 // Animation duration
                                }
                            }}
                            viewport={{ once: true }}
                        >

                            <Typography textAlign={'center'} component={'h2'} variant='p'><LinearGradient gradient={['to bottom', '#534E57,#63AECB']}>
                                {selectedCamp}
                            </LinearGradient>
                            </Typography>
                        </motion.div>

                    </Grid>
                    {mainAccess.length!==0&&<Grid item xs={12} md={12}>
                        {
                            (value === 'table view' && <TableView viewData={tableViewData} />) ||
                            (value === 'graph view' && <GraphView viewData={tableViewData} />) ||
                            (value === 'detailed view' && <DetailedView viewData={detailedViewData} />)

                        }
                    </Grid>}
                    {
                    (mainAccess.length===0 && !loader) &&
                    <Box sx={{width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center'   }}>
                        <img src='securityLock.gif' style={{maxWidth:'600px', height:'400px'}} alt='no permissions' />

                         </Box>

                }
                    
                </Grid>
                

            </Box>
            <Loader loader={loader} />
        </Box>
    )
}

export default ClientDashboard