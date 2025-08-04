module.exports = {
    apps: [
        {
            name: 'next-app',
            script: process.env.NODE_ENV === 'production'
                ? 'node_modules/next/dist/bin/next'
                : 'node_modules/next/dist/bin/next',
            args: process.env.NODE_ENV === 'production' ? 'start' : 'dev',
            cwd: './',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'ws-proxy',
            script: 'node_modules/.bin/ts-node',
            args: 'server/websockify.ts',
            cwd: './',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
