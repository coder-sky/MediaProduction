import { Autocomplete, Box, Button, Checkbox, Collapse, Container, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navbar from '../NavBar/Navbar'
import swal from 'sweetalert';
import Loader from '../Loader';
import LoadingButton from '@mui/lab/LoadingButton';
import Instance from '../../api/apiInstance';


const detailedAccess = {
    'Apps And Urls Access': ['impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views', 'ctr'],
    // Creative:[ 'impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views','completion rate']
}

function CampaignForm() {
    const [inputValue, setInputValue] = useState('');
    const [fields, setFields] = useState({ clientName: null, campaignName: '', startDate: '', endDate: '', campaignType: '', })
    const [bannerCampFields, setBannerCampFields] = useState({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [] })
    const [videoCampFields, setVideoCampFields] = useState({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, plannedVideoViews: 0, plannedCPV: 0, plannedCompleteVideoViews: 0, plannedCPCV: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [], detailedSectionAccess: { 'Apps And Urls Access': [], } })
    const [clientData, setClientData] = useState([])
    const [loader, setLoader] = useState(false)
    const [loadButton, setLoadButton] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setLoader(true)
            try {
                const api = Instance()
                const res = await api.get('/api/clientdetails')
                // console.log(res.data)
                const data = res.data.map(data => ({ id: data.id, clientName: data.client_name }))
                setClientData(data)
                //setFilterdClientData(data)
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
        getData()
    }, [])

    const handleBannerCampFieldsChange = (e) => {
        setBannerCampFields({ ...bannerCampFields, [e.target.name]: e.target.value })
        // let field, cal, ctrPer, total;
        // const val = e.target.value === '' ? 0 : e.target.value
        // if (e.target.name === 'plannedImpressions') {
        //     field = 'plannedBudgetImpressions'
        //     cal = Number(((val * bannerCampFields.plannedCPM) / 1000).toFixed(2))
        //     total = Number((bannerCampFields.plannedBudgetClicks + cal).toFixed(2))

        //     if (bannerCampFields.plannedClicks !== 0 && bannerCampFields.plannedClicks !== '') {
        //         ctrPer = ((bannerCampFields.plannedClicks / val) * 100).toFixed(2)
        //     }
        //     else {
        //         ctrPer = 0
        //     }

        // }
        // if (e.target.name === 'plannedCPM') {
        //     field = 'plannedBudgetImpressions'
        //     cal = Number(((bannerCampFields.plannedImpressions * val) / 1000).toFixed(2))
        //     total = Number((bannerCampFields.plannedBudgetClicks + cal).toFixed(2))
        //     // console.log(field,cal,e.target.value)
        // }
        // if (e.target.name === 'plannedClicks') {
        //     field = 'plannedBudgetClicks'
        //     cal = Number((val * bannerCampFields.plannedCPC).toFixed(2))
        //     total = Number((bannerCampFields.plannedBudgetImpressions + cal).toFixed(2))
        //     if (bannerCampFields.plannedImpressions !== 0 && bannerCampFields.plannedImpressions !== '') {
        //         ctrPer = ((val / bannerCampFields.plannedImpressions) * 100).toFixed(2)
        //     }
        //     else {
        //         ctrPer = 0
        //     }

        // }
        // if (e.target.name === 'plannedCPC') {
        //     field = 'plannedBudgetClicks'
        //     cal = Number((bannerCampFields.plannedClicks * val).toFixed(2))
        //     total = Number((bannerCampFields.plannedBudgetImpressions + cal).toFixed(2))
        // }
        // if (field !== undefined && cal !== undefined) {
        //     if (ctrPer !== undefined && ctrPer !== 'Infinity') {
        //         setBannerCampFields({ ...bannerCampFields, [e.target.name]: e.target.value, [field]: cal, ctr: ctrPer, plannedBudget: total })
        //     }
        //     else {
        //         setBannerCampFields({ ...bannerCampFields, [e.target.name]: e.target.value, [field]: cal, plannedBudget: total })
        //     }

        // }
        // else {
        //     if (ctrPer !== undefined && ctrPer !== 'Infinity') {
        //         setBannerCampFields({ ...bannerCampFields, [e.target.name]: e.target.value, ctr: ctrPer, plannedBudget: total })
        //     }
        //     else {
        //         setBannerCampFields({ ...bannerCampFields, [e.target.name]: e.target.value })
        //     }

        // }

    }
    const handleVideoCampFieldsChange = (e) => {
        // console.log(e.target.name, e.target.value)
        setVideoCampFields({ ...videoCampFields, [e.target.name]: e.target.value })

        // let field, cal, ctrPer, total;
        // const val = e.target.value === '' ? 0 : e.target.value
        // // // console.log(e.target.name, val)
        // if (e.target.name === 'plannedImpressions') {
        //     field = 'plannedBudgetImpressions'
        //     cal = Number(((val * videoCampFields.plannedCPM) / 1000).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetClicks + cal + videoCampFields.plannedBudgetVideoViews + videoCampFields.plannedBudgetCompleteVideoViews).toFixed(2))

        //     if (videoCampFields.plannedClicks !== 0 && videoCampFields.plannedClicks !== '') {
        //         ctrPer = ((videoCampFields.plannedClicks / val) * 100).toFixed(2)
        //     }
        //     else {
        //         ctrPer = 0
        //     }

        // }
        // if (e.target.name === 'plannedCPM') {
        //     field = 'plannedBudgetImpressions'
        //     cal = Number(((videoCampFields.plannedImpressions * val) / 1000).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetClicks + cal + videoCampFields.plannedBudgetVideoViews + videoCampFields.plannedBudgetCompleteVideoViews).toFixed(2))
        //     // console.log(field,cal,e.target.value)
        // }
        // if (e.target.name === 'plannedClicks') {
        //     field = 'plannedBudgetClicks'
        //     cal = Number((val * videoCampFields.plannedCPC).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + cal + videoCampFields.plannedBudgetVideoViews + videoCampFields.plannedBudgetCompleteVideoViews).toFixed(2))
        //     if (videoCampFields.plannedImpressions !== 0 && videoCampFields.plannedImpressions !== '') {
        //         ctrPer = ((val / videoCampFields.plannedImpressions) * 100).toFixed(2)
        //     }
        //     else {
        //         ctrPer = 0
        //     }

        // }
        // if (e.target.name === 'plannedCPC') {
        //     field = 'plannedBudgetClicks'
        //     cal = Number((videoCampFields.plannedClicks * val).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + cal + videoCampFields.plannedBudgetVideoViews + videoCampFields.plannedBudgetCompleteVideoViews).toFixed(2))
        // }
        // if (e.target.name === 'plannedVideoViews') {
        //     field = 'plannedBudgetVideoViews'
        //     cal = Number((videoCampFields.plannedCPV * val).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + videoCampFields.plannedBudgetClicks + videoCampFields.plannedBudgetCompleteVideoViews + cal).toFixed(2))

        // }
        // if (e.target.name === 'plannedCPV') {
        //     field = 'plannedBudgetVideoViews'
        //     cal = Number((val * videoCampFields.plannedVideoViews).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + videoCampFields.plannedBudgetClicks + videoCampFields.plannedBudgetCompleteVideoViews + cal).toFixed(2))
        // }
        // if (e.target.name === 'plannedCompleteVideoViews') {
        //     field = 'plannedBudgetCompleteVideoViews'
        //     cal = Number((videoCampFields.plannedCPCV * val).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + videoCampFields.plannedBudgetClicks + videoCampFields.plannedBudgetVideoViews + cal).toFixed(2))

        // }
        // if (e.target.name === 'plannedCPCV') {
        //     field = 'plannedBudgetCompleteVideoViews'
        //     cal = Number((val * videoCampFields.plannedCompleteVideoViews).toFixed(2))
        //     total = Number((videoCampFields.plannedBudgetImpressions + videoCampFields.plannedBudgetClicks + videoCampFields.plannedBudgetVideoViews + cal).toFixed(2))

        // }
        // // console.log(field, ctrPer, cal, total )
        // // console.log(field !== undefined && cal !== undefined && !isNaN(cal))
        // // console.log(ctrPer !== undefined && ctrPer !== 'Infinity' )
        // if (field !== undefined && cal !== undefined && !isNaN(cal)) {
        //     if (ctrPer !== undefined && ctrPer !== 'Infinity') {
        //         setVideoCampFields({ ...videoCampFields, [e.target.name]: e.target.value, [field]: cal, ctr: ctrPer, plannedBudget: total })
        //     }
        //     else {
        //         setVideoCampFields({ ...videoCampFields, [e.target.name]: e.target.value, [field]: cal, plannedBudget: total })
        //     }

        // }
        // else {
        //     if (ctrPer !== undefined && ctrPer !== 'Infinity' && !isNaN(ctrPer)) {

        //         setVideoCampFields({ ...videoCampFields, [e.target.name]: e.target.value, ctr: ctrPer, plannedBudget: total })
        //     }
        //     else {
        //         setVideoCampFields({ ...videoCampFields, [e.target.name]: e.target.value })
        //     }

        // }

    }
    const handleFieldsChange = (e) => {
        if (e.target.name === 'campaignType') {
            setBannerCampFields({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [], })
            setVideoCampFields({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, plannedVideoViews: 0, plannedCPV: 0, plannedCompleteVideoViews: 0, plannedCPCV: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [], detailedSectionAccess: { 'Apps And Urls Access': [], } })
        }
        setFields({ ...fields, [e.target.name]: e.target.value })
    }
    const handleClear = () => {
        setFields({ clientName: null, campaignName: '', startDate: '', endDate: '', campaignType: '', })
        setBannerCampFields({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [], })
        setVideoCampFields({ plannedImpressions: 0, plannedCPM: 0, plannedClicks: 0, plannedCPC: 0, plannedVideoViews: 0, plannedCPV: 0, plannedCompleteVideoViews: 0, plannedCPCV: 0, ctr: 0, reach: 0, plannedBudget: 0, mainAccess: [], summaryAccess: [], reportAccess: [], detailedSectionAccess: { 'Apps And Urls Access': [], } })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(videoCampFields, fields)
        setLoadButton(true)
        try {
            const api = Instance()
            const sendData = fields.campaignType === 'banner' ? bannerCampFields : videoCampFields
            const res = await api.post('/api/addcampaign', { ...fields, ...sendData })
            // console.log(res.data)
            setLoadButton(false)
            swal({
                title: 'Success',
                text: res.data,
                icon: 'success'
            })
            handleClear()
        }
        catch (err) {
            setLoadButton(false)
            swal({
                title: 'Error Occured!',
                text: err.response.data,
                icon: 'error'
            })
        }

    }
    return (
        <Box sx={{ width: '100%', height: { xs: 'auto', md: '100vh' }, backgroundImage: 'url(12244.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

            <Navbar />
            <Grid container>
                <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 1, xl: 3 } }}>
                    <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                        <Paper sx={{ pl: 2, pr: 2, pb: 1, p: { xl: 3 } }} elevation={20} >
                            <Stack component={'form'} onSubmit={handleSubmit} spacing={{ xs: 1.5, xl: 3 }}>
                                <Typography component={'h1'} variant='p' textAlign={'center'} >Campaign Form</Typography>
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
                                    value={fields.clientName}
                                    onChange={(_, newValue) => {
                                        // console.log(newValue)
                                        setFields({ ...fields, clientName: newValue })
                                    }}
                                />
                                <TextField
                                    label='Enter Campaign Name'
                                    size='small'
                                    type='text'
                                    name='campaignName'
                                    value={fields.campaignName}
                                    onChange={handleFieldsChange}
                                    required

                                />
                                <Stack spacing={2} direction={{ xs: "column", lg: 'row' }} sx={{ width: '100%' }}>

                                    <TextField
                                        label='Start Date'
                                        size='small'
                                        fullWidth
                                        type='date'
                                        name='startDate'
                                        value={fields.startDate}
                                        onChange={handleFieldsChange}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ max: fields.endDate }}
                                        required

                                    />


                                    <TextField
                                        label='End Date'
                                        size='small'
                                        fullWidth
                                        type='date'
                                        name='endDate'
                                        value={fields.endDate}
                                        onChange={handleFieldsChange}
                                        InputLabelProps={{ shrink: true }}

                                        inputProps={{ min: fields.startDate }}
                                        required
                                    />


                                </Stack>
                                <Stack spacing={2} direction={{ xs: "column", lg: 'row' }} sx={{ width: '100%' }}>
                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel size='small' required>Campaign Type</InputLabel>
                                            <Select required name='campaignType' onChange={handleFieldsChange} value={fields.campaignType} size='small' label='Campaign Type'>
                                                <MenuItem value='banner'>Banner</MenuItem>
                                                <MenuItem value='video'>Video</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Collapse in={fields.campaignType === 'banner'} unmountOnExit timeout={'auto'}>
                                            <Stack spacing={2}>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='Planned Impreessions'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedImpressions'
                                                        value={bannerCampFields.plannedImpressions}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />

                                                    <TextField
                                                        label='Planned CPM'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPM'
                                                        value={bannerCampFields.plannedCPM}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />


                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='Planned Clicks'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedClicks'
                                                        value={bannerCampFields.plannedClicks}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                    <TextField
                                                        label='Planned CPC'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPC'
                                                        value={bannerCampFields.plannedCPC}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='CTR in %'
                                                        size='small'
                                                        type='number'
                                                        name='ctr'
                                                        fullWidth
                                                        value={bannerCampFields.ctr}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}

                                                    />
                                                    <TextField
                                                        label='Reach (Achieved)'
                                                        size='small'
                                                        type='number'
                                                        name='reach'
                                                        fullWidth
                                                        value={bannerCampFields.reach}
                                                        onChange={handleBannerCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}

                                                    />
                                                </Stack>
                                                <TextField
                                                    label='Planned Budget'
                                                    size='small'
                                                    type='number'
                                                    fullWidth
                                                    name='plannedBudget'
                                                    value={bannerCampFields.plannedBudget}
                                                    onChange={handleBannerCampFieldsChange}

                                                />
                                            </Stack>
                                        </Collapse>
                                        <Collapse in={fields.campaignType === 'video'} unmountOnExit timeout={'auto'}>
                                            <Stack spacing={2}>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>


                                                    <TextField
                                                        label='Planned Impreessions'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedImpressions'
                                                        value={videoCampFields.plannedImpressions}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                    <TextField
                                                        label='Planned CPM'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPM'
                                                        value={videoCampFields.plannedCPM}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='Planned Clicks'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedClicks'
                                                        value={videoCampFields.plannedClicks}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                    <TextField
                                                        label='Planned CPC'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPC'
                                                        value={videoCampFields.plannedCPC}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='Planned Views'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedVideoViews'
                                                        value={videoCampFields.plannedVideoViews}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                    <TextField
                                                        label='Planned CPV'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPV'
                                                        value={videoCampFields.plannedCPV}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='Planned Complete Views'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCompleteVideoViews'
                                                        value={videoCampFields.plannedCompleteVideoViews}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                    <TextField
                                                        label='Planned CPVC'
                                                        size='small'
                                                        fullWidth
                                                        type='number'
                                                        name='plannedCPCV'
                                                        value={videoCampFields.plannedCPCV}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Stack>
                                                <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                    <TextField
                                                        label='CTR in %'
                                                        size='small'
                                                        type='number'
                                                        name='ctr'
                                                        fullWidth
                                                        value={videoCampFields.ctr}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}

                                                    />
                                                    <TextField
                                                        label='Reach (Achieved)'
                                                        size='small'
                                                        type='number'
                                                        name='reach'
                                                        fullWidth
                                                        value={videoCampFields.reach}
                                                        onChange={handleVideoCampFieldsChange}
                                                        inputProps={{ min: 0, step: 0.01 }}

                                                    />
                                                </Stack>
                                                <TextField

                                                    label='Planned Budget'
                                                    size='small'
                                                    type='number'
                                                    fullWidth
                                                    name='plannedBudget'
                                                    value={videoCampFields.plannedBudget}
                                                    onChange={handleVideoCampFieldsChange}

                                                />
                                            </Stack>
                                        </Collapse>

                                    </Stack>
                                    <Stack spacing={1.5} sx={{ width: '100%' }}>
                                        <Box>
                                            <Collapse in={fields.campaignType !== ''} unmountOnExit timeout={'auto'}>
                                                <fieldset >
                                                    <legend style={{ textAlign: 'center' }}>Client Dashboard Access</legend>

                                                    <FormControl component="fieldset" variant="standard" fullWidth >
                                                        <FormLabel component="legend"  >Main Access:</FormLabel>
                                                        <FormGroup row onChange={e => {
                                                            // console.log(e.target.value)
                                                            const val = e.target.value
                                                            let newBasedValues;

                                                            if (fields.campaignType === 'banner') {
                                                                let summaryAccess = bannerCampFields.summaryAccess, reportAccess = bannerCampFields.reportAccess
                                                                if (val === 'table view' && bannerCampFields.mainAccess.includes(val) && bannerCampFields.mainAccess.includes('graph view')) {
                                                                    summaryAccess = []
                                                                }
                                                                else if (val === 'table view' && bannerCampFields.mainAccess.includes(val) && !bannerCampFields.mainAccess.includes('graph view')) {
                                                                    summaryAccess = []
                                                                    reportAccess = []
                                                                }
                                                                else if (val === 'graph view' && bannerCampFields.mainAccess.includes(val) && !bannerCampFields.mainAccess.includes('table view')) {
                                                                    reportAccess = []
                                                                }

                                                                if (bannerCampFields.mainAccess.includes(val)) {
                                                                    newBasedValues = bannerCampFields.mainAccess.filter(acc => acc !== val)
                                                                }
                                                                else {
                                                                    newBasedValues = [...bannerCampFields.mainAccess, val]
                                                                }
                                                                setBannerCampFields({ ...bannerCampFields, mainAccess: newBasedValues, summaryAccess, reportAccess })

                                                            }
                                                            else {
                                                                let summaryAccess = videoCampFields.summaryAccess, reportAccess = videoCampFields.reportAccess, apps_and_urls_access = videoCampFields.detailedSectionAccess['Apps And Urls Access'];
                                                                if (val === 'table view' && videoCampFields.mainAccess.includes(val) && videoCampFields.mainAccess.includes('graph view')) {
                                                                    summaryAccess = []
                                                                }
                                                                else if (val === 'table view' && videoCampFields.mainAccess.includes(val) && !videoCampFields.mainAccess.includes('graph view')) {
                                                                    summaryAccess = []
                                                                    reportAccess = []
                                                                }
                                                                else if (val === 'graph view' && videoCampFields.mainAccess.includes(val) && !videoCampFields.mainAccess.includes('table view')) {
                                                                    reportAccess = []
                                                                }
                                                                else if (val === 'detailed view' && videoCampFields.mainAccess.includes(val)) {
                                                                    apps_and_urls_access = []
                                                                }
                                                                if (videoCampFields.mainAccess.includes(val)) {
                                                                    newBasedValues = videoCampFields.mainAccess.filter(acc => acc !== val)
                                                                }
                                                                else {
                                                                    newBasedValues = [...videoCampFields.mainAccess, val]
                                                                }
                                                                setVideoCampFields({ ...videoCampFields, mainAccess: newBasedValues, summaryAccess, reportAccess, detailedSectionAccess: { "Apps And Urls Access": apps_and_urls_access } })
                                                            }

                                                        }}>

                                                            {
                                                                ['table view', 'graph view', 'detailed view',].map(acc =>

                                                                    <FormControlLabel
                                                                        key={acc}
                                                                        value={acc}
                                                                        control={<Checkbox size='small' checked={fields.campaignType === 'banner' ? bannerCampFields.mainAccess.includes(acc) : videoCampFields.mainAccess.includes(acc)} />}
                                                                        label={<Typography sx={{ fontSize: '15px' }}>{acc.toUpperCase()}</Typography>}


                                                                        labelPlacement="end"
                                                                    />
                                                                )}

                                                        </FormGroup>
                                                    </FormControl>

                                                    <Collapse in={bannerCampFields.mainAccess.includes('table view') || videoCampFields.mainAccess.includes('table view')} unmountOnExit timeout={1000} >
                                                        <FormControl component="fieldset" variant="standard" fullWidth >
                                                            <FormLabel component="legend"  >Summary Access:</FormLabel>
                                                            <FormGroup row onChange={e => {
                                                                // console.log(e.target.value)
                                                                const val = e.target.value
                                                                let newBasedValues;
                                                                if (fields.campaignType === 'banner') {
                                                                    if (bannerCampFields.summaryAccess.includes(val)) {
                                                                        newBasedValues = bannerCampFields.summaryAccess.filter(acc => acc !== val)
                                                                    }
                                                                    else {
                                                                        newBasedValues = [...bannerCampFields.summaryAccess, val]
                                                                    }
                                                                    setBannerCampFields({ ...bannerCampFields, summaryAccess: newBasedValues })

                                                                }
                                                                else {
                                                                    if (videoCampFields.summaryAccess.includes(val)) {
                                                                        newBasedValues = videoCampFields.summaryAccess.filter(acc => acc !== val)
                                                                    }
                                                                    else {
                                                                        newBasedValues = [...videoCampFields.summaryAccess, val]
                                                                    }
                                                                    setVideoCampFields({ ...videoCampFields, summaryAccess: newBasedValues })
                                                                }

                                                            }}>
                                                                <Collapse in={fields.campaignType === 'banner' && bannerCampFields.mainAccess.includes('table view')} dir='horizontal' unmountOnExit timeout={1000} >
                                                                    {
                                                                        ['impressions', 'clicks', 'cpm', 'cpc', 'reach', 'cost', 'ctr'].map(acc =>

                                                                            <FormControlLabel
                                                                                key={acc}
                                                                                value={acc}
                                                                                control={<Checkbox size='small' checked={bannerCampFields.summaryAccess.includes(acc)} />}
                                                                                label={acc.toLocaleUpperCase()}

                                                                                labelPlacement="end"
                                                                            />
                                                                        )}
                                                                </Collapse>
                                                                <Collapse in={fields.campaignType === 'video' && videoCampFields.mainAccess.includes('table view')} dir='horizontal' unmountOnExit timeout={1000} >
                                                                    {
                                                                        ['impressions', 'clicks', 'video views', 'complete video views', 'cpm', 'cpc', 'cpv', 'cpcv', 'reach', 'cost', 'ctr'].map(acc =>

                                                                            <FormControlLabel
                                                                                key={acc}
                                                                                value={acc}
                                                                                control={<Checkbox size='small' checked={videoCampFields.summaryAccess.includes(acc)} />}
                                                                                label={acc.toLocaleUpperCase()}

                                                                                labelPlacement="end"
                                                                            />
                                                                        )}
                                                                </Collapse>
                                                            </FormGroup>
                                                        </FormControl>
                                                    </Collapse>

                                                    <Collapse in={bannerCampFields.mainAccess.includes('table view') || videoCampFields.mainAccess.includes('table view') || bannerCampFields.mainAccess.includes('graph view') || videoCampFields.mainAccess.includes('graph view')} unmountOnExit timeout={1000} >
                                                        <FormControl component="fieldset" variant="standard" fullWidth >
                                                            <FormLabel component="legend"  >{'Report Access:'}</FormLabel>
                                                            <FormGroup row onChange={e => {
                                                                // console.log(e.target.value)
                                                                const val = e.target.value
                                                                let newBasedValues;
                                                                if (fields.campaignType === 'banner') {
                                                                    if (bannerCampFields.reportAccess.includes(val)) {
                                                                        newBasedValues = bannerCampFields.reportAccess.filter(acc => acc !== val)
                                                                    }
                                                                    else {
                                                                        newBasedValues = [...bannerCampFields.reportAccess, val]
                                                                    }
                                                                    setBannerCampFields({ ...bannerCampFields, reportAccess: newBasedValues })

                                                                }
                                                                else {
                                                                    if (videoCampFields.reportAccess.includes(val)) {
                                                                        newBasedValues = videoCampFields.reportAccess.filter(acc => acc !== val)
                                                                    }
                                                                    else {
                                                                        newBasedValues = [...videoCampFields.reportAccess, val]
                                                                    }
                                                                    setVideoCampFields({ ...videoCampFields, reportAccess: newBasedValues })
                                                                }

                                                            }}>
                                                                <Collapse in={fields.campaignType === 'banner' && (bannerCampFields.mainAccess.includes('table view') || bannerCampFields.mainAccess.includes('graph view'))} dir='horizontal' unmountOnExit timeout={1000} >
                                                                    {
                                                                        ['impressions', 'clicks', 'cpm', 'cpc', 'reach', 'cost', 'ctr'].map(acc =>

                                                                            <FormControlLabel
                                                                                key={acc}
                                                                                value={acc}
                                                                                control={<Checkbox size='small' checked={bannerCampFields.reportAccess.includes(acc)} />}
                                                                                label={acc.toLocaleUpperCase()}

                                                                                labelPlacement="end"
                                                                            />
                                                                        )}
                                                                </Collapse>
                                                                <Collapse in={fields.campaignType === 'video' && (videoCampFields.mainAccess.includes('table view') || videoCampFields.mainAccess.includes('graph view'))} dir='horizontal' unmountOnExit timeout={1000} >
                                                                    {
                                                                        ['impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views', 'cpm', 'cpc', 'cpv', 'cpcv', 'reach', 'cost', 'ctr'].map(acc =>

                                                                            <FormControlLabel
                                                                                key={acc}
                                                                                value={acc}
                                                                                control={<Checkbox size='small' checked={videoCampFields.reportAccess.includes(acc)} />}
                                                                                label={acc.toLocaleUpperCase()}

                                                                                labelPlacement="end"
                                                                            />
                                                                        )}
                                                                </Collapse>
                                                            </FormGroup>
                                                        </FormControl>
                                                    </Collapse>





                                                    <Collapse in={fields.campaignType === 'video' && videoCampFields.mainAccess.includes('detailed view')} dir='horizontal' unmountOnExit timeout={1000} >
                                                        <Divider>Detailed view Access</Divider>
                                                        {
                                                            Object.keys(videoCampFields.detailedSectionAccess).map(category => (
                                                                <FormControl key={category} component="fieldset" variant="standard" fullWidth >
                                                                    <FormLabel component="legend"  >{category}:</FormLabel>
                                                                    <FormGroup row onChange={e => {
                                                                        // console.log(e.target.value)
                                                                        const val = e.target.value
                                                                        let newBasedValues;
                                                                        // if (fields.campaignType === 'banner') {
                                                                        //     if (bannerCampFields.reportAccess.includes(val)) {
                                                                        //         newBasedValues = bannerCampFields.reportAccess.filter(acc => acc !== val)
                                                                        //     }
                                                                        //     else {
                                                                        //         newBasedValues = [...bannerCampFields.reportAccess, val]
                                                                        //     }
                                                                        //     setBannerCampFields({ ...bannerCampFields, reportAccess: newBasedValues })

                                                                        // }
                                                                        // else {
                                                                        if (videoCampFields.detailedSectionAccess[category].includes(val)) {
                                                                            newBasedValues = videoCampFields.detailedSectionAccess[category].filter(acc => acc !== val)
                                                                        }
                                                                        else {
                                                                            newBasedValues = [...videoCampFields.detailedSectionAccess[category], val]
                                                                        }
                                                                        setVideoCampFields({ ...videoCampFields, detailedSectionAccess: { ...videoCampFields.detailedSectionAccess, [category]: newBasedValues } })
                                                                        // }

                                                                    }}>
                                                                        {
                                                                            detailedAccess[category].map(acc =>
                                                                                <FormControlLabel
                                                                                    key={acc}
                                                                                    value={acc}
                                                                                    control={<Checkbox size='small' checked={videoCampFields.detailedSectionAccess[category].includes(acc)} />}
                                                                                    label={acc.toLocaleUpperCase()}

                                                                                    labelPlacement="end"
                                                                                />
                                                                            )
                                                                        }

                                                                    </FormGroup>
                                                                </FormControl>
                                                            ))
                                                        }
                                                    </Collapse>

                                                </fieldset>
                                            </Collapse>

                                        </Box>

                                    </Stack>
                                </Stack>
                                <Stack spacing={4} direction={'row'} display={'flex'} justifyContent={'center'}>
                                    <LoadingButton loading={loadButton} variant='contained' color='success' type='submit'>Submit</LoadingButton>
                                    <Button variant='contained' color='error' type='clear' onClick={handleClear} > Clear</Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Grid>
                </Container>
            </Grid>
            <Loader loader={loader} />
        </Box>
    )
}

export default CampaignForm