import { Box, Grid } from '@mui/material'
import React from 'react'
import CreateTable from './createTable'

function DetailedView({ viewData }) {
    //console.log(view)
    const { age_report, apps_and_urls_report, city_report, creative_report, device_report, gender_report, isp_or_carrier_report } = viewData
    return (
        <>
            {
                apps_and_urls_report.data.length === 0 && age_report.data.length === 0 && gender_report.data.length === 0 && device_report.data.length === 0 && creative_report.data.length === 0 && city_report.data.length === 0 && isp_or_carrier_report.data.length === 0 ?
                    <>
                        <Grid item xs={12} md={12}>
                            <Box sx={{ width: '100%', height: '300px' }}>
                                <img src='data-error.gif' alt='no data' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>

                        </Grid>
                    </>
                    :
                    <>
                        <Grid container spacing={2} >
                            {apps_and_urls_report.data.length !== 0 &&
                                <Grid item xs={12} md={8}>
                                    <CreateTable report={apps_and_urls_report} name={'apps_and_urls'} />
                                </Grid>
                            }
                            <Grid item xs={12} md={4}>
                                <Grid container spacing={2}>
                                    {
                                        Object.keys(viewData).filter(col => ['gender_report', 'age_report', 'device_report', 'creative_report'].includes(col) && viewData[col].data.length !== 0).map((reportName) =>

                                            <Grid key={reportName} item xs={12} md={12}>

                                                <CreateTable report={viewData[reportName]} name={reportName} />

                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>

                            {
                                Object.keys(viewData).filter(col => ['city_report', 'isp_or_carrier_report'].includes(col) && viewData[col].data.length !== 0).map((reportName) =>
                                    <Grid key={reportName} item xs={12} md={6}>
                                        <CreateTable report={viewData[reportName]} name={reportName} />
                                    </Grid>
                                )
                            }

                        </Grid>

                    </>
            }
        </>
    )
}

export default DetailedView