fx_version 'cerulean'
game 'gta5'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
node_version '22'

name 'FiveM-React-Lua-Boilerplate'
author "Entytaiment25, Project Error"
version '1.0.1'
repository 'https://github.com/Entytaiment25/FiveM-React-Lua-Boilerplate'
description "A basic boilerplate for FiveM using Lua 5.4 and React 19 (TypeScript), integrated with Biome.js, Shadcn, Tailwind CSS v4, and Node.js 22. "

dependencies {
  '/server:12913',
}

client_script "client/**/*"
server_script "server/**/*"

files {
  'web/build/index.html',
  'web/build/**/*',
}

ui_page 'web/build/index.html'
