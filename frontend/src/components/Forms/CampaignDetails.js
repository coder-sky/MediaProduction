import { Box, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, ListItemIcon, MenuItem, NativeSelect, Slide, Stack, TextField, Typography, } from '@mui/material'
import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import Navbar from '../NavBar/Navbar'

import swal from 'sweetalert';
import { Delete, Edit, } from '@mui/icons-material';
import Loader from '../Loader';
import LoadingButton from '@mui/lab/LoadingButton';
import Instance from '../../api/apiInstance';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function CampaignDetails() {
    const [data, setData] = useState([])
    const [tableHeaders, setTableHeaders] = useState([])
    const [campType, setCampType] = useState('banner')
    const [loader, setLoader] = useState(false)
    const [update, setUpdate] = useState(0)
    const [editFields, setEditFields] = useState({ camp_id: '', client_name: '', campaign_name: '', start_date: '', end_date: '', camp_type: '', planned_impressions: 0, planned_cpm: 0, planned_clicks: 0, planned_cpc: 0, planned_video_views: 0, planned_cpv: 0, planned_complete_video_views: 0, planned_cpcv: 0, ctr: 0, reach: 0, planned_budget: 0, main_access: [], summary_access: [], report_access: [], detailedSectionAccess: { 'Apps And Urls Access': [] }, client_id: '' })
    const [prevEditFields, setPrevEditFields] = useState(editFields)
    const [open, setOpen] = useState(false);
    const [loadButton, setLoadButton] = useState(false)

    const handleClose = () => {
        setEditFields({ camp_id: '', client_name: '', campaign_name: '', start_date: '', end_date: '', camp_type: '', planned_impressions: 0, planned_cpm: 0, planned_clicks: 0, planned_cpc: 0, planned_video_views: 0, planned_cpv: 0, planned_complete_video_views: 0, planned_cpcv: 0, ctr: 0, reach: 0, planned_budget: 0, main_access: [], summary_access: [], report_access: [], detailedSectionAccess: { 'Apps And Urls Access': [] }, client_id: '' })
        setOpen(false);
    };




    useEffect(() => {
        const getData = async () => {
            setLoader(true)
            try {
                const api = Instance()
                const res = await api.get('/api/campaigndetails/' + campType)
                // console.log(res.data)
                // const data = res.data.map(data => ({ ...data, start_date: new Date(data.start_date).toLocaleString('en-CA').slice(0, 10), end_date: new Date(data.end_date).toLocaleString('en-CA').slice(0, 10) }))
                // setData(data)
                setData(res.data.tableData)
                setTableHeaders(res.data.headers)
                // setFilterdCampaignData(data)
                setLoader(false)
            }
            catch (err) {
                setLoader(false)
                // console.log(err)
                swal({
                    title: 'Error Occured!',
                    text: err.response.data ? err.response.data : 'Something went wrong Try Again!',
                    icon: 'error'
                })
            }


        }
        getData()
    }, [update, campType])


    const handleDeleteRow = (row) => {
        swal({
            title: "Do you want delete campaign?",
            text: "Once deleted, you will not be able to recover this details!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // console.log(row)
                    const api = Instance()
                    api.delete('/api/deletecampaign/' + row.camp_id)
                        .then(res => {
                            setUpdate(prev => prev + 1)
                            swal(res.data, {
                                icon: "success",
                            });
                        })
                        .catch((err) => {
                            // console.log(err)
                            swal(err.response.data, {
                                icon: "error",
                            });
                        })

                }
            });
    }

    const handleEdit = (rowData) => {


        // console.log(rowData)
        // const based_on = rowData.camp_based_on.split(',')
        // const opt = rowData.selected_camp_opt.split(',')
        //const client_access = rowData.client_camp_access.split(',')
        const summary_access = rowData.summary_access.split(',')
        const report_access = rowData.report_access.split(',')
        const main_access = rowData.main_access.split(',')

        if (rowData.camp_type === 'banner') {
            setEditFields({ ...rowData, main_access, summary_access, report_access, detailedSectionAccess: { 'Apps And Urls Access': [] }})
            setPrevEditFields({ ...rowData, main_access, summary_access, report_access, detailedSectionAccess: { 'Apps And Urls Access': [] }})
        }
        else {
            const apps_and_urls_access = rowData.apps_and_urls_access.split(',')
            setEditFields({ ...rowData, main_access, summary_access, report_access, detailedSectionAccess: { 'Apps And Urls Access': apps_and_urls_access } })
            setPrevEditFields({ ...rowData, main_access, summary_access, report_access, detailedSectionAccess: { 'Apps And Urls Access': apps_and_urls_access } })
        }
        // console.log(editFields)

        setOpen(true)

    }




    const editMode = useMemo(() => {

        const detailedAccess = {
            'Apps And Urls Access': ['impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views', 'ctr'],
            // Creative:[ 'impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views','completion rate']
        }



        const handleEditFieldsChange = (e) => {
            setEditFields({ ...editFields, [e.target.name]: e.target.value })
            // let field, cal, ctrPer, total;
            // const val = e.target.value === '' ? 0 : e.target.value
            // if (editFields.camp_type === 'banner') {
            //     if (e.target.name === 'planned_impressions') {
            //         field = 'planned_budget_impressions'
            //         cal = Number(((val * editFields.planned_cpm) / 1000).toFixed(2))
            //         total = Number((editFields.planned_budget_clicks + cal).toFixed(2))

            //         if (editFields.planned_clicks !== 0 && editFields.planned_clicks !== '') {
            //             ctrPer = ((editFields.planned_clicks / val) * 100).toFixed(2)
            //         }
            //         else {
            //             ctrPer = 0
            //         }

            //     }
            //     if (e.target.name === 'planned_cpm') {
            //         field = 'planned_budget_impressions'
            //         cal = Number(((editFields.planned_impressions * val) / 1000).toFixed(2))
            //         total = Number((editFields.planned_budget_clicks + cal).toFixed(2))
            //         // console.log(field,cal,e.target.value)
            //     }
            //     if (e.target.name === 'planned_clicks') {
            //         field = 'planned_budget_clicks'
            //         cal = Number((val * editFields.planned_cpc).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + cal).toFixed(2))
            //         if (editFields.planned_impressions !== 0 && editFields.planned_impressions !== '') {
            //             ctrPer = ((val / editFields.planned_impressions) * 100).toFixed(2)
            //         }
            //         else {
            //             ctrPer = 0
            //         }

            //     }
            //     if (e.target.name === 'planned_cpc') {
            //         field = 'planned_budget_clicks'
            //         cal = Number((editFields.planned_clicks * val).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + cal).toFixed(2))
            //     }
            //     if (field !== undefined && cal !== undefined) {
            //         if (ctrPer !== undefined && ctrPer !== 'Infinity') {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, [field]: cal, ctr: ctrPer, planned_budget_total: total })
            //         }
            //         else {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, [field]: cal, planned_budget_total: total })
            //         }

            //     }
            //     else {
            //         if (ctrPer !== undefined && ctrPer !== 'Infinity') {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, ctr: ctrPer, planned_budget_total: total })
            //         }
            //         else {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value })
            //         }

            //     }
            // }
            // else {
            //     if (e.target.name === 'planned_impressions') {
            //         field = 'planned_budget_impressions'
            //         cal = Number(((val * editFields.planned_cpm) / 1000).toFixed(2))
            //         total = Number((editFields.planned_budget_clicks + cal + editFields.planned_budget_video_views + editFields.planned_budget_complete_video_views).toFixed(2))

            //         if (editFields.planned_clicks !== 0 && editFields.planned_clicks !== '') {
            //             ctrPer = ((editFields.planned_clicks / val) * 100).toFixed(2)
            //         }
            //         else {
            //             ctrPer = 0
            //         }

            //     }
            //     if (e.target.name === 'planned_cpm') {
            //         field = 'planned_budget_impressions'
            //         cal = Number(((editFields.planned_impressions * val) / 1000).toFixed(2))
            //         total = Number((editFields.planned_budget_clicks + cal + editFields.planned_budget_video_views + editFields.planned_budget_complete_video_views).toFixed(2))
            //         // console.log(field,cal,e.target.value)
            //     }
            //     if (e.target.name === 'planned_clicks') {
            //         field = 'planned_budget_clicks'
            //         cal = Number((val * editFields.planned_cpc).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + cal + editFields.planned_budget_video_views + editFields.planned_budget_complete_video_views).toFixed(2))
            //         if (editFields.planned_impressions !== 0 && editFields.planned_impressions !== '') {
            //             ctrPer = ((val / editFields.planned_impressions) * 100).toFixed(2)
            //         }
            //         else {
            //             ctrPer = 0
            //         }

            //     }
            //     if (e.target.name === 'planned_cpc') {
            //         field = 'planned_budget_clicks'
            //         cal = Number((editFields.planned_clicks * val).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + cal + editFields.planned_budget_video_views + editFields.planned_budget_complete_video_views).toFixed(2))
            //     }
            //     if (e.target.name === 'planned_video_views') {
            //         field = 'planned_budget_video_views'
            //         cal = Number((editFields.planned_cpv * val).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + editFields.planned_budget_clicks + editFields.planned_budget_complete_video_views + cal).toFixed(2))

            //     }
            //     if (e.target.name === 'planned_cpv') {
            //         field = 'planned_budget_video_views'
            //         cal = Number((val * editFields.planned_video_views).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + editFields.planned_budget_clicks + editFields.planned_budget_complete_video_views + cal).toFixed(2))
            //     }
            //     if (e.target.name === 'planned_complete_video_views') {
            //         field = 'planned_budget_complete_video_views'
            //         cal = Number((editFields.planned_cpcv / val).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + editFields.planned_budget_clicks + editFields.planned_budget_video_views + cal).toFixed(2))

            //     }
            //     if (e.target.name === 'planned_cpcv') {
            //         field = 'planned_budget_complete_video_views'
            //         cal = Number((val * editFields.planned_complete_video_views).toFixed(2))
            //         total = Number((editFields.planned_budget_impressions + editFields.planned_budget_clicks + editFields.planned_budget_video_views + cal).toFixed(2))

            //     }
            //     // console.log(field, ctrPer, cal, total )
            //     // console.log(field !== undefined && cal !== undefined && !isNaN(cal))
            //     // console.log(ctrPer !== undefined && ctrPer !== 'Infinity' )
            //     if (field !== undefined && cal !== undefined && !isNaN(cal)) {
            //         if (ctrPer !== undefined && ctrPer !== 'Infinity') {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, [field]: cal, ctr: ctrPer, planned_budget_total: total })
            //         }
            //         else {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, [field]: cal, planned_budget_total: total })
            //         }

            //     }
            //     else {
            //         if (ctrPer !== undefined && ctrPer !== 'Infinity' && !isNaN(ctrPer)) {

            //             setEditFields({ ...editFields, [e.target.name]: e.target.value, ctr: ctrPer, planned_budget_total: total })
            //         }
            //         else {
            //             setEditFields({ ...editFields, [e.target.name]: e.target.value })
            //         }

            //     }
            // }


        }

        const handleSubmit = async (e) => {
            e.preventDefault()
            // console.log(editFields.camp_based_on.length===0)

            if (JSON.stringify(prevEditFields) !== JSON.stringify(editFields)) {
                setLoadButton(true)
                try {
                    const api = Instance()
                    const res = await api.put('/api/editcampaign', editFields)
                    // console.log(res.data)
                    setLoadButton(false)
                    handleClose()
                    setUpdate(prev => prev + 1)
                    swal({
                        title: "Success",
                        text: res.data,
                        icon: "success"
                    })

                }
                catch (err) {
                    setLoadButton(false)
                    swal({
                        title: 'Error Occured!',
                        text: err.response.data,
                        icon: 'error'
                    })
                }
                // console.log(editFields)
            }




        }
        return (
            <>
                <Dialog
                    fullWidth={true}
                    maxWidth={'md'}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    keepMounted
                >
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Campaign</DialogTitle>
                    <DialogContent>
                        <Stack p={1} component={'form'} id='editcampaignform' onSubmit={handleSubmit} spacing={{ xs: 1.5, xl: 3 }}>

                            <TextField
                                label='Enter Campaign Name'
                                size='small'
                                type='text'
                                name='campaign_name'
                                value={editFields.campaign_name}
                                onChange={handleEditFieldsChange}
                                required

                            />
                            <Stack spacing={2} direction={{ xs: "column", lg: 'row' }} sx={{ width: '100%' }}>

                                <TextField
                                    label='Start Date'
                                    size='small'
                                    fullWidth
                                    type='date'
                                    name='start_date'
                                    value={editFields.start_date}
                                    onChange={handleEditFieldsChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ max: editFields.end_date }}
                                    required

                                />


                                <TextField
                                    label='End Date'
                                    size='small'
                                    fullWidth
                                    type='date'
                                    name='end_date'
                                    value={editFields.end_date}
                                    onChange={handleEditFieldsChange}
                                    InputLabelProps={{ shrink: true }}

                                    inputProps={{ min: editFields.start_date }}
                                    required
                                />


                            </Stack>
                            <Stack spacing={2} direction={{ xs: "column", lg: 'row' }} sx={{ width: '100%' }}>
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <Collapse in={editFields.camp_type === 'banner'} unmountOnExit timeout={'auto'}>
                                        <Stack spacing={2}>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>


                                                <TextField
                                                    label='Planned Impreessions'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_impressions'
                                                    value={editFields.planned_impressions}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />





                                                <TextField
                                                    label='Planned CPM'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpm'
                                                    value={editFields.planned_cpm}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />


                                            </Stack>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                <TextField
                                                    label='Planned Clicks'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_clicks'
                                                    value={editFields.planned_clicks}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    label='Planned CPC'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpc'
                                                    value={editFields.planned_cpc}
                                                    onChange={handleEditFieldsChange}
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
                                                    value={editFields.ctr}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}

                                                />
                                                <TextField
                                                    label='Reach (Achieved)'
                                                    size='small'
                                                    type='number'
                                                    name='reach'
                                                    fullWidth
                                                    value={editFields.reach}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}

                                                />
                                            </Stack>
                                            <TextField
                                                label='Planned Budget'
                                                size='small'
                                                fullWidth
                                                name='planned_budget'
                                                value={editFields.planned_budget}
                                                onChange={handleEditFieldsChange}

                                            />
                                        </Stack>
                                    </Collapse>
                                    <Collapse in={editFields.camp_type === 'video'} unmountOnExit timeout={'auto'}>
                                        <Stack spacing={2}>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>


                                                <TextField
                                                    label='Planned Impreessions'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_impressions'
                                                    value={editFields.planned_impressions}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    label='Planned CPM'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpm'
                                                    value={editFields.planned_cpm}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </Stack>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                <TextField
                                                    label='Planned Clicks'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_clicks'
                                                    value={editFields.planned_clicks}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    label='Planned CPC'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpc'
                                                    value={editFields.planned_cpc}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </Stack>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                <TextField
                                                    label='Planned Views'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_video_views'
                                                    value={editFields.planned_video_views}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    label='Planned CPV'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpv'
                                                    value={editFields.planned_cpv}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                />
                                            </Stack>
                                            <Stack spacing={1} sx={{ width: '100%' }} direction={'row'}>
                                                <TextField
                                                    label='Planned Complete Views'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_complete_video_views'
                                                    value={editFields.planned_complete_video_views}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <TextField
                                                    label='Planned CPVC'
                                                    size='small'
                                                    fullWidth
                                                    type='number'
                                                    name='planned_cpcv'
                                                    value={editFields.planned_cpcv}
                                                    onChange={handleEditFieldsChange}
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
                                                    value={editFields.ctr}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}

                                                />
                                                <TextField
                                                    label='Reach (Achieved)'
                                                    size='small'
                                                    type='number'
                                                    name='reach'
                                                    fullWidth
                                                    value={editFields.reach}
                                                    onChange={handleEditFieldsChange}
                                                    inputProps={{ min: 0, step: 0.01 }}

                                                />
                                            </Stack>
                                            <TextField
                                                label='Planned Budget'
                                                size='small'
                                                fullWidth
                                                type='number'
                                                name='planned_budget'
                                                value={editFields.planned_budget}
                                                onChange={handleEditFieldsChange}

                                            />

                                        </Stack>
                                    </Collapse>

                                </Stack>
                                <Stack spacing={1.5} sx={{ width: '100%' }}>


                                    <Box>
                                        <Collapse in={editFields.camp_type !== ''} unmountOnExit timeout={'auto'}>
                                            <fieldset >
                                                <legend style={{ textAlign: 'center' }}>Client Dashboard Access</legend>
                                                <FormControl component="fieldset" variant="standard" fullWidth >
                                                    <FormLabel component="legend"  >Main Access:</FormLabel>
                                                    <FormGroup row onChange={e => {
                                                        // console.log(e.target.value)
                                                        const val = e.target.value
                                                        let newBasedValues;
                                                        let summary_access =editFields.summary_access, report_access=editFields.report_access, apps_and_urls_access=editFields.detailedSectionAccess['Apps And Urls Access'];
                                                        if(val==='table view' &&  editFields.main_access.includes(val) && editFields.main_access.includes('graph view')){
                                                            summary_access =[]                                                            
                                                        }
                                                        else if(val==='table view' &&  editFields.main_access.includes(val) && !editFields.main_access.includes('graph view')){
                                                            summary_access=[]
                                                            report_access=[]
                                                        }
                                                        else if(val==='graph view' &&  editFields.main_access.includes(val) && !editFields.main_access.includes('table view')){
                                                            report_access=[]
                                                        }
                                                        else if(val==='detailed view' &&  editFields.main_access.includes(val)){
                                                            apps_and_urls_access =[]
                                                        }
                                                        

                                                        if (editFields.main_access.includes(val)) {
                                                            newBasedValues = editFields.main_access.filter(acc => acc !== val)
                                                        }
                                                        else {
                                                            newBasedValues = [...editFields.main_access, val]
                                                        }
                                                        setEditFields({ ...editFields, main_access: newBasedValues, summary_access, report_access, detailedSectionAccess:{'Apps And Urls Access':apps_and_urls_access} })



                                                    }}>

                                                        {
                                                            ['table view', 'graph view', 'detailed view',].map(acc =>

                                                                <FormControlLabel
                                                                    key={acc}
                                                                    value={acc}
                                                                    control={<Checkbox size='small' checked={editFields.main_access.includes(acc)} />}
                                                                    label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}


                                                                    labelPlacement="end"
                                                                />
                                                            )}

                                                    </FormGroup>
                                                </FormControl>
                                                <Collapse in={editFields.main_access.includes('table view')} unmountOnExit timeout={1000} >
                                                    <FormControl component="fieldset" variant="standard" fullWidth >
                                                        <FormLabel component="legend"  >Summary Access:</FormLabel>
                                                        <FormGroup row onChange={e => {
                                                            // console.log(e.target.value)
                                                            const val = e.target.value
                                                            let newBasedValues;

                                                            if (editFields.summary_access.includes(val)) {
                                                                newBasedValues = editFields.summary_access.filter(acc => acc !== val)
                                                            }
                                                            else {
                                                                newBasedValues = [...editFields.summary_access, val]
                                                            }
                                                            setEditFields({ ...editFields, summary_access: newBasedValues })


                                                        }}>
                                                            <Collapse in={editFields.camp_type === 'banner'} dir='horizontal' unmountOnExit timeout={1000} >
                                                                {
                                                                    ['impressions', 'clicks', 'cpm', 'cpc', 'reach', 'cost', 'ctr'].map(acc =>

                                                                        <FormControlLabel
                                                                            key={acc}
                                                                            value={acc}
                                                                            control={<Checkbox size='small' checked={editFields.summary_access.includes(acc)} />}
                                                                            label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}

                                                                            labelPlacement="end"
                                                                        />
                                                                    )}
                                                            </Collapse>
                                                            <Collapse in={editFields.camp_type === 'video'} dir='horizontal' unmountOnExit timeout={1000} >
                                                                {
                                                                    ['impressions', 'clicks', 'video views', 'complete video views', 'cpm', 'cpc', 'cpv', 'cpcv', 'reach', 'cost', 'ctr'].map(acc =>

                                                                        <FormControlLabel
                                                                            key={acc}
                                                                            value={acc}
                                                                            control={<Checkbox size='small' checked={editFields.summary_access.includes(acc)} />}
                                                                            label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}

                                                                            labelPlacement="end"
                                                                        />
                                                                    )}
                                                            </Collapse>
                                                        </FormGroup>
                                                    </FormControl>
                                                </Collapse>

                                                <Collapse in={editFields.main_access.includes('table view') || editFields.main_access.includes('graph view')} unmountOnExit timeout={1000} >
                                                    <FormControl component="fieldset" variant="standard" fullWidth >
                                                        <FormLabel component="legend">Report Access:</FormLabel>
                                                        <FormGroup row onChange={e => {
                                                            // console.log(e.target.value)
                                                            const val = e.target.value
                                                            let newBasedValues;

                                                            if (editFields.report_access.includes(val)) {
                                                                newBasedValues = editFields.report_access.filter(acc => acc !== val)
                                                            }
                                                            else {
                                                                newBasedValues = [...editFields.report_access, val]
                                                            }
                                                            setEditFields({ ...editFields, report_access: newBasedValues })


                                                        }}>
                                                            <Collapse in={editFields.camp_type === 'banner'} dir='horizontal' unmountOnExit timeout={1000} >
                                                                {
                                                                    ['impressions', 'clicks', 'cpm', 'cpc', 'reach', 'cost', 'ctr'].map(acc =>

                                                                        <FormControlLabel
                                                                            key={acc}
                                                                            value={acc}
                                                                            control={<Checkbox size='small' checked={editFields.report_access.includes(acc)} />}
                                                                            label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}

                                                                            labelPlacement="end"
                                                                        />
                                                                    )}
                                                            </Collapse>
                                                            <Collapse in={editFields.camp_type === 'video'} dir='horizontal' unmountOnExit timeout={1000} >
                                                                {
                                                                    ['impressions', 'clicks', 'video views', '25% video views', '50% video views', '75% video views', 'complete video views', 'cpm', 'cpc', 'cpv', 'cpcv', 'reach', 'cost', 'ctr'].map(acc =>

                                                                        <FormControlLabel
                                                                            key={acc}
                                                                            value={acc}
                                                                            control={<Checkbox size='small' checked={editFields.report_access.includes(acc)} />}
                                                                            label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}

                                                                            labelPlacement="end"
                                                                        />
                                                                    )}
                                                            </Collapse>
                                                        </FormGroup>
                                                    </FormControl>
                                                </Collapse>
                                                

                                                <Collapse in={editFields.camp_type === 'video' && editFields.main_access.includes('detailed view')} unmountOnExit timeout={1000} >
                                                    <Divider>Detailed view Access </Divider>
                                                    {
                                                        Object.keys(editFields.detailedSectionAccess).map(category => (
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
                                                                    if (editFields.detailedSectionAccess[category].includes(val)) {
                                                                        newBasedValues = editFields.detailedSectionAccess[category].filter(acc => acc !== val)
                                                                    }
                                                                    else {
                                                                        newBasedValues = [...editFields.detailedSectionAccess[category], val]
                                                                    }
                                                                    setEditFields({ ...editFields, detailedSectionAccess: { ...editFields.detailedSectionAccess, [category]: newBasedValues } })
                                                                    // }

                                                                }}>
                                                                    {
                                                                        detailedAccess[category].map(acc =>
                                                                            <FormControlLabel
                                                                                key={acc}
                                                                                value={acc}
                                                                                control={<Checkbox size='small' checked={editFields.detailedSectionAccess[category].includes(acc)} />}
                                                                                label={<Typography sx={{ fontSize: '12px' }}>{acc.toUpperCase()}</Typography>}

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

                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Stack spacing={1} direction={'row'}>
                            <Button color='error' onClick={handleClose}>cancel</Button>
                            <LoadingButton loading={loadButton} color='success' form='editcampaignform' type='submit'  >Save</LoadingButton>
                        </Stack>
                    </DialogActions>
                </Dialog>

            </>
        )
    }, [editFields, open, prevEditFields, loadButton])



    const columns = useMemo(
        () => tableHeaders.map((key) => ({
            accessorKey: key.toLowerCase().split(' ').join('_'), header: key, id: key, Cell: ({ cell }) => {

                if (['Start Date', 'End Date'].includes(cell.column.id)) {
                    return new Date(cell.getValue()).toLocaleDateString('en-GB')
                }
                else {
                    return cell.getValue()?.toLocaleString?.()
                }

            },
        }))
        , [tableHeaders]
    )

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)

        state: {
            columnOrder: [...tableHeaders, 'mrt-row-actions'],
        },
        enableStickyHeader: true,
        positionActionsColumn: 'last',
        enableRowActions: true,
        // enableColumnResizing:true,


        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem key="edit" onClick={() => {
                closeMenu()
                handleEdit(row.original)
            }}>
                <ListItemIcon><Edit /></ListItemIcon>
                Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => {
                closeMenu()
                handleDeleteRow(row.original)
            }}>
                <ListItemIcon><Delete /></ListItemIcon>
                Delete
            </MenuItem>,
        ],

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

        renderTopToolbarCustomActions: () => (
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent={'center'} alignItems={'center'} spacing={2} m={1}>
                <Typography component={'h2'} variant='p' textAlign={'center'} >Campaign Details</Typography>

                <FormControl sx={{ width: '200px' }}>
                    <InputLabel size='small' variant="standard" htmlFor="uncontrolled-native">
                        Campaign Type
                    </InputLabel>
                    <NativeSelect
                        size='small'
                        onChange={e => {
                            setTableHeaders([])
                            // setData([])
                            setCampType(e.target.value)
                        }}
                    >
                        <option value={'banner'}>Banner</option>
                        <option value={'video'}>Video</option>

                    </NativeSelect>
                </FormControl>
            </Stack>
        )

    })

    return (
        <Box sx={{ width: '100%', height: '100vh', backgroundImage: 'url(12244.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

            <Navbar />
            <Grid container>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>



                        <MaterialReactTable table={table} />


                    </Grid>
                </Box>
            </Grid>
            {editMode}
            <Loader loader={loader} />
        </Box>
    )
}

export default CampaignDetails