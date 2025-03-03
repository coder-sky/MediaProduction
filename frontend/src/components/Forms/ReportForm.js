import { Autocomplete, Box, Chip, Collapse, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../NavBar/Navbar'
import swal from 'sweetalert';
import Loader from '../Loader';
import LoadingButton from '@mui/lab/LoadingButton';
import Instance from '../../api/apiInstance';
import { CloudSync, CloudUpload, FileUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone'
import * as XLSX from "xlsx";



const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    height: "200px",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

function ReportForm() {
    const [inputValue, setInputValue] = useState('');
    const [inputValueCampaign, setInputValueCampaign] = useState('');
    const [fields, setFields] = useState({ client_name: null, campaign_name: null, start_date: '', end_date: '', camp_type: '', date: '', uploadDataType: '' })
    const [clientData, setClientData] = useState([])
    const [campaigns, setCampaigns] = useState([])
    const [campaignData, setCampaignData] = useState([])
    const [loader, setLoader] = useState(false)
    const [loadButton, setLoadButton] = useState(false)
    const [files, setFiles] = useState([]);
    const [excelData, setExcelData] = useState([]);





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
    const handleClientSelection = async (_, newValue) => {
        // // console.log(newValue)
        if (newValue) {
            const { id } = newValue
            try {
                setLoader(true)
                const api = Instance()
                const res = await api.get('/api/campaigns/' + id)
                // console.log(res.data)
                setCampaignData(res.data)
                const data = res.data.map(data => ({ campaignName: data.campaign_name, campId: data.camp_id }))
                setCampaigns(data)
                setFields({ client_name: newValue, campaign_name: null, start_date: '', end_date: '', camp_type: '', date: '', uploadDataType: '' })
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
        else {
            setFields(prev=>({ ...prev, client_name: newValue, campaign_name: null, start_date: '', end_date: '', camp_type: '', date: '', uploadDataType: '' }))
            setCampaigns([])
        }



    }

    const handleCampaignSelection = (_, newValue) => {
        // console.log(newValue)
        if (newValue) {
            // // console.log(newValue)
            const data = campaignData.filter(camp => camp.camp_id === newValue.campId)[0];
            const { start_date, end_date, camp_type } = data;
            const stDate = new Date(start_date).toLocaleString('en-CA').slice(0, 10);
            const endDate = new Date(end_date).toLocaleString('en-CA').slice(0, 10);
            // console.log(fields,newValue,camp_type)

            //setFields({ ...fields, campaign_name: newValue, start_date: stDate, end_date: endDate, camp_type: camp_type })
            setFields(prev=>({ ...prev, campaign_name: newValue, start_date: stDate, end_date: endDate, camp_type: camp_type }))

        }
        else {
            // setFields({ ...fields, campaign_name: newValue, start_date: '', end_date: '', })
            setFields(prev=>({...prev, campaign_name: newValue, start_date: '', end_date: '',  }))
        }

    }

    const handleFieldsChange = (e) => {
        if (e.target.name === 'uploadDataType') {
            setFields(prev => ({ ...prev, [e.target.name]: e.target.value, date: '' }))
            setFiles([])
            setExcelData([])
        }
        else {
            setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }

        

    }

    const excelDataFields = {
        daily: ['Date', 'Impressions', 'Clicks', 'Reach', 'Cost', 'Video Views', '25% Video Views', '50% Video Views', '75% Video Views', 'Complete Video Views',],
        'apps_and_urls': ['Apps & URLs', 'Impressions', 'Clicks', 'Video Views', '25% Video Views', '50% Video Views', '75% Video Views', 'Complete Video Views',],
        age: ['Age', 'Impressions', 'Clicks',],
        gender: ['Gender', 'Impressions', 'Clicks',],
        city: ['City', 'Impressions', 'Clicks',],
        creative: ['Creative', 'Impressions', 'Clicks',],
        device: ['Device', 'Impressions', 'Clicks',],
        'isp_or_carrier': ['ISP or Carrier', 'Impressions', 'Clicks',]

    }



    const handleClear = () => {
        setFiles([])
        setExcelData([])
        setCampaigns([])
        setFields({ client_name: null, campaign_name: null,  start_date: '', end_date: '', date: '', uploadDataType:'' })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(fields.date,excelData)
        const submitType = e.nativeEvent.submitter.value

        if (excelData.length === 0) {
            swal({
                title: 'Please upload valid excel file!',
                icon: 'error'
            })

        }
        else {
            // console.log(fields.uploadDataType)
            const sliceTheArray = fields.uploadDataType === 'daily' && fields.camp_type === 'banner' ? 5 : fields.uploadDataType === 'apps_and_urls' && fields.camp_type === 'banner'?3: excelDataFields[fields.uploadDataType].length
            const uploadedFormatChecks = excelDataFields[fields.uploadDataType].slice(0, sliceTheArray).filter(val => !Object.keys(excelData[0]).includes(val))
            // console.log(uploadedFormatChecks, fields.camp_type, excelDataFields[fields.uploadDataType], sliceTheArray)
            if (uploadedFormatChecks.length === 0) {
                // // console.log(submitType)
                if (submitType === 're-upload') {

                    swal({
                        title: "Do you want delete and re-upload the Data?",
                        text: "Remember that existing data will be deleted completly!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                setLoadButton(true)
                                const api = Instance()
                                api.post('/api/addreport/' + submitType, { ...fields, excelData: excelData })
                                    .then(res => {
                                        handleClear()
                                        setLoadButton(false)
                                        swal({
                                            title: "Success",
                                            text: res.data,
                                            icon: 'success'
                                        })
                                    })
                                    .catch(err => {
                                        setLoadButton(false)
                                        swal({
                                            title: "Error Occured!",
                                            text: err.response.data,
                                            icon: 'error'
                                        })
                                    })
                            }

                        })
                }
                else {
                    setLoadButton(true)
                    const api = Instance()
                    api.post('/api/addreport/' + submitType, { ...fields, excelData: excelData })
                        .then(res => {
                            handleClear()
                            setLoadButton(false)
                            swal({
                                title: "Success",
                                text: res.data,
                                icon: 'success'
                            })
                        })
                        .catch(err => {
                            setLoadButton(false)
                            swal({
                                title: "Error Occured!",
                                text: err.response.data,
                                icon: 'error'
                            })
                        })
                }


            }
            else {
                swal({
                    title: 'Please upload valid excel file!',
                    icon: 'error'
                })
            }
        }


    }

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
        useDropzone({
            accept: {

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx", ".csv"],
                "application/vnd.ms-excel": [".xls"],
            },
            maxFiles: 1,
            onDrop: (acceptedFile) => {
                setFiles(
                    acceptedFile.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
                if (acceptedFile) {
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(acceptedFile[0]);
                    reader.onload = (e) => {
                        prepareFile(e.target.result)
                    };
                } else {
                    //// console.log("Please select your file");
                }
            },
        });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const prepareFile = (fileBuffer) => {
        if (fileBuffer !== null) {
            // console.log(fileBuffer)
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            // console.log(data)
            setExcelData(data);
        }
    };

    
    return (
        <>
            <Box sx={{ width: '100%', height: '100vh', backgroundImage: 'url(12244.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

                <Navbar />
                <Grid container>
                    <Container sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 1, xl: 3 } }}>
                        <Grid item xs={12} sm={12} md={12} lg={7} xl={10}>
                            <Paper sx={{ p: 1, }} elevation={20}  >
                                <Typography component={'h1'} variant='p' textAlign={'center'} >Report Form</Typography>
                                <Stack component={'form'} p={2} onSubmit={handleSubmit} spacing={{ xs: 2, xl: 3, }}>

                                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
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
                                            value={fields.client_name}
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
                                            value={fields.campaign_name}
                                            onChange={handleCampaignSelection}
                                        />

                                    </Stack>
                                    
                                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                        <FormControl fullWidth >
                                            <InputLabel size='small' required>Upload Data Type</InputLabel>
                                            <Select value={fields.uploadDataType} onChange={handleFieldsChange} required name='uploadDataType' size='small' label='Upload Data Type'>
                                                <MenuItem value='daily'>Daily</MenuItem>
                                                <MenuItem value='apps_and_urls'>Apps & URLs</MenuItem>
                                                <MenuItem value='age'>Age</MenuItem>
                                                <MenuItem value='gender'>Gender</MenuItem>
                                                <MenuItem value='city'>City</MenuItem>
                                                <MenuItem value='creative'>Creative</MenuItem>
                                                <MenuItem value='device'>Device</MenuItem>
                                                <MenuItem value='isp_or_carrier'>ISP or Carrier</MenuItem>

                                            </Select>
                                        </FormControl>
                                        <Box sx={{ width: '100%' }}>
                                            <Collapse in={false} sx={{ width: '100%' }} timeout={'auto'} unmountOnExit>
                                                {/* <TextField
                                                    label='Date'
                                                    size='small'
                                                    fullWidth
                                                    type='date'
                                                    inputProps={{ min: fields.start_date, max: fields.end_date }}
                                                    InputLabelProps={{ shrink: true }}
                                                    value={fields.date}
                                                    name='date'
                                                    onChange={handleFieldsChange}
                                                    required
                                                /> */}
                                            </Collapse>
                                        </Box>


                                    </Stack>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', p: 1 }}>
                                        <section>
                                            <div {...getRootProps({ style })}>
                                                <input {...getInputProps()} />
                                                <h3>Drag 'n' drop file here, or click to select file</h3>
                                                <CloudUpload sx={{ fontSize: 50 }} />
                                            </div>
                                            <Typography m={1} component={"h5"} variant="p" color={"red"}>
                                                *upload excel sheet
                                            </Typography>
                                            <Stack
                                                direction={"row"}
                                                height={{ xs: 60, md: 20 }}
                                                spacing={2}
                                                p={1}
                                            >
                                                {files.length !== 0 ? (
                                                    <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                                        <Typography component={"h4"} variant="p" m={1}>
                                                            File:
                                                        </Typography>
                                                        <Chip
                                                            size='small'
                                                            color="success"
                                                            label={files[0].name}
                                                            variant="outlined"
                                                            onDelete={() => {
                                                                setFiles([])
                                                                setExcelData([])
                                                            }}
                                                        />
                                                    </Box>
                                                ) : null}
                                            </Stack>

                                         
                                        </section>
                                    </Box>

                                    <Stack spacing={4} direction={'row'} display={'flex'} justifyContent={'center'}>
                                        <LoadingButton loading={loadButton} name='upload' value='upload' variant='contained' color='success' type='submit' endIcon={<FileUpload />}>Upload</LoadingButton>

                                        <LoadingButton loading={loadButton} name='re-upload' value='re-upload' variant='contained' color='error' type='submit' endIcon={<CloudSync />}> Delete & Re-Upload</LoadingButton>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Container>
                </Grid>
                <Loader loader={loader} />
            </Box>
        </>
    )
}

export default ReportForm