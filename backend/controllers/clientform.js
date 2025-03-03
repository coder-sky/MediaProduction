import cloudinary from "../config/cloudinaryconfig.js"
import { transporter } from "../config/emailconfig.js";
import db from "../config/mysqlconnection.js"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'


export const addclientdetails = (req, res) => {
   
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        const { clientName, clientUserName, password, clientEmail, dateOfJoining,  sendMail } = JSON.parse(req.body.clientData)
        const checkuser_query = 'select * from logindetails where binary client_name=? or binary username=?'
        const checkuser_values = [clientName, clientUserName]
        // console.log(req.file)
        let logo = ''
        logo = req.file?.path ==='' || !req.file ?'':req.file?.path.slice(req.file?.path.indexOf('\\'))
        // console.log(logo)
        db.query(checkuser_query, checkuser_values, async (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json('Server Error Contact Admin!')
            }
            else {
                if (result.length === 0) {
                    // let logoUrl = '';
                    // if (logoUrl !== '') {
                    //     try {
                    //         const img_res = await cloudinary.uploader.upload(logoUrl, { upload_preset: process.env.UPLOAD_PRESET_COMPANYLOGOS })
                    //         // console.log(img_res)
                    //         // Optimize delivery by resizing and applying auto-format and auto-quality
                    //         const optimizeUrl = cloudinary.url(img_res.url, {
                    //             fetch_format: 'auto',
                    //             quality: 'auto'
                    //         });

                    //         logoUrl = optimizeUrl;
                    //     }
                    //     catch (err) {
                    //         console.log(err)
                    //         return res.status(500).json('something went wrong try again!')

                    //     }
                    // }
                    const encryptedPassword = bcrypt.hashSync(password, 12)
                    const id = uuidv4()

                    try {
                        const insert_clientdatails_query = 'insert into logindetails values(?)'
                        const insert_clientdatails_values = [[id, clientName, clientUserName, encryptedPassword, clientEmail, dateOfJoining, logo, 'client']]
                        await db.promise().query(insert_clientdatails_query, insert_clientdatails_values)
                        // -------------------------mail----------------------
                        const mailOptions = {
                            from: '"AdZeusMedia"', // sender address
                            to: [clientEmail],
                            subject: `Login Credentials`,
                            template: 'UserRegister', // the name of the template file i.e email.handlebars
                            context: {
                                clientName: clientName,
                                clientUserName: clientUserName,
                                password: password,

                            }
                        };
                        if(sendMail==='yes'){
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return // console.log(error);
                                }
                                //// console.log(info)
                                // console.log('Message sent: ' + info.response);
                            })
                        }
                        
                        return res.send('Client data added successfully')

                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('Server Error Contact Admin!')
                    }


                }
                else {
                    const { client_name, username } = result[0]
                    if (client_name === clientName) {
                        return res.status(406).json('Client Name Already Exists!')
                    }
                    else if (username === clientUserName) {
                        return res.status(406).json('Client Username Already Exists!')
                    }
                }
            }
        })

    }
    else {
        return res.status(406).json('Invalid Access')
    }


    //res.send('ok')
}

export const clientdetails = (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && (role === 'superadmin' || role === 'user')) {
        const client_details_query = 'select id, client_name, username, email, date_of_joining, company_logo from logindetails where role="client" order by date_of_joining desc;'
        db.query(client_details_query, (err, result) => {
            if (err) {
                console.log(err)
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

}

export const deleteclient = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    if (isAuth && role === 'superadmin') {
        // console.log(req.body,)
        const { id, company_logo } = req.body

        if (company_logo !== '') {
            // console.log(company_logo)
            fs.rmSync( 'public'+company_logo, { force: true });
            // // console.log(company_logo)
            // const url = company_logo.slice(0, company_logo.lastIndexOf('/'))
            // const img_name = company_logo.slice(company_logo.lastIndexOf('/'), company_logo.lastIndexOf('.'))
            // const path = url.slice(url.lastIndexOf('/') + 1,) + img_name
            // // console.log(path)
            // const publicId = company_logo.slice(company_logo.lastIndexOf('/') + 1, company_logo.lastIndexOf('.'))
            // try {
            //     await cloudinary.uploader.destroy(publicId)
            //     // console.log('path', publicId)
            // }
            // catch (err) {
            //     console.log(err)
            //     return res.status(500).json('Server Error Contact Admin!')
            // }

        }
        const client_delate_query = 'delete from logindetails where id=?'
        const daily_data_report_delete_query = 'delete from daily_data_report where client_id=?'
        const age_data_report_delete_query = 'delete from age_data_report where client_id=?'
        const apps_and_urls_data_report_delete_query = 'delete from apps_and_urls_data_report where client_id=?'
        const city_data_report_delete_query = 'delete from city_data_report where client_id=?'
        const creative_data_report_delete_query = 'delete from creative_data_report where client_id=?'
        const device_data_report_delete_query = 'delete from device_data_report where client_id=?'
        const gender_data_report_delete_query = 'delete from gender_data_report where client_id=?'
        const isp_or_carrier_data_report_delete_query = 'delete from isp_or_carrier_data_report where client_id=?'
        try {
            await db.promise().query(client_delate_query, [id])
            await db.promise().query(daily_data_report_delete_query, [id])
            await db.promise().query(age_data_report_delete_query, [id])
            await db.promise().query(apps_and_urls_data_report_delete_query, [id])
            await db.promise().query(city_data_report_delete_query, [id])
            await db.promise().query(creative_data_report_delete_query, [id])
            await db.promise().query(device_data_report_delete_query, [id])
            await db.promise().query(gender_data_report_delete_query, [id])
            await db.promise().query(isp_or_carrier_data_report_delete_query, [id])
            
            return res.send('Client deleted successfully')
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

export const editclient = async (req, res) => {
    const { isAuth, role } = req.checkAuth
    // console.log(req.file, req.body)
    if (isAuth && role === 'superadmin') {
        // console.log('Body',req.body,)
        const prevData = JSON.parse(req.body.prevData)
        const newData = JSON.parse(req.body.newData)
        let logo = '';
        if (prevData.logo.filename===newData.logo.filename) {
            logo = newData.logo.filename
        }
        else {
            try {
                // console.log(newData.logo.filename, prevData.logo.filename, )
                if (newData.logo.filename === '') {
                    const company_logo = prevData.logo.filename;
                    // console.log(company_logo)
                    // const publicId = company_logo.slice(company_logo.lastIndexOf('/') + 1, company_logo.lastIndexOf('.'));
                    // //// console.log(publicId)
                    // await cloudinary.uploader.destroy(publicId);
                    fs.rmSync('public/client/' + company_logo, { force: true });
                    logo = ''

                }
                else {
                    // const img_res = await cloudinary.uploader.upload(newData.url, { upload_preset: process.env.UPLOAD_PRESET_COMPANYLOGOS })
                    // //// console.log(img_res)
                    // // Optimize delivery by resizing and applying auto-format and auto-quality
                    // const optimizeUrl = cloudinary.url(img_res.url, {
                    //     fetch_format: 'auto',
                    //     quality: 'auto'
                    // });
                    if(prevData.logo.filename===newData.logo.filename){
                        fs.rmSync('public/client/' + prevData.logo.filename, { force: true });
                    }

                    logo = req.file?.path ==='' || !req.file ?'':req.file?.path.slice(req.file?.path.indexOf('\\'));

                }

            }
            catch (err) {
                console.log(err)
            }
        }
        // console.log('logo', logo)
        try {
            const { id, email, date_of_joining } = newData
            const update_client_query = 'update logindetails set email=?, date_of_joining=?, company_logo=? where id=?'
            const update_client_values = [email, date_of_joining, logo, id]
            
            await db.promise().query(update_client_query, update_client_values)
            return res.send('Client data updated successfully')

        }
        catch (err) {
            console.log(err)
            return res.status(500).json('Server Error Contact Admin!')

        }

    }
    else {
        return res.status(406).json('Invalid Access')
    }
    // res.send('ok')

}