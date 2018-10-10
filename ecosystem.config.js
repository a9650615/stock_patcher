module.exports = {
  apps : [{
    name: "schedule-world",
    script: "./lib/index.js",
    args: "schedule-patch-all",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  },{
    name: "schedule-twStock",
    script: "./lib/index.js",
    args: "schedule-patch-all --source twse",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}