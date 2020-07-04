module.exports = {
  apps: [
    {
      name: "zoho",
      script: "main.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
  deploy: {
    production: {
      user: "nodejs",
      host: "ec2-52-3-66-103.compute-1.amazonaws.com",
      ref: "origin/master",
      repo: "https://github.com/theleejenkins/zoho.git",

      // Make sure this directory exists on your server or change this entry to match your directory structure
      path: "/home/nodejs/deploy",

      // "post-deploy":
      //   "cp ../.env ./ && yarn && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
