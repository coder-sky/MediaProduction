import db from "../config/mysqlconnection.js"


export const campaigns = (req, res) => {
    //// console.log(req.checkAuth)
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'user')) {
        const { id } = req.params
        // console.log(id)
        const getcampaigns_query = 'select camp_id, campaign_name, start_date, end_date, camp_type from bannercampaigns where client_id=? union  select camp_id, campaign_name, start_date, end_date, camp_type from videocampaigns where client_id=?'//'select camp_id, campaign_name, start_date, end_date, camp_based_on, planned_cpm, planned_cpc, planned_cps from campaigndetails where client_id=?;'
        const getcampaigns_value = [id, id]
        db.query(getcampaigns_query, getcampaigns_value, (err, result) => {
            if (err) {
                // console.log(err)
                return res.status(500).json('Server Error Contact Admin!')
            }
            else {
                return res.send(result)
            }
        })


    }
    else {
        return res.status(406).json('Invalid Access')
    }
    //res.send('ok')
}

export const addreport = async (req, res) => {
    const columnNames = {
        daily: { excelColumns: ['Date', 'Impressions', 'Clicks', 'Reach', 'Cost', 'Video Views', '25% Video Views', '50% Video Views', '75% Video Views', 'Complete Video Views',], dbColumns: ['date', 'impressions', 'clicks', 'reach', 'cost', 'video_views', `25%_video Views`, `50%_video_views`, `75%_video_views`, 'complete_video_views',] },
        'apps_and_urls': { excelColumns: ['Apps & URLs', 'Impressions', 'Clicks',], dbColumns: ['apps_and_urls', 'impressions', 'clicks',] },
        age: { excelColumns: ['Age', 'Impressions', 'Clicks',], dbColumns: ['age', 'impressions', 'clicks',] },
        gender: { excelColumns: ['Gender', 'Impressions', 'Clicks',], dbColumns: ['gender', 'impressions', 'clicks',] },
        city: { excelColumns: ['City', 'Impressions', 'Clicks',], dbColumns: ['city', 'impressions', 'clicks',] },
        creative: { excelColumns: ['Creative', 'Impressions', 'Clicks',], dbColumns: ['creative', 'impressions', 'clicks',] },
        device: { excelColumns: ['Device', 'Impressions', 'Clicks',], dbColumns: ['device', 'impressions', 'clicks',] },
        'isp_or_carrier': { excelColumns: ['ISP or Carrier', 'Impressions', 'Clicks',], dbColumns: ['isp_or_carrier', 'impressions', 'clicks',] }
    }
    const nameConv = {
        'Date': 'date',
        'Impressions': 'impressions',
        'Clicks': 'clicks',
        'Reach': 'reach',
        'Cost': 'cost',
        'Video Views': 'video_views',
        '25% Video Views': '`25%_video_views`',
        '50% Video Views': ' `50%_video_views`',
        '75% Video Views': '`75%_video_views`',
        'Complete Video Views': 'complete_video_views',
        'Apps & URLs': 'apps_and_urls',
        'Age': 'age',
        'Gender': 'gender',
        'City': 'city',
        'Creative': 'creative',
        'Device': 'device',
        'ISP or Carrier': 'isp_or_carrier'


    }

    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'user')) {
        // console.log(req.body, req.params.action)
        const action = req.params.action
        let { client_name, campaign_name, camp_type, uploadDataType, date, excelData } = req.body
        const clientName = client_name.clientName
        const clientId = client_name.id
        const campaignName = campaign_name.campaignName;
        const campaignId = campaign_name.campId;

        if (excelData.length === 0) return res.status(406).josn('Excel file is empty!')
        let insert_record_query, insert_record_values;
        switch (uploadDataType) {
            case 'daily':
                if (camp_type === 'banner') {
                    insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, camp_type, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')},ctr,cpm, cpc,  camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                    //console.log(date, new Date(excelData[0]['Date']).toLocaleString('en-CA').slice(0,10))
                    //excelData[0]['Date'] = date
                    excelData = excelData.map(data => ({ ...data, Date: new Date(data['Date']).toLocaleString('en-CA').slice(0, 10), }))
                    insert_record_values = excelData.map(data => [clientName, campaignName, camp_type, ...Object.values(data),
                        isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)),
                        isNaN(Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2))) || !isFinite(Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2))) ? 0.00 : Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2)),
                        isNaN(Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2))) || !isFinite(Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2))) ? 0.00 : Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2)),
                        campaignId, clientId])
                    //console.log(excelData, insert_record_values)

                }
                else {
                    insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, camp_type, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')},ctr,cpm, cpc,cpv, cpcv, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                    excelData = excelData.map(data => ({ ...data, Date: new Date(data['Date']).toLocaleString('en-CA').slice(0, 10), }))
                    insert_record_values = excelData.map(data => [clientName, campaignName, camp_type, ...Object.values(data),
                        isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)),
                        isNaN(Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2))) || !isFinite(Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2))) ? 0.00 : Number(((Number(data['Cost']) / Number(data['Impressions'])) * 1000).toFixed(2)),
                        isNaN(Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2))) || !isFinite(Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2))) ? 0.00 : Number((Number(data['Cost']) / Number(data['Clicks'])).toFixed(2)),
                        isNaN(Number((Number(data['Cost']) / Number(data['Video Views'])).toFixed(2))) || !isFinite(Number((Number(data['Cost']) / Number(data['Video Views'])).toFixed(2))) ? 0.00 : Number((Number(data['Cost']) / Number(data['Video Views'])).toFixed(2)),
                        isNaN(Number((Number(data['Cost']) / Number(data['Complete Video Views'])).toFixed(2))) || !isFinite(Number((Number(data['Cost']) / Number(data['Complete Video Views'])).toFixed(2))) ? 0.00 : Number((Number(data['Cost']) / Number(data['Complete Video Views'])).toFixed(2)),
                        campaignId, clientId])

                }
                break
            case 'apps_and_urls':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, ctr, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)), campaignId, clientId])
                break
            case 'age':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, ctr, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)), campaignId, clientId])
                // console.log(insert_record_query, insert_record_values)
                break
            case 'gender':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, ctr, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)), campaignId, clientId])
                break
            case 'city':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')},camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), campaignId, clientId])
                break
            case 'device':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, ctr, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)), campaignId, clientId])
                break
            case 'creative':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, ctr, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), isNaN(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) || !isFinite(Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2))) ? 0.00 : Number(((Number(data['Clicks']) / Number(data['Impressions'])) * 100).toFixed(2)), campaignId, clientId])
                break
            case 'isp_or_carrier':
                insert_record_query = `insert into ${uploadDataType}_data_report (client_name, campaign_name, ${Object.keys(excelData[0]).map(key => nameConv[key]).join(',')}, camp_id, client_id) values${excelData.map(_ => '(?)').join(',')}`;
                insert_record_values = excelData.map(data => [clientName, campaignName, ...Object.values(data), campaignId, clientId])
                break

        }

        if (action === 'upload') {
            const check_data_existance_query = `select * from ${uploadDataType}_data_report where client_name=? and client_id=? and campaign_name=? and camp_id=? limit 1;` // ${uploadDataType === 'daily' ? ['date=?', 'client_name=?', 'client_id=?', 'campaign_name=?', 'camp_id=?'].join(' and ') : ['client_name=?', 'client_id=?', 'campaign_name=?', 'camp_id=?'].join(' and ')} limit 1;`
            const check_data_existance_values = [clientName, clientId, campaignName, campaignId]//uploadDataType === 'daily' ? [date, clientName, clientId, campaignName, campaignId] : [clientName, clientId, campaignName, campaignId]
            db.query(check_data_existance_query, check_data_existance_values, async (err, result) => {
                if (err) {
                    console.log(err)

                    return res.status(500).json('Server Error Contact Admin!')
                }
                else {

                    if (result.length === 0) {
                        try {
                            await db.promise().query(insert_record_query, insert_record_values)
                            return res.send('Record added successfully')
                        }
                        catch (err) {
                            console.log(err)
                            if (err.errno === 1265) {
                                return res.status(406).json('Uploded excel file not containing the proper data/format')
                            }
                            return res.status(500).json('Server Error Contact Admin!')

                        }
                    }
                    else {
                        return res.status(406).json('Record already exists!')
                    }

                }
            })

        }
        else {
            let delete_existing_record_query, delete_existing_record_values;
            // if (uploadDataType === 'daily') {
            //     delete_existing_record_query = `delete from ${uploadDataType}_data_report where date=? and client_name=? and campaign_name=? and client_id=? and camp_id=?`
            //     delete_existing_record_values = [date, clientName, campaignName, clientId, campaignId]
            // }
            // else {
            delete_existing_record_query = `delete from ${uploadDataType}_data_report where client_name=? and campaign_name=? and client_id=? and camp_id=?`
            delete_existing_record_values = [clientName, campaignName, clientId, campaignId]
            //}

            try {
                await db.promise().query(delete_existing_record_query, delete_existing_record_values)
                await db.promise().query(insert_record_query, insert_record_values)
                return res.send('Record updated successfully')
            }

            catch (err) {
                console.log(err)
                if (err.errno === 1265) {
                    return res.status(406).josn('Uploded excel file not containing the proper data/format')
                }
                return res.status(500).json('Server Error Contact Admin!')

            }

        }

    }
    else {
        return res.status(406).json('Invalid Access')
    }
}

export const reports = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {

        const get_daily_report_query = 'select * from daily_data_report order by sr_no desc limit 500'
        const get_age_report_query = 'select * from age_data_report order by sr_no desc limit 500'
        const get_app_and_urls_report_query = 'select * from apps_and_urls_data_report order by sr_no desc limit 500'
        const get_city_report_query = 'select * from city_data_report order by sr_no desc limit 500'
        const get_creative_report_query = 'select * from creative_data_report order by sr_no desc limit 500'
        const get_device_report_query = 'select * from device_data_report order by sr_no desc limit 500'
        const get_gender_report_query = 'select * from gender_data_report order by sr_no desc limit 500'
        const get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report order by sr_no desc limit 500'
        const daily_report = await db.promise().query(get_daily_report_query)
        const age_report = await db.promise().query(get_age_report_query)
        const apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query)
        const city_report = await db.promise().query(get_city_report_query)
        const creative_report = await db.promise().query(get_creative_report_query)
        const device_report = await db.promise().query(get_device_report_query)
        const gender_report = await db.promise().query(get_gender_report_query)
        const isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query)
        //// console.log('data',age_report[0], city_report[0])
        const wholeReport = {
            daily_report: { data: daily_report[0].map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-CA'), ctr: `${d.ctr}%` })), columns: Object.keys(daily_report[0].length === 0 ? [] : daily_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            age_report: { data: age_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(age_report[0].length === 0 ? [] : age_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            apps_and_urls_report: { data: apps_and_urls_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(apps_and_urls_report[0].length === 0 ? [] : apps_and_urls_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            city_report: { data: city_report[0], columns: Object.keys(city_report[0].length === 0 ? [] : city_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            creative_report: { data: creative_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(creative_report[0].length === 0 ? [] : creative_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            device_report: { data: device_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(device_report[0].length === 0 ? [] : device_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            gender_report: { data: gender_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(gender_report[0].length === 0 ? [] : gender_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            isp_or_carrier_report: { data: isp_or_carrier_report[0], columns: Object.keys(isp_or_carrier_report[0].length === 0 ? [] : isp_or_carrier_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) }

        }
        return res.send(wholeReport)


    }
    else {
        return res.status(406).json('Invalid Access')
    }

}

export const searchreports = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        //// console.log(req.query)
        let { clientName, campaignName, fromDate, toDate } = req.query
        const clientId = clientName.id
        clientName = clientName.clientName
        const campaignId = campaignName.campId
        campaignName = campaignName.campaignName


        let get_daily_report_query, get_age_report_query, get_app_and_urls_report_query, get_city_report_query, get_creative_report_query, get_device_report_query, get_gender_report_query, get_isp_or_carrier_report_query, query, query_values;
        let daily_report, age_report, apps_and_urls_report, city_report, creative_report, device_report, gender_report, isp_or_carrier_report;

        if (clientName === 'All' && campaignName === 'All' && (fromDate === '' || toDate === '')) {
            query = 'select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id order by date desc limit 500;'
            get_daily_report_query = 'select * from daily_data_report order by sr_no desc limit 500'
            get_age_report_query = 'select * from age_data_report order by sr_no desc limit 500'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report order by sr_no desc limit 500'
            get_city_report_query = 'select * from city_data_report order by sr_no desc limit 500'
            get_creative_report_query = 'select * from creative_data_report order by sr_no desc limit 500'
            get_device_report_query = 'select * from device_data_report order by sr_no desc limit 500'
            get_gender_report_query = 'select * from gender_data_report order by sr_no desc limit 500'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report order by sr_no desc limit 500'
            daily_report = await db.promise().query(get_daily_report_query)
            age_report = await db.promise().query(get_age_report_query)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query)
            city_report = await db.promise().query(get_city_report_query)
            creative_report = await db.promise().query(get_creative_report_query)
            device_report = await db.promise().query(get_device_report_query)
            gender_report = await db.promise().query(get_gender_report_query)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query)
        }
        else if (clientName === 'All' && campaignName === 'All' && fromDate !== '' && toDate !== '') {
            query = `select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id where date>='${fromDate}' and date<='${toDate}' order by date desc;`
            get_daily_report_query = 'select * from daily_data_report where date>=? and date<=? order by campaign_name,sr_no desc'
            daily_report = await db.promise().query(get_daily_report_query, [fromDate, toDate])
            const camp_list = Array.from(new Set(daily_report[0].map(camp => camp.camp_id)))
            get_age_report_query = 'select * from age_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_city_report_query = 'select * from city_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_creative_report_query = 'select * from creative_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_device_report_query = 'select * from device_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_gender_report_query = 'select * from gender_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            query_values = [['never_exists', ...camp_list]]

            age_report = await db.promise().query(get_age_report_query, query_values)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
            city_report = await db.promise().query(get_city_report_query, query_values)
            creative_report = await db.promise().query(get_creative_report_query, query_values)
            device_report = await db.promise().query(get_device_report_query, query_values)
            gender_report = await db.promise().query(get_gender_report_query, query_values)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)



        }
        else if (clientName !== 'All' && campaignName === 'All' && (fromDate === '' || toDate === '')) {
            query = `select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id where reportdetails.client_name='${clientName}' order by date desc;`
            get_daily_report_query = 'select * from daily_data_report where client_id=? order by campaign_name,sr_no desc'
            get_age_report_query = 'select * from age_data_report where client_id=? order by campaign_name,sr_no desc'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report where client_id=? order by campaign_name,sr_no desc'
            get_city_report_query = 'select * from city_data_report where client_id=? order by campaign_name,sr_no desc'
            get_creative_report_query = 'select * from creative_data_report where client_id=? order by campaign_name,sr_no desc'
            get_device_report_query = 'select * from device_data_report where client_id=? order by campaign_name,sr_no desc'
            get_gender_report_query = 'select * from gender_data_report where client_id=? order by campaign_name,sr_no desc'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where client_id=? order by campaign_name,sr_no desc'
            query_values = [clientId]
            daily_report = await db.promise().query(get_daily_report_query, query_values)
            age_report = await db.promise().query(get_age_report_query, query_values)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
            city_report = await db.promise().query(get_city_report_query, query_values)
            creative_report = await db.promise().query(get_creative_report_query, query_values)
            device_report = await db.promise().query(get_device_report_query, query_values)
            gender_report = await db.promise().query(get_gender_report_query, query_values)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)
        }
        else if (clientName !== 'All' && campaignName === 'All' && fromDate !== '' && toDate !== '') {
            query = `select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id where reportdetails.client_name='${clientName}' and date>='${fromDate}' and date<='${toDate}' order by date desc ;`
            get_daily_report_query = 'select * from daily_data_report where client_id=? and date>=? and date<=? order by campaign_name,sr_no desc'
            daily_report = await db.promise().query(get_daily_report_query, [clientId, fromDate, toDate])
            // console.log('x', Array.from(new Set(daily_report[0].map(camp => camp.camp_id))))
            const camp_list = Array.from(new Set(daily_report[0].map(camp => camp.camp_id)))
            get_age_report_query = 'select * from age_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_city_report_query = 'select * from city_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_creative_report_query = 'select * from creative_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_device_report_query = 'select * from device_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_gender_report_query = 'select * from gender_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            query_values = [['never_exists', ...camp_list]]

            age_report = await db.promise().query(get_age_report_query, query_values)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
            city_report = await db.promise().query(get_city_report_query, query_values)
            creative_report = await db.promise().query(get_creative_report_query, query_values)
            device_report = await db.promise().query(get_device_report_query, query_values)
            gender_report = await db.promise().query(get_gender_report_query, query_values)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)
        }
        else if (clientName !== 'All' && campaignName !== 'All' && (fromDate === '' || toDate === '')) {
            query = `select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on, selected_camp_opt, planned_budget_impressions, planned_budget_clicks, planned_budget_sessions from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id where binary reportdetails.client_name='${clientName}' and binary reportdetails.campaign_name='${campaignName}' order by date desc;`
            get_daily_report_query = 'select * from daily_data_report where client_id=? and camp_id=? order by date desc'
            get_age_report_query = 'select * from age_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_city_report_query = 'select * from city_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_creative_report_query = 'select * from creative_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_device_report_query = 'select * from device_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_gender_report_query = 'select * from gender_data_report where client_id=? and camp_id=? order by sr_no desc'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where client_id=? and camp_id=? order by sr_no desc'
            query_values = [clientId, campaignId]
            daily_report = await db.promise().query(get_daily_report_query, query_values)
            age_report = await db.promise().query(get_age_report_query, query_values)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
            city_report = await db.promise().query(get_city_report_query, query_values)
            creative_report = await db.promise().query(get_creative_report_query, query_values)
            device_report = await db.promise().query(get_device_report_query, query_values)
            gender_report = await db.promise().query(get_gender_report_query, query_values)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)
        }
        else if (clientName !== 'All' && campaignName !== 'All' && fromDate !== '' && toDate !== '') {
            query = `select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, start_date, end_date, camp_based_on, selected_camp_opt, planned_budget_impressions, planned_budget_clicks, planned_budget_sessions from reportdetails inner join campaigndetails on reportdetails.camp_id = campaigndetails.camp_id where binary reportdetails.client_name='${clientName}' and binary reportdetails.campaign_name='${campaignName}' and date>='${fromDate}' and date<='${toDate}' order by date desc;`
            get_daily_report_query = 'select * from daily_data_report where client_id=? and camp_id=? and date>=? and date<=? order by campaign_name,sr_no desc'
            daily_report = await db.promise().query(get_daily_report_query, [clientId, campaignId, fromDate, toDate])
            //// console.log('x', daily_report[0])
            const camp_list = Array.from(new Set(daily_report[0].map(camp => camp.camp_id)))
            get_age_report_query = 'select * from age_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_app_and_urls_report_query = 'select * from apps_and_urls_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_city_report_query = 'select * from city_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_creative_report_query = 'select * from creative_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_device_report_query = 'select * from device_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_gender_report_query = 'select * from gender_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where camp_id in(?) order by campaign_name,sr_no desc'
            query_values = [['never_exists', ...camp_list]]

            age_report = await db.promise().query(get_age_report_query, query_values)
            apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
            city_report = await db.promise().query(get_city_report_query, query_values)
            creative_report = await db.promise().query(get_creative_report_query, query_values)
            device_report = await db.promise().query(get_device_report_query, query_values)
            gender_report = await db.promise().query(get_gender_report_query, query_values)
            isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)
        }


        const wholeReport = {
            daily_report: { data: daily_report[0].map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-CA'), ctr: `${d.ctr}%` })), columns: Object.keys(daily_report[0].length === 0 ? [] : daily_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            age_report: { data: age_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(age_report[0].length === 0 ? [] : age_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            apps_and_urls_report: { data: apps_and_urls_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(apps_and_urls_report[0].length === 0 ? [] : apps_and_urls_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            city_report: { data: city_report[0], columns: Object.keys(city_report[0].length === 0 ? [] : city_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            creative_report: { data: creative_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(creative_report[0].length === 0 ? [] : creative_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            device_report: { data: device_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(device_report[0].length === 0 ? [] : device_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            gender_report: { data: gender_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(gender_report[0].length === 0 ? [] : gender_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) },
            isp_or_carrier_report: { data: isp_or_carrier_report[0], columns: Object.keys(isp_or_carrier_report[0].length === 0 ? [] : isp_or_carrier_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_id',].includes(col)) }

        }
        return res.send(wholeReport)


    }
    else {
        return res.status(406).json('Invalid Access')
    }
}

export const deletecampaignrecord = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        //// console.log(req.query)
        const { id, camp_id } = req.query
        try {
            const delete_record_query = 'delete from reportdetails where id=? and camp_id=?'
            await db.promise().query(delete_record_query, [id, camp_id])
            return res.send('Record deleted successfully')

        }
        catch (err) {
            return res.status(500).json('Server Error Contact Admin!')
        }

    }
    else {
        return res.status(406).json('Invalid Access')
    }
}

export const editcampaignreport = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        // console.log(req.body)
        const updatationValuesCheck = ['impressions', 'cpm', 'clicks', 'cpc', 'sessions', 'cps', 'ctr', 'total_cpm', 'total_cpc', 'total_cps',]
        const updationKeys = Object.keys(req.body).filter(k => updatationValuesCheck.includes(k))
        const updationValues = updationKeys.map(k => req.body[k])
        let { id, camp_id, campaign_name, state, city, date, } = req.body
        try {
            state = state.state
            city = city.city
            const check_record_query = 'select * from reportdetails where date=? and state=? and city=? and id!=?'
            const check_record_values = [date, state, city, id]
            db.query(check_record_query, check_record_values, async (err, result) => {
                if (err) {
                    // console.log(err)
                    return res.status(500).json('Server Error Contact Admin!')
                }
                else {
                    if (result.length === 0) {
                        try {
                            //const update_record_query = 'update reportdetails set state=?, city=?, date=?, impressions=?, cpm=?, clicks=?, cpc=?, sessions=?, cps=?, ctr=?, total_cpm=?, total_cpc=?, total_cps=? where id=? and camp_id=? and campaign_name=?'
                            const subStringQuery = updationKeys.join('=?, ')
                            const update_record_query = `update reportdetails set state=?, city=?, date=?, ${subStringQuery}=? where id=? and camp_id=? and campaign_name=?`
                            const update_record_values = [state, city, date, ...updationValues, id, camp_id, campaign_name]
                            await db.promise().query(update_record_query, update_record_values)
                            return res.send('Record updated successfully')
                        }
                        catch (err) {
                            // console.log(err)
                            return res.status(500).json('Server Error Contact Admin!')
                        }

                    }
                    else {
                        return res.status(406).json('Record already exists in selected campaign')
                    }
                }
            })

        }
        catch (err) {
            return res.status(500).json('Server Error Contact Admin!')
        }
    }
    else {
        return res.status(406).json('Invalid Access')
    }

}


const summaryViewInsights = ['impressions', 'clicks', 'video_views', 'complete_video_views', 'cpm', 'cpc', 'cpv', 'cpcv', 'ctr', 'cost', 'reach',]

export const clientdashboard = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'client')) {
        // console.log('came', req.query)
        try {
            const { client_id } = req.query

            const campaigns_query = 'select camp_id, campaign_name, start_date, end_date, camp_type from bannercampaigns where client_id=? union  select camp_id, campaign_name, start_date, end_date, camp_type from videocampaigns where client_id=? order by start_date desc;'
            const campaignsResult = await db.promise().query(campaigns_query, [client_id, client_id])
            const campaigns = campaignsResult[0]
            const mostRecentCamp = campaigns.length === 0 ? '' : campaigns[0]
            // console.log(campaigns, mostRecentCamp)

            let tableView = {
                insights: {},
                tableData: []
            }
            let detailedView = {
                age_report: { data: [] },
                apps_and_urls_report: { data: [] },
                city_report: { data: [] },
                creative_report: { data: [] },
                device_report: { data: [] },
                gender_report: { data: [] },
                isp_or_carrier_report: { data: [] }
            }
            let mainAccess = []
            let selectedCamp;
            if (mostRecentCamp === '') {
                selectedCamp = { camp_id: 'not exists', campaign_name: '' }
                tableView = {
                    insights: {},
                    tableData: []
                }
                detailedView = {
                    age_report: { data: [] },
                    apps_and_urls_report: { data: [] },
                    city_report: { data: [] },
                    creative_report: { data: [] },
                    device_report: { data: [] },
                    gender_report: { data: [] },
                    isp_or_carrier_report: { data: [] }
                }


            }
            else {
                selectedCamp = mostRecentCamp
                const camp_info_query = `select * from ${mostRecentCamp['camp_type']}campaigns where camp_id = ?`
                let infoResult = await db.promise().query(camp_info_query, [mostRecentCamp['camp_id']])
                infoResult = infoResult[0][0]
                const { camp_type, main_access, summary_access, report_access, apps_and_urls_access } = infoResult
                const accessTypes = ['table view', 'graph view', 'detailed view']
                const mainAccessTypes = main_access.split(',').filter(view => view !== '')
                mainAccess = accessTypes.filter(type => mainAccessTypes.includes(type)) //order wise

                let get_daily_report_query, get_age_report_query, get_app_and_urls_report_query, get_city_report_query, get_creative_report_query, get_device_report_query, get_gender_report_query, get_isp_or_carrier_report_query, query_values;

                if (mainAccess.length === 0) {
                    tableView = {
                        insights: {},
                        tableData: []
                    }
                }
                if (mainAccess.includes('table view') || mainAccess.includes('graph view')) {
                    const tableViewCol = ['date', ...report_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const table_query= `select ${tableViewCol}  from daily_data_report where client_id=? and camp_id=? order by date`
                    const table_query_values = [client_id, mostRecentCamp['camp_id']]
                    const table_report = await db.promise().query(table_query, table_query_values)

                    const col = ['date', ...summary_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const accessibleFields = summary_access.split(',').filter(col => col !== '').map(col => col.split(' ').join('_'))
                    const checkInsights = summaryViewInsights.filter(insights => accessibleFields.includes(insights))

                    get_daily_report_query = `select ${col}  from daily_data_report where client_id=? and camp_id=? order by date`
                    query_values = [client_id, mostRecentCamp['camp_id']]
                    const daily_report = await db.promise().query(get_daily_report_query, query_values)

                    

                    const impressions = daily_report[0].reduce((acc, curr) => acc + curr['impressions'], 0)
                    const clicks = daily_report[0].reduce((acc, curr) => acc + curr['clicks'], 0)
                    const cost = daily_report[0].reduce((acc, curr) => acc + curr['cost'], 0)
                    const video_views = daily_report[0].reduce((acc, curr) => acc + curr['video_views'], 0)
                    const complete_video_views = daily_report[0].reduce((acc, curr) => acc + curr['complete_video_views'], 0)
                    const plannedData = {}
                    checkInsights.forEach(ins => {
                        if (['impressions', 'clicks', 'video_views', 'complete_video_views', 'cost'].includes(ins)) {
                            plannedData[ins] = { planned: infoResult['planned_' + (ins === 'cost' ? 'budget' : ins)], actual: daily_report[0].reduce((acc, cur) => acc + cur[ins], 0) }
                        }
                        else {


                            if (ins === 'cpm') {
                                plannedData[ins] = { planned: infoResult['planned_cpm'], actual: isNaN(Number(((cost / impressions )* 1000).toFixed(2))) ? 0 : Number(((cost / impressions) * 1000).toFixed(2)) }
                            }
                            else if (ins === 'cpc') {
                                plannedData[ins] = { planned: infoResult['planned_cpc'], actual: isNaN(Number((cost / clicks).toFixed(2))) ? 0 : Number((cost / clicks).toFixed(2)) }
                            }
                            else if (ins === 'cpv') {
                                plannedData[ins] = { planned: infoResult['planned_cpv'], actual: isNaN(Number((cost / video_views).toFixed(2))) ? 0 : Number((cost / video_views).toFixed(2)) }
                            }
                            else if (ins === 'cpcv') {
                                plannedData[ins] = { planned: infoResult['planned_cpcv'], actual: isNaN(Number((cost / complete_video_views).toFixed(2))) ? 0 : Number((cost / complete_video_views).toFixed(2)) }
                            }
                            else if (ins === 'ctr') {
                                plannedData[ins] = { planned: `${infoResult['ctr']}%`, actual: `${isNaN(Number(((clicks / impressions) * 100).toFixed(2))) ? 0 : Number(((clicks / impressions) * 100).toFixed(2))}%` }
                            }
                            else if (ins === 'reach') {
                                plannedData[ins] = { planned: undefined, actual: infoResult['reach'] }
                            }
                        }

                    })

                    tableView = {
                        insights: plannedData,
                        tableData: tableViewCol.includes('ctr') ? table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA'), ctr: `${data.ctr}%` })) : table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA') }))
                    }

                }

                if (mainAccess.includes('detailed view')) {
                    let age_report, apps_and_urls_report, city_report, creative_report, device_report, gender_report, isp_or_carrier_report;

                    const apps_and_urls_col = camp_type === 'banner' ? ['apps_and_urls', 'impressions', 'clicks', 'ctr'] : ['apps_and_urls', ...apps_and_urls_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    get_age_report_query = 'select * from age_data_report where client_id=? and camp_id=? order by sr_no'
                    get_app_and_urls_report_query = `select  ${apps_and_urls_col} from apps_and_urls_data_report where client_id=? and camp_id=? order by sr_no`
                    get_city_report_query = 'select * from city_data_report where client_id=? and camp_id=? order by sr_no'
                    get_creative_report_query = 'select * from creative_data_report where client_id=? and camp_id=? order by sr_no'
                    get_device_report_query = 'select * from device_data_report where client_id=? and camp_id=? order by sr_no'
                    get_gender_report_query = 'select * from gender_data_report where client_id=? and camp_id=? order by sr_no'
                    get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where client_id=? and camp_id=? order by sr_no'
                    query_values = [client_id, mostRecentCamp['camp_id']]

                    age_report = await db.promise().query(get_age_report_query, query_values)
                    apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
                    city_report = await db.promise().query(get_city_report_query, query_values)
                    creative_report = await db.promise().query(get_creative_report_query, query_values)
                    device_report = await db.promise().query(get_device_report_query, query_values)
                    gender_report = await db.promise().query(get_gender_report_query, query_values)
                    isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)

                    detailedView = {
                        age_report: { data: age_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(age_report[0].length === 0 ? [] : age_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        apps_and_urls_report: { data: apps_and_urls_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(apps_and_urls_report[0].length === 0 ? [] : apps_and_urls_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        city_report: { data: city_report[0], columns: Object.keys(city_report[0].length === 0 ? [] : city_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        creative_report: { data: creative_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(creative_report[0].length === 0 ? [] : creative_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        device_report: { data: device_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(device_report[0].length === 0 ? [] : device_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        gender_report: { data: gender_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(gender_report[0].length === 0 ? [] : gender_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        isp_or_carrier_report: { data: isp_or_carrier_report[0], columns: Object.keys(isp_or_carrier_report[0].length === 0 ? [] : isp_or_carrier_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) }
                    }

                }

            }
            return res.status(200).json({ campaigns: campaigns, tableView: tableView, detailedView: detailedView, selectedCamp: selectedCamp, mainAccess })

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

export const campaigninfo = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    // console.log(req.query)
    if (isAuth && role === 'client') {
        try {
            const { client_id, campaign } = req.query
            // console.log(client_id, campaign)

            const { camp_id, camp_type } = campaign

            let tableView = {
                insights: {},
                tableData: []
            }
            let detailedView = {
                age_report: { data: [] },
                apps_and_urls_report: { data: [] },
                city_report: { data: [] },
                creative_report: { data: [] },
                device_report: { data: [] },
                gender_report: { data: [] },
                isp_or_carrier_report: { data: [] }
            }
            let mainAccess = []


            const camp_info_query = `select * from ${camp_type}campaigns where camp_id = ?`
            let infoResult = await db.promise().query(camp_info_query, [camp_id])
            if(infoResult[0].length!==0){
                infoResult = infoResult[0][0]
                const { camp_type, main_access, summary_access, report_access, apps_and_urls_access } = infoResult
                const accessTypes = ['table view', 'graph view', 'detailed view']
                const mainAccessTypes = main_access.split(',').filter(view => view !== '')
                mainAccess = accessTypes.filter(type => mainAccessTypes.includes(type)) //order wise

                let get_daily_report_query, get_age_report_query, get_app_and_urls_report_query, get_city_report_query, get_creative_report_query, get_device_report_query, get_gender_report_query, get_isp_or_carrier_report_query, query_values;

                if (mainAccess.length === 0) {
                    tableView = {
                        insights: {},
                        tableData: []
                    }
                }
                if (mainAccess.includes('table view') || mainAccess.includes('graph view')) {
                    const tableViewCol = ['date', ...report_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const table_query= `select ${tableViewCol}  from daily_data_report where client_id=? and camp_id=? order by date`
                    const table_query_values = [client_id, camp_id]
                    const table_report = await db.promise().query(table_query, table_query_values)

                    const col = ['date', ...summary_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const accessibleFields = summary_access.split(',').filter(col => col !== '').map(col => col.split(' ').join('_'))
                    const checkInsights = summaryViewInsights.filter(insights => accessibleFields.includes(insights))

                    get_daily_report_query = `select ${col}  from daily_data_report where client_id=? and camp_id=? order by date`
                    query_values = [client_id, camp_id]
                    const daily_report = await db.promise().query(get_daily_report_query, query_values)

                    

                    const impressions = daily_report[0].reduce((acc, curr) => acc + curr['impressions'], 0)
                    const clicks = daily_report[0].reduce((acc, curr) => acc + curr['clicks'], 0)
                    const cost = daily_report[0].reduce((acc, curr) => acc + curr['cost'], 0)
                    const video_views = daily_report[0].reduce((acc, curr) => acc + curr['video_views'], 0)
                    const complete_video_views = daily_report[0].reduce((acc, curr) => acc + curr['complete_video_views'], 0)
                    const plannedData = {}
                    checkInsights.forEach(ins => {
                        if (['impressions', 'clicks', 'video_views', 'complete_video_views', 'cost'].includes(ins)) {
                            plannedData[ins] = { planned: infoResult['planned_' + (ins === 'cost' ? 'budget' : ins)], actual: daily_report[0].reduce((acc, cur) => acc + cur[ins], 0) }
                        }
                        else {


                            if (ins === 'cpm') {
                                plannedData[ins] = { planned: infoResult['planned_cpm'], actual: isNaN(Number(((cost / impressions )* 1000).toFixed(2))) ? 0 : Number(((cost / impressions) * 1000).toFixed(2)) }
                            }
                            else if (ins === 'cpc') {
                                plannedData[ins] = { planned: infoResult['planned_cpc'], actual: isNaN(Number((cost / clicks).toFixed(2))) ? 0 : Number((cost / clicks).toFixed(2)) }
                            }
                            else if (ins === 'cpv') {
                                plannedData[ins] = { planned: infoResult['planned_cpv'], actual: isNaN(Number((cost / video_views).toFixed(2))) ? 0 : Number((cost / video_views).toFixed(2)) }
                            }
                            else if (ins === 'cpcv') {
                                plannedData[ins] = { planned: infoResult['planned_cpcv'], actual: isNaN(Number((cost / complete_video_views).toFixed(2))) ? 0 : Number((cost / complete_video_views).toFixed(2)) }
                            }
                            else if (ins === 'ctr') {
                                plannedData[ins] = { planned: `${infoResult['ctr']}%`, actual: `${isNaN(Number(((clicks / impressions) * 100).toFixed(2))) ? 0 : Number(((clicks / impressions) * 100).toFixed(2))}%` }
                            }
                            else if (ins === 'reach') {
                                plannedData[ins] = { planned: undefined, actual: infoResult['reach'] }
                            }
                        }

                    })

                    tableView = {
                        insights: plannedData,
                        tableData: tableViewCol.includes('ctr') ? table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA'), ctr: `${data.ctr}%` })) : table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA') }))
                    }

                }

                if (mainAccess.includes('detailed view')) {
                    let age_report, apps_and_urls_report, city_report, creative_report, device_report, gender_report, isp_or_carrier_report;

                    const apps_and_urls_col = camp_type === 'banner' ? ['apps_and_urls', 'impressions', 'clicks', 'ctr'] : ['apps_and_urls', ...apps_and_urls_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    get_age_report_query = 'select * from age_data_report where client_id=? and camp_id=? order by sr_no'
                    get_app_and_urls_report_query = `select  ${apps_and_urls_col} from apps_and_urls_data_report where client_id=? and camp_id=? order by sr_no`
                    get_city_report_query = 'select * from city_data_report where client_id=? and camp_id=? order by sr_no'
                    get_creative_report_query = 'select * from creative_data_report where client_id=? and camp_id=? order by sr_no'
                    get_device_report_query = 'select * from device_data_report where client_id=? and camp_id=? order by sr_no'
                    get_gender_report_query = 'select * from gender_data_report where client_id=? and camp_id=? order by sr_no'
                    get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where client_id=? and camp_id=? order by sr_no'
                    query_values = [client_id, camp_id]

                    age_report = await db.promise().query(get_age_report_query, query_values)
                    apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
                    city_report = await db.promise().query(get_city_report_query, query_values)
                    creative_report = await db.promise().query(get_creative_report_query, query_values)
                    device_report = await db.promise().query(get_device_report_query, query_values)
                    gender_report = await db.promise().query(get_gender_report_query, query_values)
                    isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)

                    detailedView = {
                        age_report: { data: age_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(age_report[0].length === 0 ? [] : age_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        apps_and_urls_report: { data: apps_and_urls_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(apps_and_urls_report[0].length === 0 ? [] : apps_and_urls_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        city_report: { data: city_report[0], columns: Object.keys(city_report[0].length === 0 ? [] : city_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        creative_report: { data: creative_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(creative_report[0].length === 0 ? [] : creative_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        device_report: { data: device_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(device_report[0].length === 0 ? [] : device_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        gender_report: { data: gender_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(gender_report[0].length === 0 ? [] : gender_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        isp_or_carrier_report: { data: isp_or_carrier_report[0], columns: Object.keys(isp_or_carrier_report[0].length === 0 ? [] : isp_or_carrier_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) }
                    }

                }

            }
            return res.status(200).json({tableView: tableView, detailedView: detailedView, mainAccess })
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

export const searchcampaign = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'client')) {
        // console.log('came', req.query)
        try {
            const { campaign_name, from_date, to_date } = req.query
            const { camp_id, camp_type } = campaign_name

            const camp_info_query = `select * from ${camp_type}campaigns where camp_id = ?`
            let infoResult = await db.promise().query(camp_info_query, [camp_id])
            
            let tableView = {
                insights: {},
                tableData: []
            }
            let detailedView = {
                age_report: { data: [] },
                apps_and_urls_report: { data: [] },
                city_report: { data: [] },
                creative_report: { data: [] },
                device_report: { data: [] },
                gender_report: { data: [] },
                isp_or_carrier_report: { data: [] }
            }
            let mainAccess = []


            
            if(infoResult[0].length!==0){
                infoResult = infoResult[0][0]
                const { camp_type, main_access, summary_access, report_access, apps_and_urls_access, client_id } = infoResult
                const accessTypes = ['table view', 'graph view', 'detailed view']
                const mainAccessTypes = main_access.split(',').filter(view => view !== '')
                mainAccess = accessTypes.filter(type => mainAccessTypes.includes(type)) //order wise

                let get_daily_report_query, get_age_report_query, get_app_and_urls_report_query, get_city_report_query, get_creative_report_query, get_device_report_query, get_gender_report_query, get_isp_or_carrier_report_query, query_values;

                if (mainAccess.length === 0) {
                    tableView = {
                        insights: {},
                        tableData: []
                    }
                }
                if (mainAccess.includes('table view') || mainAccess.includes('graph view')) {
                    const tableViewCol = ['date', ...report_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const table_query= `select ${tableViewCol}  from daily_data_report where date>='${from_date}' and date<='${to_date}' and client_id=? and camp_id=? order by date`
                    const table_query_values = [client_id, camp_id]
                    const table_report = await db.promise().query(table_query, table_query_values)

                    const col = ['date', ...summary_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    const accessibleFields = summary_access.split(',').filter(col => col !== '').map(col => col.split(' ').join('_'))
                    const checkInsights = summaryViewInsights.filter(insights => accessibleFields.includes(insights))

                    get_daily_report_query = `select ${col}  from daily_data_report where date>='${from_date}' and date<='${to_date}' and client_id=? and camp_id=? order by date`
                    query_values = [client_id, camp_id]
                    const daily_report = await db.promise().query(get_daily_report_query, query_values)

                    const impressions = daily_report[0].reduce((acc, curr) => acc + curr['impressions'], 0)
                    const clicks = daily_report[0].reduce((acc, curr) => acc + curr['clicks'], 0)
                    const cost = daily_report[0].reduce((acc, curr) => acc + curr['cost'], 0)
                    const video_views = daily_report[0].reduce((acc, curr) => acc + curr['video_views'], 0)
                    const complete_video_views = daily_report[0].reduce((acc, curr) => acc + curr['complete_video_views'], 0)
                    const plannedData = {}
                    checkInsights.forEach(ins => {
                        if (['impressions', 'clicks', 'video_views', 'complete_video_views', 'cost'].includes(ins)) {
                            plannedData[ins] = { planned: infoResult['planned_' + (ins === 'cost' ? 'budget' : ins)], actual: daily_report[0].reduce((acc, cur) => acc + cur[ins], 0) }
                        }
                        else {


                            if (ins === 'cpm') {
                                plannedData[ins] = { planned: infoResult['planned_cpm'], actual: isNaN(Number(((cost / impressions )* 1000).toFixed(2))) ? 0 : Number(((cost / impressions) * 1000).toFixed(2)) }
                            }
                            else if (ins === 'cpc') {
                                plannedData[ins] = { planned: infoResult['planned_cpc'], actual: isNaN(Number((cost / clicks).toFixed(2))) ? 0 : Number((cost / clicks).toFixed(2)) }
                            }
                            else if (ins === 'cpv') {
                                plannedData[ins] = { planned: infoResult['planned_cpv'], actual: isNaN(Number((cost / video_views).toFixed(2))) ? 0 : Number((cost / video_views).toFixed(2)) }
                            }
                            else if (ins === 'cpcv') {
                                plannedData[ins] = { planned: infoResult['planned_cpcv'], actual: isNaN(Number((cost / complete_video_views).toFixed(2))) ? 0 : Number((cost / complete_video_views).toFixed(2)) }
                            }
                            else if (ins === 'ctr') {
                                plannedData[ins] = { planned: `${infoResult['ctr']}%`, actual: `${isNaN(Number(((clicks / impressions) * 100).toFixed(2))) ? 0 : Number(((clicks / impressions) * 100).toFixed(2))}%` }
                            }
                            else if (ins === 'reach') {
                                plannedData[ins] = { planned: undefined, actual: infoResult['reach'] }
                            }
                        }

                    })

                    tableView = {
                        insights: plannedData,
                        tableData: tableViewCol.includes('ctr') ? table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA'), ctr: `${data.ctr}%` })) : table_report[0].map(data => ({ ...data, date: new Date(data.date).toLocaleDateString('en-CA') }))
                    }

                }

                if (mainAccess.includes('detailed view')) {
                    let age_report, apps_and_urls_report, city_report, creative_report, device_report, gender_report, isp_or_carrier_report;

                    const apps_and_urls_col = camp_type === 'banner' ? ['apps_and_urls', 'impressions', 'clicks', 'ctr'] : ['apps_and_urls', ...apps_and_urls_access.split(',').filter(col => col !== '').map(col => `\`${col.split(' ').join('_')}\``)].join(',')
                    get_age_report_query = 'select * from age_data_report where client_id=? and camp_id=? order by sr_no'
                    get_app_and_urls_report_query = `select  ${apps_and_urls_col} from apps_and_urls_data_report where client_id=? and camp_id=? order by sr_no`
                    get_city_report_query = 'select * from city_data_report where client_id=? and camp_id=? order by sr_no'
                    get_creative_report_query = 'select * from creative_data_report where client_id=? and camp_id=? order by sr_no'
                    get_device_report_query = 'select * from device_data_report where client_id=? and camp_id=? order by sr_no'
                    get_gender_report_query = 'select * from gender_data_report where client_id=? and camp_id=? order by sr_no'
                    get_isp_or_carrier_report_query = 'select * from isp_or_carrier_data_report where client_id=? and camp_id=? order by sr_no'
                    query_values = [client_id, camp_id]

                    age_report = await db.promise().query(get_age_report_query, query_values)
                    apps_and_urls_report = await db.promise().query(get_app_and_urls_report_query, query_values)
                    city_report = await db.promise().query(get_city_report_query, query_values)
                    creative_report = await db.promise().query(get_creative_report_query, query_values)
                    device_report = await db.promise().query(get_device_report_query, query_values)
                    gender_report = await db.promise().query(get_gender_report_query, query_values)
                    isp_or_carrier_report = await db.promise().query(get_isp_or_carrier_report_query, query_values)

                    detailedView = {
                        age_report: { data: age_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(age_report[0].length === 0 ? [] : age_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        apps_and_urls_report: { data: apps_and_urls_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(apps_and_urls_report[0].length === 0 ? [] : apps_and_urls_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        city_report: { data: city_report[0], columns: Object.keys(city_report[0].length === 0 ? [] : city_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        creative_report: { data: creative_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(creative_report[0].length === 0 ? [] : creative_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        device_report: { data: device_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(device_report[0].length === 0 ? [] : device_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        gender_report: { data: gender_report[0].map(d => ({ ...d, ctr: `${d.ctr}%` })), columns: Object.keys(gender_report[0].length === 0 ? [] : gender_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) },
                        isp_or_carrier_report: { data: isp_or_carrier_report[0], columns: Object.keys(isp_or_carrier_report[0].length === 0 ? [] : isp_or_carrier_report[0][0]).filter(col => !['sr_no', 'camp_id', 'client_name', 'campaign_name', 'client_id',].includes(col)) }
                    }

                }

            }
            return res.status(200).json({ tableView: tableView, detailedView: detailedView, mainAccess })




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


export const clientdashboardadmin = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin')) {
        try {
            const { clientName, campId } = req.query

            const camp_info_query = 'select count(campaign_name) as total_campaigns, count(if(end_date>curdate(),1,null)) as live_campaigns,  count(if(end_date<=curdate(),1,null)) as closed_campaigns from campaigndetails where client_name=?'
            const camp_info_values = [clientName]
            const infoResult = await db.promise().query(camp_info_query, camp_info_values)
            const campInfo = infoResult[0][0]
            // const campaigns_query = 'select campaign_name, camp_id from campaigndetails where client_id=? order by start_date desc;'
            // const campaignsResult = await db.promise().query(campaigns_query, [client_id])
            // const campaigns = campaignsResult[0]
            // //---------------------------------------
            // const most_recent_campaign_query = 'select campaigndetails.campaign_name, campaigndetails.camp_id from campaigndetails inner join reportdetails  on reportdetails.camp_id = campaigndetails.camp_id where  campaigndetails.client_id = ? order by start_date desc limit 1;'
            // const mostRecentCampResult = await db.promise().query(most_recent_campaign_query, [client_id])
            // const mostRecentCamp = mostRecentCampResult[0]

            // //// console.log(campInfo)
            // // const campaign_records_query = 'select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, campaigndetails.camp_based_on, campaigndetails.client_camp_access from reportdetails inner join campaigndetails on reportdetails.camp_id=reportdetails.camp_id where reportdetails.camp_id=(select campaigndetails.camp_id from campaigndetails inner join reportdetails  on reportdetails.camp_id = campaigndetails.camp_id where  campaigndetails.client_id = ? order by start_date desc limit 1) and campaigndetails.client_id=? limit 30;'
            // // const recordResult = await db.promise().query(campaign_records_query, [client_id, client_id])

            let areaGraphData = { labels: [], data: [] }
            let donutGraphData = { labels: [], data: [] }
            let tableData = { headers: [], data: [] }


            // const { camp_id } = mostRecentCamp[0]
            // selectedCamp = mostRecentCamp[0]
            const top_30_dates_query = 'select distinct date from reportdetails where camp_id = ? order by date desc limit 30;'
            const top_30Result = await db.promise().query(top_30_dates_query, [campId])
            const dates = top_30Result[0].map(val => new Date(val.date))
            dates.reverse()
            //// console.log(camp_id, dates)
            const campaign_records_query = 'select reportdetails.id, reportdetails.client_name, reportdetails.campaign_name, state, city, date, impressions, cpm, clicks, cpc, sessions, cps, total_cpm, total_cpc, total_cps, reportdetails.ctr, reportdetails.camp_id, reportdetails.client_id, campaigndetails.camp_based_on, campaigndetails.client_camp_access from reportdetails inner join campaigndetails on campaigndetails.camp_id=reportdetails.camp_id where campaigndetails.client_name = ? and campaigndetails.camp_id =? and reportdetails.date in (?)'
            const recordResult = await db.promise().query(campaign_records_query, [clientName, campId, dates])
            const campRecords = recordResult[0]
            const campBasedOn = campRecords[0]['camp_based_on'].split(',')
            const clientAccess = campRecords[0]['client_camp_access'].split(',')
            let col = Object.keys(campRecords[0])
            //// console.log('test',campBasedOn.map(camp => ({ [camp]:dates.map(date=>campRecords.filter(rec=>new Date(rec.date).toString()===new Date(date).toString()).reduce((acc,curr)=>acc+curr[camp],0))})))
            // const obj = {}
            // dates.forEach(date=>{
            //     const day_rec = campRecords.filter(rec=>new Date(rec.date).toString()===new Date(date).toString())
            //     let im; 
            //     day_rec.forEach(rec)
            // })

            col = col.filter(name => [...clientAccess, 'state', 'city', 'date'].includes(name))
            areaGraphData = { labels: dates.map(date => new Date(date).toLocaleString(undefined, { month: 'short', day: '2-digit' }).slice(0, 10)), data: campBasedOn.map(camp => ({ [camp]: dates.map(date => campRecords.filter(rec => new Date(rec.date).toString() === new Date(date).toString()).reduce((acc, curr) => acc + curr[camp], 0)) })) }
            donutGraphData = { labels: campBasedOn.map(camp => camp[0].toUpperCase() + camp.slice(1,)), data: campBasedOn.map(camp => (campRecords.reduce((acc, curr) => acc + curr[camp], 0))) }
            //// console.log(col)
            const newData = []
            campRecords.forEach(rec => {
                const newObj = {}

                col.forEach(col => {
                    newObj[col] = rec[col]
                })
                newData.push(newObj)
            })

            tableData = { headers: col.map(col => ({ field: col, header: col.toUpperCase().replace('_', ' ') })), data: newData }





            //// console.log(campRecords[0]['campaign_name'])
            return res.send({ campInfo: campInfo, areaGraphData: areaGraphData, donutGraphData: donutGraphData, tableData: tableData, selectedCamp: campRecords[0]['campaign_name'] })
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