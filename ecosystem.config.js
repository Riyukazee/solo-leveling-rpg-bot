module.exports = {
  apps: [{
    name: "solo-leveling-rpg",
    script: "index.js",
    cwd: "/root/solo-leveling-rpg-bot",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production"
    }
  }]
}
