import { Typography } from "@mui/material"
import { MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { useMemo } from "react"

const nameConv = {
    'date': 'Date',
    'impressions': 'Impressions',
    'clicks': 'Clicks',
    'reach': 'Reach',
    'cost': 'Cost',
    'video_views': 'Video Views',
    '25%_video_views': '25% Video Views',
    '50%_video_views': ' `50%_video_views`',
    '75%_video_views': '`75%_video_views`',
    'complete_video_viewss': 'complete_video_views',
    'apps_and_urls': 'Apps & URLs',
    'age': 'Age',
    'gender': 'Gender',
    'city': 'City',
    'creative': 'Creative',
    'device': 'Device',
    'isp_or_carrier': 'ISP or Carrier',
    'ctr': 'CTR (Click Through Rate)',
    'cpm': 'CPM (Cost Per Monitor)',
    'cpc': 'CPC (Cost Per Click)',
    'cpv': 'CPV (Cost Per View)',
    'cpvc': 'CPVC (Cost Per View Complete)',



}
function CreateTable({report,name}){
    let {data} = report
    //const name = {report}
    //console.log(name,data)
    if(['gender_report', 'age_report','creative_report', 'device_report'].includes(name)){
        const record ={}
        report.columns.forEach((col,index)=>{
            const impressions =  data.reduce((acc,curr)=>acc+curr['impressions'],0)
            const clicks =  data.reduce((acc,curr)=>acc+curr['clicks'],0)
            const ctr = ((clicks/impressions)*100).toFixed(2)+'%'
            if(index===0){
                record[col] = 'Total'
            }
            else if(col==='ctr'){
                record[col] = ctr
            }
            else{
                record[col] = data.reduce((acc,curr)=>acc+curr[col],0)
            }
            
        })
        //console.log(record)
        data = [...data, record]
       
    }
    const columns = useMemo(
        ()=>report.columns.map(key => ({ accessorKey: key, header: key.split('_').join(' ').toUpperCase(),id:key,  Cell:({ cell }) => (cell.getValue()?.toLocaleString?.()), maxSize: 50,   }))
        ,[report.columns]
    )

    
    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        initialState:{density:'compact'},

        //enableStickyHeader: true,
        enableKeyboardShortcuts: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableDensityToggle:false,
        enableFullScreenToggle:false,
        enableHiding:false,
        enableGlobalFilter:false,
        enablePagination:false,
        enableBottomToolbar: false,
        enableSorting:false,    

        enableTopToolbar: true,
       
        mrtTheme: (theme) => ({
            baseBackgroundColor: theme.palette.background.default, //change default background color
            
        }),
        muiTableContainerProps: {
            // sx: {
            //     maxHeight: "340px"
            // }
           
        },
        muiTableHeadRowProps: {
            sx: {
                bgcolor: '#00a4cc',
                

            }
        },

        muiTableBodyProps: {
            sx: {
                //stripe the rows, make odd rows a darker color
                
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#ECF5FF',

                },
            },
        },
        muiTableBodyRowProps: { hover: false },


        muiTableHeadCellProps: {
            sx: {

                color:'white',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },
        renderTopToolbarCustomActions: () => 
             <Typography variant='p' component={'h3'}>{nameConv[name.replace('_report','')]}</Typography>
          
    

    })
    return(
        <MaterialReactTable table={table} />
    )
    

}
export default CreateTable