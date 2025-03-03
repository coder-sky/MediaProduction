import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import Chart from "react-apexcharts";
import CountUp from 'react-countup';

const initialInsights = ['impressions', 'clicks', 'video_views', 'cost']
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


const colors = {
    impressions: '#008ffb',
    clicks: '#00e396',
    cost: '#feb019',
    video_views: '#9b59b6',
}

const graphCreation = (type, insights) => {
    const data = {
        series: [{ name: nameConv[type], data: [insights[type].planned, insights[type].actual] },],
        options: {
            chart: {
                height: 'auto',
                type: 'bar',
                toolbar: {
                    show: false
                },

                zoom: {
                    enabled: false
                }
            },
            colors: colors[type],
            title: {
                text: nameConv[type],
                align: 'left',
                style: {
                    fontSize: '16px',
                    colors: ["#304758"]
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',

                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },

                },
            },
            dataLabels: {
                enabled: true,

                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            xaxis: {

                categories: ['Planned', 'Actual',]
            }
        },
        fill: {
            opacity: 1
        },
    }
    return data
}

const generateWeeklyData = (campaignStat, graphData)=>{
    const weeklyData = []
    let temp = {}
    // console.log(campaignStat, graphData)
    graphData.forEach((data, index) => {
        //console.log(index+1, ((index) % 7 === 0 || index === 0),((index + 1) % 7 === 0 || graphData.length === index + 1) )
        if (index  % 7 === 0) {
            temp = campaignStat.reduce((acc, curr) => {
                return { ...acc, [curr]: 0 }
            }, {})
            temp['date'] = data['date']
        }

        for (let i of campaignStat) {
           
            temp[i] = temp[i] + data[i]
        }
        if ((index + 1) % 7 === 0 || graphData.length === index + 1) {
            weeklyData.push(temp)
            // console.log(temp, index)
            temp = {}
            
        }

    })
    return weeklyData

}

const overViewInsights = ['impressions', 'clicks', 'video_views', 'complete_video_views', 'cost', 'ctr', 'cpm', 'cpc', 'cpv', 'cpcv']


function GraphView({ viewData }) {
    //console.log(data, 'data')
    const data = viewData.tableData
    const insights = viewData.insights
    const campaignStat = initialInsights.filter(check => Object.keys(insights).includes(check))
    const graphStat = initialInsights.filter(check => Object.keys(data.length===0?{}:data[0]).includes(check))
    
    const weeklyData = generateWeeklyData(graphStat, data)
    


    const graphData = {

        series: graphStat.map((category, index) => ({ name: nameConv[category], type: index <= 1 ? 'column' : 'line', data: data.map(value => value[category]) })), //[{name:'Impressions', type: 'column', data:data.map(value=>value['impressions'])}, {name:'Clicks', type: 'column', yAxisIndex: 1, data:data.map(value=>value['clicks'])},{name:'Cost',type: 'line', data:data.map(value=>value['cost'])}],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            colors: graphStat.map(category => colors[category]),
            stroke: {
                width: [0, 0, 3, 3]
            },
            title: {
                text: 'Daily Trends'
            },

            labels: data.map(value => new Date(value.date).toLocaleString(undefined, { month: 'short', day: '2-digit' }).slice(0, 10)),
            yaxis: [
                {
                    title: {
                        text: 'Impressions'
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: 'Click-Cost'
                    }

                }
            ],
        },


    }

    const weeklyGraphData = {

        series: graphStat.map((category, index) => ({ name: nameConv[category], type: index <= 1 ? 'column' : 'line', data: weeklyData.map(value => value[category]) })), //[{name:'Impressions', type: 'column', data:data.map(value=>value['impressions'])}, {name:'Clicks', type: 'column', yAxisIndex: 1, data:data.map(value=>value['clicks'])},{name:'Cost',type: 'line', data:data.map(value=>value['cost'])}],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            colors: graphStat.map(category => colors[category]),
            stroke: {
                width: [0, 0, 3, 3]
            },
            title: {
                text: 'Weekly Trends'
            },

            labels: weeklyData.map(value => new Date(value.date).toLocaleString(undefined, { month: 'short', day: '2-digit' }).slice(0, 10)),
            yaxis: [
                {
                    title: {
                        text: 'Impressions'
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: 'Click-Cost'
                    }

                }
            ],
        },


    }
  

    const checkCampOverview = data.length === 0 ? [] : overViewInsights.filter(check => Object.keys(data[0]).includes(check))
    const campOverView = {}
    checkCampOverview.forEach(col => {
        const impressions = data.reduce((acc, curr) => acc + curr['impressions'], 0)
        const clicks = data.reduce((acc, curr) => acc + curr['clicks'], 0)
        const cost = data.reduce((acc, curr) => acc + curr['cost'], 0)
        const video_views = data.reduce((acc, curr) => acc + curr['video_views'], 0)
        const complete_video_views = data.reduce((acc, curr) => acc + curr['complete_video_views'], 0)

        if (col === 'impressions') {
            campOverView[nameConv[col]] = impressions
        }
        else if (col === 'clicks') {
            campOverView[nameConv[col]] = clicks
        }
        else if (col === 'video_views') {
            campOverView[nameConv[col]] = video_views
        }
        else if (col === 'complete_video_views') {
            campOverView[nameConv[col]] = complete_video_views
        }
        else if (col === 'ctr') {
            campOverView[nameConv[col]] = parseFloat(((clicks / impressions) * 100).toFixed(2))
        }
        else if (col === 'cpm') {

            campOverView[nameConv[col]] = Number(((cost /impressions) * 1000).toFixed(2))
            //console.log('cpm',cost / (impressions * 1000))


        }
        else if (col === 'cpc') {
            campOverView[nameConv[col]] = Number((cost / clicks).toFixed(2))
        }
        else if (col === 'cpv') {
            campOverView[nameConv[col]] = Number((cost / video_views).toFixed(2))
            //console.log(cost)
        }
        else if (col === 'cpcv') {
            campOverView[nameConv[col]] = Number((cost / complete_video_views).toFixed(2))
        }

    })
    // console.log(campOverView, checkCampOverview)


    return (
        <>

            <Grid container spacing={3} >
                {
                    campaignStat.length !== 0 && <>
                        {
                            campaignStat.map(type => (
                                <Grid item xs={12} md={12 / campaignStat.length <= 4 ? 12 / campaignStat.length : 4} key={type}>

                                    <Card elevation={10} sx={{ borderRadius: '20px' }}>
                                        <CardContent>
                                            <Chart
                                                series={graphCreation(type, insights).series}
                                                options={graphCreation(type, insights).options}
                                                type='bar'
                                                height={'auto'}
                                            />

                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                        {
                            data.length !== 0 && <>
                                <Grid item xs={12} md={8}>

                                    <Stack spacing={4} direction={'column'}>

                                        <Card elevation={10} sx={{ borderRadius: '20px' }}>
                                            <CardContent>
                                                <Chart
                                                    options={graphData.options} series={graphData.series} type="line" height={'350px'}
                                                />
                                            </CardContent>
                                        </Card>

                                        <Card elevation={10} sx={{ borderRadius: '20px' }}>
                                            <CardContent>
                                                <Chart
                                                    options={weeklyGraphData.options} series={weeklyGraphData.series} type="line" height={'350px'}
                                                />
                                            </CardContent>
                                        </Card>

                                    </Stack>
                                </Grid>
                            </>
                        }
                        <Grid item xs={12} md={4}>
                            {
                                Object.keys(campOverView).map(type => (
                                    !isNaN(campOverView[type]) && <Card key={type} elevation={10} sx={{ mb: 2, borderRadius: '20px' }}>
                                        <CardContent>

                                            <Typography variant='p' component={'h3'}>{type}</Typography>
                                            <Stack direction={'row'} justifyContent={'space-between'} >
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: 1, mt: 2 }}>
                                                    <CountUp start={0} end={campOverView[type]} decimals={type === 'CTR (Click Through Rate)' || ['CPC (Cost Per Click)', 'CPM (Cost Per Monitor)','CPV (Cost Per View)', 'CPCV (Cost Per Complete View)'].includes(type) ? 2 : 0} suffix={type === 'CTR (Click Through Rate)' ? '%' : ''} duration={5} delay={0} >

                                                        {({ countUpRef }) => (
                                                            <div>
                                                                <span style={{ fontSize: '25px', fontWeight: 'bold', color: '#0086B4' }} ref={countUpRef} />
                                                            </div>
                                                        )}
                                                    </CountUp>
                                                    <Typography ml={0.5} color={'gray'} fontSize={'small'}>{new Date(data[0]['date']).toLocaleString(undefined, { month: 'short', day: '2-digit', year: "numeric", })} - {new Date(data[data.length - 1]['date']).toLocaleString(undefined, { month: 'short', day: '2-digit', year: "numeric", })}</Typography>


                                                </Box>
                                                <CardMedia
                                                    image={assets[type]}
                                                    sx={{ width: 80, height: 80 }}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </Grid>
                    </>
                }
                {
                    campaignStat.length === 0 && data.length === 0 && <>
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

export default GraphView