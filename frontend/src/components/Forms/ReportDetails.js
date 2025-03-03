import { Autocomplete, Box, Button, Card, CardContent, Collapse, Container,  Grid, Stack, Tab, Tabs, TextField, Typography, keyframes, } from '@mui/material'
import React, { useEffect, useMemo,  useState } from 'react'
import Navbar from '../NavBar/Navbar'

import swal from 'sweetalert';

import Loader from '../Loader';

import { useNavigate } from 'react-router-dom';
import Instance from '../../api/apiInstance';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Circle } from '@mui/icons-material';



const spin = keyframes`
  0%{
  opacity: 1;
  }
  50%{
  opacity: 0;
  }
  100%{
  opacity: 1;
  }
`;


function ReportDetails() {

    const [wholeReport, setWholeReport] = useState({})

    const [loader, setLoader] = useState(false)

    const [searchFields, setSearchFields] = useState({ clientName: null, campaignName: null, fromDate: '', toDate: '' })

    const [inputValue, setInputValue] = useState('');
    const [inputValueCampaign, setInputValueCampaign] = useState('');
    const [clientData, setClientData] = useState([])
    const [campaigns, setCampaigns] = useState([])
    const [campaignInfo, setCampaignInfo] = useState({ name: '', status: '', planned: [] })
    const [value, setValue] = React.useState(0);
    const [data, setData] = useState([])
    const [tableHeaders, setTableHeaders] = useState([])

    const reportType = {
        0: 'daily_report',
        1: 'apps_and_urls_report',
        2: 'gender_report',
        3: 'age_report',
        4: 'device_report',
        5: 'creative_report',
        6: 'city_report',
        7: 'isp_or_carrier_report'
    }

    const handleChange = (_, newValue) => {
        setData(wholeReport[reportType[newValue]]['data'])
        setTableHeaders(wholeReport[reportType[newValue]]['columns'])
        setValue(newValue);
    };
    const navigate = useNavigate()





    useEffect(() => {
        const getData = async () => {
            setLoader(true)
            try {
                // console.log(update)
                const api = Instance()
                const res = await api.get('/api/reports')
                // console.log(res.data)
                setWholeReport(res.data)
                setData(res.data[reportType[value]]['data'])
                setTableHeaders(res.data[reportType[value]]['columns'])

                const result = await api.get('/api/clientdetails')
                // console.log(res.data)
                const dataCli = result.data.map(data => ({ id: data.id, clientName: data.client_name }))
                dataCli.unshift({ id: 1, clientName: 'All' })
                setClientData(dataCli)

                setLoader(false)
            }
            catch (err) {
                // console.log(err)
                setLoader(false)
                swal({
                    title: 'Error Occured!',
                    text: err.response.data,
                    icon: 'error'
                })
            }
        }
        getData()
    }, [])

    const columns = useMemo(
        () => {
            const headers = tableHeaders.map((key) => ({ accessorKey: key, header: key.split('_').join(' ').toUpperCase(), id: key, Cell:({ cell }) => {
                   
                if(cell.column.id==='date'){
                    return new Date(cell.getValue()).toLocaleDateString('en-GB')
                }
                else{
                    return cell.getValue()?.toLocaleString?.()
                }
                
             } ,}))
            // console.log(headers)
            return headers
        }
        , [tableHeaders]
    )

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        initialState: { pagination: { pageSize: 100, } },
        state: {
            columnOrder: [],
        },


        muiPaginationProps: {
            rowsPerPageOptions: [100, 200, 300, 400, 500],

        },
        enableStickyHeader: true,
        positionActionsColumn: 'last',
       

        mrtTheme: (theme) => ({
            baseBackgroundColor: theme.palette.background.default, //change default background color
        }),
        muiTableContainerProps: {
            sx: {
                maxHeight: "340px"
            }
        },
        muiTableHeadRowProps: {
            sx: {
                bgcolor: '#00a4cc',


            }
        },

        muiTableBodyProps: {
            sx: {

                '& tr:nth-of-type(even) > td': {
                    backgroundColor: '#ECF5FF',

                },
            },
        },
        muiTableBodyRowProps: { hover: false },


        muiTableHeadCellProps: {
            sx: {

                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },



    })



    const handleNavigate = (e) => {
        const val = e.value
        // console.log('/client-dashboard/' + val.client_name + '/' + val.camp_id)
        const path = '/client-dashboard/' + val.client_name + '/' + val.camp_id
        navigate(path)


    }


    const handleClientSelection = async (_, newValue) => {
        // console.log(newValue)

        if (newValue) {
            const { id, clientName } = newValue
            if (id === 1 && clientName === 'All') {
                setSearchFields({ ...searchFields, clientName: newValue, campaignName: { campId: 0, campaignName: 'All' } })
                setCampaigns([])

            } else {
                try {
                    setLoader(true)
                    const api = Instance()
                    const res = await api.get('/api/campaigns/' + id)
                    // console.log(res.data)
                    //setCampaignData(res.data)
                    const data = res.data.map(data => ({ campaignName: data.campaign_name, campId: data.camp_id }))
                    data.unshift({ campId: 0, campaignName: 'All' })
                    setCampaigns(data)
                    //setFields({client_name:newValue,campaign_name: null, state: null, city: null,start_date:'', end_date:'', camp_based_on:[], date: '', impressions:0, cpm:0, clicks:0, cpc:0, sessions:0, cps:0, ctr:0, total_cpm:0, total_cpc:0, total_cps:0,})
                    setLoader(false)
                    setSearchFields({ ...searchFields, clientName: newValue, campaignName: null })
                }
                catch (err) {
                    setLoader(false)
                    swal({
                        title: 'Error Occured!',
                        text: err.response.data,
                        icon: 'error'
                    })
                }

            }


        }
        else {
            setSearchFields({ ...searchFields, clientName: newValue, campaignName: null })
            //setCampaigns([])
        }



    }

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            setLoader(true)
            const api = Instance()
            const res = await api.get(`/api/searchreports/`, { params: searchFields })
            setWholeReport(res.data)
            setData(res.data[reportType[value]]['data'])
            setTableHeaders(res.data[reportType[value]]['columns'])
           
            setLoader(false)
        }
        catch (err) {
            setLoader(false)
            swal({
                title: 'Error Occured!',
                text: err.response.data,
                icon: 'error'
            })

        }
    }

    return (
        <Box sx={{ width: '100%', height: '100vh', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Navbar />
            <Grid container>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Container sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>

                                    <Typography component={'h1'} variant='p' m={1} textAlign={'center'} >Report Details</Typography>

                                    <Stack component={'form'} onSubmit={handleSearch} spacing={2}>
                                        <fieldset>
                                            <legend><Typography variant='p' component={'h5'}>Search Perticular Campaign/Client</Typography></legend>
                                            <Stack direction={{ xs: 'column', lg: 'row' }} p={1} spacing={2}>
                                                <Autocomplete
                                                    disablePortal
                                                    options={clientData}
                                                    fullWidth
                                                    size='small'
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    getOptionLabel={(option) => option.clientName || ""}
                                                    renderInput={(params) => <TextField required size='small' {...params} label='Select Client Name' />}
                                                    inputValue={inputValue}
                                                    onInputChange={(_, newInputValue) => {
                                                        setInputValue(newInputValue);
                                                    }}
                                                    value={searchFields.clientName}
                                                    onChange={handleClientSelection}
                                                />
                                                <Autocomplete
                                                    disablePortal
                                                    options={campaigns}
                                                    fullWidth
                                                    size='small'
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    getOptionLabel={(option) => option.campaignName || ""}
                                                    renderInput={(params) => <TextField required size='small' {...params} label='Select Campaign Name' />}
                                                    inputValue={inputValueCampaign}
                                                    onInputChange={(_, newInputValue) => {
                                                        setInputValueCampaign(newInputValue);
                                                    }}
                                                    value={searchFields.campaignName}
                                                    onChange={(_, newValue) => setSearchFields({ ...searchFields, campaignName: newValue })}
                                                />
                                                <TextField
                                                    label='From Date'
                                                    size='small'
                                                    fullWidth
                                                    type='date'
                                                    name='fromDate'
                                                    value={searchFields.fromDate}
                                                    onChange={(e) => setSearchFields({ ...searchFields, fromDate: e.target.value })}
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{ max: searchFields.toDate }}
                                                    required={searchFields.toDate !== '' || searchFields.fromDate !== ''}
                                                />


                                                <TextField
                                                    label='To Date'
                                                    size='small'
                                                    fullWidth
                                                    type='date'
                                                    name='toDate'
                                                    value={searchFields.toDate}
                                                    onChange={(e) => setSearchFields({ ...searchFields, toDate: e.target.value })}
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{ min: searchFields.fromDate }}
                                                    required={searchFields.toDate !== '' || searchFields.fromDate !== ''}


                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Button type='submit' size='small' color='success' variant='contained' >Search</Button>
                                                </Box>


                                            </Stack>
                                        </fieldset>
                                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                        </Stack>

                                    </Stack>
                                </Container>



                            </Grid>
                            <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', }}>

                                <Grid item xs={12} sm={12} md={12} lg={6} xl={8}>
                                    <Collapse in={campaignInfo.planned.length !== 0} unmountOnExit timeout={800}>
                                        <Card>
                                            <CardContent>
                                                <Typography component={'h3'} variant='p' textAlign={'center'}>{campaignInfo.name} <Box component="span" sx={{ color: campaignInfo.status === 'Running' ? 'green' : campaignInfo.status === 'Closed' ? 'red' : 'orange', fontSize: 'small', animation: `${spin} 1s linear infinite` }} >{campaignInfo.status !== '' ? <Circle fontSize='8px' /> : null}{campaignInfo.status}</Box></Typography>
                                                <table style={{ width: "100%", fontSize: '12px', borderCollapse: 'collapse' }}>
                                                    <tbody>
                                                        {
                                                            campaignInfo['planned'].map((info, index) => (
                                                                <tr key={index}>
                                                                    {
                                                                        Object.keys(info).map((data, index) => (
                                                                            <td style={{ borderBottom: '1px solid gray', padding: '8px' }} key={`${index} ${info}`}>{data}: {info[data]}</td>

                                                                        ))
                                                                    }
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>

                                                </table>
                                            </CardContent>
                                        </Card>
                                    </Collapse>
                                </Grid>
                            </Container>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons={false}

                            >
                                <Tab label="Daily Report" />
                                <Tab label="Apps & URLs Report" />
                                <Tab label="Gender Report" />
                                <Tab label="Age Report" />
                                <Tab label="Device Report" />
                                <Tab label="Creative Report" />
                                <Tab label="City Report" />
                                <Tab label="ISP or Carrier Report" />
                            </Tabs>
                        </Box>
                        <Box>

                            <MaterialReactTable table={table} />

                        </Box>

                        
                    </Grid>

                </Box>

            </Grid>
         
            <Loader loader={loader} />
        </Box>
    )
}

export default ReportDetails