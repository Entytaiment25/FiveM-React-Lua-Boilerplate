fx_version 'cerulean'
game 'gta5'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
node_version '22'

name 'fivem-react-boilerplate-lua'
author "Project Error"
version '1.0.0'
repository 'https://github.com/project-error/fivem-react-boilerplate-lua'
description "Basic React (TypeScript) & Lua Game Scripts Boilerplate"

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
