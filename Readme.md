# sfdx-xy-plugin

a plugin for sfdx develope and [xysfdx](https://github.com/exiahuang/xysfdx)

## use Username-Password OAuth Authentication

```
sfdx xy:auth:username:login -u username -p password -a alias -r instanceurl
```

# install

## Install as plugin

```sh
# install
sfdx plugins:install sfdx-xy-plugin

# show plugin
sfdx plugins

# run
sfdx xy:auth:username:login --help
```

## Install from source

```sh
git clone https://github.com/exiahuang/sfdx-xy-plugin.git
cd sfdx-xy-plugin
npm install
sfdx plugins:link .
```

## just run it

```
./bin/run xy:auth:username:login
```

# Acknowledgement

-   [Create Your First Salesforce CLI Plugin](https://developer.salesforce.com/blogs/2018/05/create-your-first-salesforce-cli-plugin.html)
-   `src\commands\xy\auth\username\login.ts` is from [wadewegner/sfdx-waw-plugin](https://github.com/wadewegner/sfdx-waw-plugin)
