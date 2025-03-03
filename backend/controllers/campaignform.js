import db from "../config/mysqlconnection.js"
import { v4 as uuid4 } from 'uuid'

export const addcampaign = (req, res) => {
    // console.log(req.body)
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'user')) {

        let { clientName, campaignName, startDate, endDate, campaignType, plannedImpressions, plannedCPM, plannedClicks, plannedCPC, ctr, reach, plannedBudget, mainAccess, summaryAccess, reportAccess, detailedSectionAccess } = req.body
        plannedImpressions = plannedImpressions === '' ? 0 : plannedImpressions
        plannedClicks = plannedClicks === '' ? 0 : plannedClicks
        plannedCPM = plannedCPM === '' ? 0 : plannedCPM
        plannedCPC = plannedCPC === '' ? 0 : plannedCPC
        reach = reach === '' ? 0 : reach
        ctr = ctr === '' ? 0 : ctr
        plannedBudget = plannedBudget === '' ? 0 : plannedBudget


        const client_name = clientName.clientName
        const client_id = clientName.id
        let check_campaing_query;

        check_campaing_query = 'select camp_id from bannercampaigns where campaign_name=? and client_id=? union  select camp_id from videocampaigns where  campaign_name=? and client_id=?;'


        const check_campaing_values = [campaignName, client_id, campaignName, client_id]
        db.query(check_campaing_query, check_campaing_values, async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json('Server Error Contact Admin!');
            }
            else {
                if (result.length === 0) {
                    const camp_id = uuid4()
                    const main_access = mainAccess.toString(',')
                    const summary_access = summaryAccess.toString(',')
                    const report_access = reportAccess.toString(',')
                    let insert_campaign_query, insert_campaign_values;

                    if (campaignType === 'banner') {
                        insert_campaign_query = 'insert into bannercampaigns values(?)'
                        insert_campaign_values = [[camp_id, client_name, campaignName, startDate, endDate, campaignType, plannedImpressions, plannedCPM, plannedClicks, plannedCPC, ctr, reach, plannedBudget, main_access, summary_access, report_access, client_id]]
                    }
                    else {
                        let { plannedVideoViews, plannedCPV, plannedCompleteVideoViews, plannedCPCV, } = req.body
                        plannedVideoViews = plannedVideoViews === '' ? 0 : plannedVideoViews
                        plannedCPV = plannedCPV === '' ? 0 : plannedCPV
                        plannedCompleteVideoViews = plannedCompleteVideoViews === '' ? 0 : plannedCompleteVideoViews
                        plannedCPCV = plannedCPCV === '' ? 0 : plannedCPCV

                       
                        const apps_and_urls_access = detailedSectionAccess['Apps And Urls Access'].toString(',')

                        insert_campaign_query = 'insert into videocampaigns values(?)'
                        insert_campaign_values = [[camp_id, client_name, campaignName, startDate, endDate, campaignType, plannedImpressions, plannedCPM, plannedClicks, plannedCPC, plannedVideoViews, plannedCPV, plannedCompleteVideoViews, plannedCPCV, ctr, reach, plannedBudget, main_access, summary_access, report_access, apps_and_urls_access, client_id]]
                    }

                    //// console.log(camp_based_on, selected_camp_opt, client_camp_access)


                    try {
                        await db.promise().query(insert_campaign_query, insert_campaign_values)
                        return res.status(200).json('Campaign added successfully.')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('Server Error Contact Admin!')
                    }

                }
                else {
                    return res.status(406).json('Campaign Name Already Exists!')
                }
            }
        })
    }
    else {
        return res.status(406).json('Invalid Access')
    }

}


export const campaigndetails = (req, res) => {
    const columnHeaders = {
        banner: ['Client Name', 'Campaign Name', 'Start Date', 'End Date', 'Planned Impressions', 'Planned CPM', 'Planned Clicks', 'Planned CPC', 'CTR', 'Planned Budget'],
        video: ['Client Name', 'Campaign Name', 'Start Date', 'End Date', 'Planned Impressions', 'Planned CPM', 'Planned Clicks', 'Planned CPC', 'Planned Video Views', 'Planned CPV', 'Planned Complete Video Views', 'Planned CPCV', 'CTR', 'Planned Budget']
    }
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        const type = req.params.type

        const campaign_details_query = `select * from ${type}campaigns order by start_date desc;`
        db.query(campaign_details_query, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('Server Error Contact Admin!')
            }
            else {
                return res.send({ tableData: result.map(data => ({ ...data, start_date: new Date(data.start_date).toLocaleDateString('en-CA'), end_date: new Date(data.end_date).toLocaleDateString('en-CA') })), headers: columnHeaders[type] })
            }
        })

    }
    else {
        return res.status(406).json('Invalid Access')
    }

}

export const deletecampaign = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        //// console.log(req.params)
        const { id } = req.params
        const delete_campaign_query1 = 'delete from bannercampaigns where camp_id=?;'
        const delete_campaign_values1 = [id]
        const delete_campaign_query2 = 'delete from videocampaigns where camp_id=?;'
        const delete_campaign_values2 = [id]
        const daily_data_report_delete_query = 'delete from daily_data_report where camp_id=?'
        const age_data_report_delete_query = 'delete from age_data_report where camp_id=?'
        const apps_and_urls_data_report_delete_query = 'delete from apps_and_urls_data_report where camp_id=?'
        const city_data_report_delete_query = 'delete from city_data_report where camp_id=?'
        const creative_data_report_delete_query = 'delete from creative_data_report where camp_id=?'
        const device_data_report_delete_query = 'delete from device_data_report where camp_id=?'
        const gender_data_report_delete_query = 'delete from gender_data_report where camp_id=?'
        const isp_or_carrier_data_report_delete_query = 'delete from isp_or_carrier_data_report where camp_id=?'
        
        try {
            await db.promise().query(delete_campaign_query1, delete_campaign_values1)
            await db.promise().query(delete_campaign_query2, delete_campaign_values2)
            await db.promise().query(daily_data_report_delete_query, [id])
            await db.promise().query(age_data_report_delete_query, [id])
            await db.promise().query(apps_and_urls_data_report_delete_query, [id])
            await db.promise().query(city_data_report_delete_query, [id])
            await db.promise().query(creative_data_report_delete_query, [id])
            await db.promise().query(device_data_report_delete_query, [id])
            await db.promise().query(gender_data_report_delete_query, [id])
            await db.promise().query(isp_or_carrier_data_report_delete_query, [id])
            return res.send('Campaign deleted successfully')
        }
        catch (err) {
            console.log(err)
            return res.status(500).json('Server Error Contact Admin!')
        }


    }
    else {
        return res.status(406).json('Invalid Access')
    }
}


export const editcampaign = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        //// console.log(req.body)
        let { camp_id, campaign_name, start_date, end_date, camp_type, planned_impressions, planned_cpm, planned_clicks, planned_cpc, planned_video_views, planned_cpv, planned_complete_video_views, planned_cpcv, ctr, reach, planned_budget, main_access, summary_access, report_access,  detailedSectionAccess, client_id } = req.body
        planned_impressions = planned_impressions === '' ? 0 : planned_impressions
        planned_cpm = planned_cpm === '' ? 0 : planned_cpm
        planned_clicks = planned_clicks === '' ? 0 : planned_clicks
        planned_cpc = planned_cpc === '' ? 0 : planned_cpc
        planned_video_views = planned_video_views === '' ? 0 : planned_video_views
        planned_cpv = planned_cpv === '' ? 0 : planned_cpv,
            planned_complete_video_views = planned_complete_video_views === '' ? 0 : planned_complete_video_views
        planned_cpcv = planned_cpcv === '' ? 0 : planned_cpcv
        ctr = ctr === '' ? 0 : ctr
        reach = reach === '' ? 0 : reach
        planned_budget = planned_budget === '' ? 0 : planned_budget
        const accsessOptMain = main_access.join(',')
        const accsessOptSummary = summary_access.join(',')
        const accsessOptReport = report_access.join(',')
        const check_campaing_query = 'select camp_id from bannercampaigns where campaign_name=? and client_id=? and camp_id!=? union  select camp_id from videocampaigns where  campaign_name=? and client_id=? and camp_id!=?;'
        const check_campaing_values = [campaign_name, client_id, camp_id, campaign_name, client_id, camp_id]
        db.query(check_campaing_query, check_campaing_values, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('Server Error Contact Admin!')
            }
            else {
                if (result.length == 0) {
                    let update_campaign_query, update_campaign_values;
                    if (camp_type === 'banner') {
                        update_campaign_query = 'update bannercampaigns set campaign_name=?, start_date=?, end_date=?, planned_impressions=?, planned_cpm=?, planned_clicks=?, planned_cpc=?, ctr=?, reach=?, planned_budget=?, main_access=?, summary_access=?, report_access=? where camp_id=? and client_id=?;'
                        update_campaign_values = [campaign_name, start_date, end_date, planned_impressions, planned_cpm, planned_clicks, planned_cpc, ctr, reach, planned_budget, accsessOptMain, accsessOptSummary, accsessOptReport, camp_id, client_id]

                    }
                    else {
                        const apps_and_urls_access = detailedSectionAccess['Apps And Urls Access'].join(',')
                        update_campaign_query = 'update videocampaigns set campaign_name=?, start_date=?, end_date=?, planned_impressions=?, planned_cpm=?, planned_clicks=?, planned_cpc=?, planned_video_views=?, planned_cpv=?, planned_complete_video_views=?, planned_cpcv=?, ctr=?, reach=?, planned_budget=?, main_access=?, summary_access=?, report_access=?, apps_and_urls_access =? where camp_id=? and client_id=?;'
                        update_campaign_values = [campaign_name, start_date, end_date, planned_impressions, planned_cpm, planned_clicks, planned_cpc, planned_video_views, planned_cpv, planned_complete_video_views, planned_cpcv, ctr, reach, planned_budget, accsessOptMain, accsessOptSummary, accsessOptReport, apps_and_urls_access, camp_id, client_id]
                    }

                    //const update_campaign_report = 'update reportdetails set campaign_name=? where camp_id=? and client_id=?'
                    try {
                        await db.promise().query(update_campaign_query, update_campaign_values)
                        //await db.promise().query(update_campaign_report,[campaign_name,camp_id, client_id])
                        return res.send('Campaign details updated successfully')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('Server Error Contact Admin!')
                    }
                }
                else {
                    return res.status(500).json('Campaign Name already exists!')
                }

            }

        })

    }
    else {
        return res.status(406).json('Invalid Access')
    }

}