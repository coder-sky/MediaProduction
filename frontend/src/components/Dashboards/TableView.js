import { Box, Card, CardContent,  Grid, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import {MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ECF5FF',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


const nameConv = {
    'date': 'Date',
    'impressions': 'Impressions',
    'clicks': 'Clicks',
    'reach': 'Reach',
    'cost': 'Cost',
    'ctr': 'CTR (Click Through Rate)',
    'cpm': 'CPM (Cost Per Monitor)',
    'cpc': 'CPC (Cost Per Click)',
    'cpv': 'CPV (Cost Per View)',
    'cpcv': 'CPCV (Cost Per Complete View)',
    'video_views': 'Video Views',
    '25%_video_views': '25% Video Views',
    '50%_video_views': ' `50%_video_views`',
    '75%_video_views': '`75%_video_views`',
    'complete_video_views': 'Complete Video Views',
    'apps_and_urls': 'Apps & URLs',
    'age': 'Age',
    'gender': 'Gender',
    'city': 'City',
    'creative': 'Creative',
    'device': 'Device',
    'isp_or_carrier': 'ISP or Carrier'


}
const assets = {
    Impressions: 'impressions.gif',
    Clicks: 'clicks.gif',
    Views: 'views.gif',
    Cost: 'cost.gif',
    Reach:'reach.gif',
    'Video Views': 'video_views.gif',
    'Complete Video Views': 'complete_video.gif',
    'CTR (Click Through Rate)': 'CTR.gif',
    'CPM (Cost Per Monitor)': 'view-page.gif',
    'CPC (Cost Per Click)': 'CPC.gif',
    'CPV (Cost Per View)': 'video_cost.gif',
    'CPCV (Cost Per Complete View)': 'video_cost.gif',
}

const numberFormating =(num)=> num?.toLocaleString()



function TableView({ viewData }) {
    
    const data = viewData.tableData
    const insights = viewData.insights
    const dataCheck = data.length !== 0 ? data[0] : {}
    const tableHeaders = Object.keys(dataCheck)
    // console.log(dataCheck, data)
    
    // console.log(dataCheck, data, tableHeaders)

    const columns = useMemo(
        () => {
            

            const headers = tableHeaders.map(key => ({
                accessorKey: key, header: key.toUpperCase(), id: key, size: 100, Cell:({ cell }) => {
                   
                    if(cell.column.id==='date'){
                        return new Date(cell.getValue()).toLocaleDateString('en-GB')
                    }
                    else{
                        return cell.getValue()?.toLocaleString?.()
                    }
                    
                 } ,muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableFooterCellProps: {
                    align: 'center',
                },
            }))
            //console.log(headers)
            return headers
        }
        , [tableHeaders]
    )


    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableKeyboardShortcuts: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,

        mrtTheme: (theme) => ({
            baseBackgroundColor: theme.palette.background.default, //change default background color
        }),
        
        muiTableHeadRowProps: {
            sx: {
                bgcolor: '#00a4cc',


            }
        },

        muiTableBodyProps: {
            sx: {
                '& tr:nth-of-type(odd) > td': {
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

    return (
        <>
            <Grid container spacing={2} >
                {
                    Object.keys(insights).map((info) =>
                       
                            <Grid key={info} item xs={12} md={3}>
                                <Card  sx={{ borderRadius: '20px' }} variant='outlined'>
                                    <CardContent>
                                        <Stack direction={'row'} spacing={1}  >
                                            <Typography variant='p' component={'h3'}>{nameConv[info]} </Typography>
                                            <img src={assets[nameConv[info]]} alt={info} style={{ width: '30px', height: '30px' }} />
                                        </Stack>
                                        <TableContainer component={Paper} sx={{ mt: 1 }}>
                                            <Table >
                                                <TableHead>
                                                    <TableRow>
                                                        {
                                                            info === 'reach' ? <StyledTableCell align="right">Achieved</StyledTableCell> :
                                                                <>
                                                                    <StyledTableCell align="center">Planned</StyledTableCell>
                                                                    <StyledTableCell align="center">Actual</StyledTableCell>
                                                                </>
                                                        }
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        {
                                                            info === 'reach' ? <StyledTableCell align="right">{numberFormating(insights[info]['actual'])}</StyledTableCell> :
                                                                <>
                                                                    <StyledTableCell align="center">{numberFormating(insights[info]['planned'])}</StyledTableCell>
                                                                    <StyledTableCell align="center">{numberFormating(insights[info]['actual'])}</StyledTableCell>
                                                                </>

                                                        }
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>

                            </Grid>
                        )
                }
               
                {
                    data.length!==0 && 
                <Grid item xs={12} md={12}>
                    <MaterialReactTable table={table} />

                </Grid>

                }
                {
                    data.length===0 && Object.keys(insights).length===0&& <>
                        <Grid item xs={12} md={12}>
                            <Box sx={{ width: '100%', height: '300px' }}>
                                <img src='data-error.gif' alt='no data' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                        </Grid>
                    </>
                }
            </Grid>

        </>
    )
}

export default TableView