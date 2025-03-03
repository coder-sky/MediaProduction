module.exports = {
    apps: [{
        name: "Adzeusmedia backend",
        script: "./server.js",
        watch: true,
        ignore_watch: ["uploads", "views", "public", "logs"],
        error_file: "./logs/err.log",
        out_file: "./logs/out.log",
        time: true
    }]
}